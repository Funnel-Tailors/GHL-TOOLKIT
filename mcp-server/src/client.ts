import { getConfig, getHeaders } from "./auth.js";
import type { GHLConfig, RequestOptions } from "./types.js";

// Rate limiter: max 10 requests per second (GHL allows 100/10s, we stay conservative)
const RATE_LIMIT_WINDOW_MS = 1000;
const MAX_REQUESTS_PER_WINDOW = 10;
const MAX_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 500;

let requestTimestamps: number[] = [];

function generateIdempotencyKey(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

async function waitForRateLimit(): Promise<void> {
  const now = Date.now();
  // Remove timestamps older than the window
  requestTimestamps = requestTimestamps.filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS
  );

  if (requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldestInWindow = requestTimestamps[0];
    const waitTime = RATE_LIMIT_WINDOW_MS - (now - oldestInWindow) + 10;
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  requestTimestamps.push(Date.now());
}

function buildUrl(
  baseUrl: string,
  path: string,
  query?: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(path, baseUrl);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

async function retryWithBackoff(
  fn: () => Promise<Response>,
  retries: number = MAX_RETRIES
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await fn();

    // Success or client error (don't retry 4xx except 429)
    if (response.ok || (response.status >= 400 && response.status < 500 && response.status !== 429)) {
      return response;
    }

    // Last attempt, return whatever we got
    if (attempt === retries) {
      return response;
    }

    // Calculate delay with exponential backoff + jitter
    const retryAfter = response.headers.get("Retry-After");
    let delay: number;

    if (retryAfter) {
      delay = parseInt(retryAfter, 10) * 1000;
    } else {
      const baseDelay = BASE_RETRY_DELAY_MS * Math.pow(2, attempt);
      const jitter = baseDelay * 0.2 * (Math.random() * 2 - 1); // ±20%
      delay = baseDelay + jitter;
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Should never reach here
  throw new Error("Retry loop exited unexpectedly");
}

export async function ghlRequest<T = unknown>(
  options: RequestOptions
): Promise<T> {
  const config = getConfig();
  const headers = getHeaders(config);

  await waitForRateLimit();

  // Add idempotency key for write operations
  if (
    (options.method === "POST" || options.method === "PUT") &&
    !options.idempotencyKey
  ) {
    headers["Idempotency-Key"] =
      options.idempotencyKey || generateIdempotencyKey();
  }

  const url = buildUrl(config.baseUrl, options.path, options.query);

  const response = await retryWithBackoff(() =>
    fetch(url, {
      method: options.method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })
  );

  if (!response.ok) {
    const errorBody = await response.text();
    let errorMessage: string;
    try {
      const parsed = JSON.parse(errorBody);
      errorMessage = parsed.message || parsed.error || errorBody;
    } catch {
      errorMessage = errorBody;
    }
    throw new Error(
      `GHL API Error ${response.status}: ${errorMessage} [${options.method} ${options.path}]`
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

export function getLocationId(): string {
  return getConfig().locationId;
}
