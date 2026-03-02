# Webhook Patterns — Patrones de Integración Landing → GHL

## Patrón 1: Webhook Directo (sin backend)

```javascript
// En el form submit handler
async function handleSubmit(formData) {
  const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/WORKFLOW_ID/webhook';

  const payload = {
    // Datos del contacto
    first_name: formData.get('firstName'),
    last_name: formData.get('lastName'),
    email: formData.get('email'),
    phone: formData.get('phone'),

    // Respuestas de cualificación
    budget: formData.get('budget'),
    timeline: formData.get('timeline'),
    role: formData.get('role'),

    // Hidden fields
    utm_source: formData.get('utm_source'),
    utm_medium: formData.get('utm_medium'),
    utm_campaign: formData.get('utm_campaign'),
    fbc: formData.get('fbc'),
    fbp: formData.get('fbp'),
    time_on_page: formData.get('time_on_page'),
    scroll_depth: formData.get('scroll_depth'),
    landing_url: formData.get('landing_url'),
    event_id: formData.get('event_id'),
  };

  const response = await fetch(GHL_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    // Redirect to thank you page
    window.location.href = '/thank-you';
  }
}
```

## Patrón 2: Next.js API Route

```typescript
// app/api/qualify/route.ts
import { NextResponse } from 'next/server';

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_BASE_URL = 'https://services.leadconnectorhq.com';

export async function POST(request: Request) {
  const data = await request.json();

  // 1. Calculate score
  const responseScore = calculateResponseScore(data);
  const behaviorScore = calculateBehaviorScore(data);
  const totalScore = responseScore + behaviorScore;
  const status = totalScore >= 70 ? 'HOT' : totalScore >= 40 ? 'WARM' : totalScore >= 20 ? 'COLD' : 'DISQUALIFIED';

  // 2. Create contact in GHL
  const contact = await fetch(`${GHL_BASE_URL}/contacts/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GHL_API_KEY}`,
      'Version': '2021-07-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      locationId: GHL_LOCATION_ID,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      tags: [`score-${status.toLowerCase()}`, 'funnel-entered'],
      source: data.utm_source || 'direct',
      customFields: [
        { id: 'lead_score_field_id', field_value: totalScore },
        { id: 'response_score_field_id', field_value: responseScore },
        { id: 'behavior_score_field_id', field_value: behaviorScore },
        { id: 'qualification_status_field_id', field_value: status },
        { id: 'form_responses_field_id', field_value: JSON.stringify(data) },
        { id: 'utm_source_field_id', field_value: data.utm_source },
        { id: 'utm_medium_field_id', field_value: data.utm_medium },
        { id: 'utm_campaign_field_id', field_value: data.utm_campaign },
      ],
    }),
  });

  const contactData = await contact.json();

  // 3. Return score for thank you page personalization
  return NextResponse.json({
    success: true,
    contactId: contactData.contact?.id,
    score: totalScore,
    status,
  });
}

function calculateResponseScore(data: Record<string, string>): number {
  let score = 0;
  // Customize per project
  if (['5k+', '2k-5k'].includes(data.budget)) score += 15;
  if (['this_month', 'this_week'].includes(data.timeline)) score += 10;
  if (['ceo', 'founder', 'director'].includes(data.role)) score += 10;
  if (data.problem && data.problem.length > 50) score += 10;
  return Math.min(score, 50);
}

function calculateBehaviorScore(data: Record<string, string>): number {
  let score = 0;
  if (Number(data.time_on_page) > 180) score += 10;
  if (Number(data.scroll_depth) > 75) score += 5;
  if (Number(data.video_watch_pct) > 50) score += 10;
  return Math.min(score, 30);
}
```

## Patrón 3: Behavior Tracking Script

```javascript
// tracking.js — Include in landing page <head>
(function() {
  const startTime = Date.now();
  let maxScroll = 0;
  let videoWatchPct = 0;

  // Scroll tracking
  window.addEventListener('scroll', function() {
    const pct = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    maxScroll = Math.max(maxScroll, pct);
  });

  // YouTube video tracking (if present)
  window.onYouTubeIframeAPIReady = function() {
    const iframe = document.querySelector('iframe[src*="youtube"]');
    if (!iframe) return;
    const player = new YT.Player(iframe, {
      events: {
        onStateChange: function(event) {
          if (event.data === YT.PlayerState.PLAYING) {
            const interval = setInterval(function() {
              videoWatchPct = Math.round(
                (player.getCurrentTime() / player.getDuration()) * 100
              );
              if (videoWatchPct >= 100) clearInterval(interval);
            }, 1000);
          }
        }
      }
    });
  };

  // Expose data for form submission
  window.getBehaviorData = function() {
    return {
      time_on_page: Math.round((Date.now() - startTime) / 1000),
      scroll_depth: maxScroll,
      video_watch_pct: videoWatchPct,
      page_visits: parseInt(localStorage.getItem('_visits') || '0') + 1,
      landing_url: window.location.href,
      referrer: document.referrer,
      device_type: /Mobi/.test(navigator.userAgent) ? 'mobile' : 'desktop',
    };
  };

  // Track visits
  localStorage.setItem('_visits', window.getBehaviorData().page_visits);
})();
```
