/* Packr ad landing pages — carry the ad's UTM tags into the CTAs.
   Calendly records utm_* on the booking (and in its webhooks), so every
   demo can be traced back to the ad that sent it. The tags are kept in
   sessionStorage for the visit, so a reload without them still counts.
   If the ad URL has no utm_campaign, the page's theme fills it in. */
(() => {
  'use strict';

  const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const STORE = 'pk_lp_utm';
  const theme = document.body.getAttribute('data-lp') || 'unknown';

  const params = new URLSearchParams(window.location.search);
  let utm = {};
  KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) utm[k] = v.slice(0, 200);
  });

  try {
    if (Object.keys(utm).length) sessionStorage.setItem(STORE, JSON.stringify(utm));
    else utm = JSON.parse(sessionStorage.getItem(STORE) || '{}') || {};
  } catch (_) { /* storage blocked — use what's on the URL */ }

  if (!utm.utm_campaign) utm.utm_campaign = `lp-${theme}`;

  document.querySelectorAll('a[href*="calendly.com"], a[href*="app.packr.io/start"]').forEach((a) => {
    const url = new URL(a.href);
    Object.entries(utm).forEach(([k, v]) => {
      if (!url.searchParams.has(k)) url.searchParams.set(k, v);
    });
    a.href = url.toString();
  });
})();
