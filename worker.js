import { processOffer } from './lib/offer.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/offer') {
      if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
      const raw = await request.text();
      if (raw.length > 50_000) return Response.json({ ok: false, error: 'too_large' }, { status: 413 });
      const { status, body } = await processOffer(raw, env);
      return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
    }
    return env.ASSETS.fetch(request);
  }
};
