/**
 * Open Human Design — Cloudflare Worker entry.
 *
 * Routes:
 *   /mcp          → remote MCP server (streamable HTTP, stateless)
 *   /api/auth/*   → better-auth (magic-link sign-in, sessions)
 *   /api/sync     → people sync (LWW deltas; session required)
 *   /*            → static SPA assets (Vite dist/, SPA fallback)
 *
 * See docs/PLATFORM.md.
 */

import { handleMcpRequest } from './mcp.js';
import { createAuth, getSession } from './auth.js';
import { handleSync } from './sync.js';

const MCP_CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id'
};

// /api CORS: credentialed, allowlisted origins only (Vite dev against
// wrangler dev; production is same-origin and never needs these).
const API_ORIGINS = new Set([
  'http://localhost:5174',
  'http://localhost:8788',
  'https://openhumandesign.com',
  'https://www.openhumandesign.com'
]);

function apiCors(request) {
  const origin = request.headers.get('Origin');
  if (!origin || !API_ORIGINS.has(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin'
  };
}

function withHeaders(response, extra) {
  if (!Object.keys(extra).length) return response;
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(extra)) headers.set(k, v);
  return new Response(response.body, { status: response.status, headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname === '/mcp') {
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: MCP_CORS });
      }
      return withHeaders(await handleMcpRequest(request), MCP_CORS);
    }

    if (pathname.startsWith('/api/')) {
      const cors = apiCors(request);
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: cors });
      }

      if (pathname.startsWith('/api/auth/')) {
        const auth = createAuth(env, url.origin);
        return withHeaders(await auth.handler(request), cors);
      }

      if (pathname === '/api/sync' && request.method === 'POST') {
        const session = await getSession(env, request);
        if (!session) {
          return withHeaders(Response.json({ error: 'unauthorized' }, { status: 401 }), cors);
        }
        return withHeaders(await handleSync(env, session, request), cors);
      }

      return withHeaders(Response.json({ error: 'not found' }, { status: 404 }), cors);
    }

    // Static assets (SPA) — wrangler serves env.ASSETS with SPA fallback
    return env.ASSETS.fetch(request);
  }
};
