import type { GHLConfig } from "./types.js";

export function getConfig(): GHLConfig {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey) {
    throw new Error(
      "GHL_API_KEY not set. Add it to your .env.local or export it before running Claude."
    );
  }

  if (!locationId) {
    throw new Error(
      "GHL_LOCATION_ID not set. Add it to your .env.local or export it before running Claude."
    );
  }

  return {
    apiKey,
    locationId,
    baseUrl: "https://services.leadconnectorhq.com",
    version: "2021-07-28",
  };
}

export function getHeaders(config: GHLConfig): Record<string, string> {
  return {
    Authorization: `Bearer ${config.apiKey}`,
    Version: config.version,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}
