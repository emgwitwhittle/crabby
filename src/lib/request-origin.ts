import type { NextRequest } from "next/server";

// Behind a reverse proxy (Railway, etc.) the request the app container sees
// often has an internal Host header rather than the public domain, so
// building redirect URLs from request.url/request.nextUrl.origin can resolve
// to "localhost" or an internal address. Trust the standard forwarded
// headers the proxy sets instead, falling back to the request's own origin
// for local dev where there's no proxy in front.
export function getRequestOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (!forwardedHost) return request.nextUrl.origin;

  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
  return `${forwardedProto}://${forwardedHost}`;
}
