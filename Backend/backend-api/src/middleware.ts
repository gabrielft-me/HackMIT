import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGIN = '*';

export function middleware(request: NextRequest) {
  if (request.method === 'OPTIONS') {
    const preflight = new NextResponse(null, { status: 204 });
    preflight.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    preflight.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    preflight.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    preflight.headers.set('Access-Control-Max-Age', '86400');
    return preflight;
  }

  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  response.headers.set('ngrok-skip-browser-warning', 'true');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  return response;
}

export const config = {
  matcher: '/api/:path*',
};


