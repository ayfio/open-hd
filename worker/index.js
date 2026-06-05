/**
 * Open Human Design — Cloudflare Worker entry.
 *
 * Routes:
 *   /mcp  → remote MCP server (streamable HTTP, stateless)
 *   /*    → static SPA assets (Vite dist/, SPA fallback)
 *
 * Phase 3+ adds /api/auth/* (better-auth) and /api/sync here.
 * See docs/PLATFORM.md.
 */

import { handleMcpRequest } from './mcp.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id'
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/mcp') {
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
      }
      const response = await handleMcpRequest(request);
      // Re-wrap to attach CORS (Response from transport may be immutable)
      const headers = new Headers(response.headers);
      for (const [k, v] of Object.entries(CORS_HEADERS)) headers.set(k, v);
      return new Response(response.body, { status: response.status, headers });
    }

    // Static assets (SPA) — wrangler serves env.ASSETS with SPA fallback
    return env.ASSETS.fetch(request);
  }
};
