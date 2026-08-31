// Plain constants only — no "server-only"/"next/headers" imports — so this
// can be safely imported from the Edge middleware as well as server code.

export const SESSION_COOKIE = "crabby_token";

// Ten years — logins are permanent personal links, no re-login or expiry.
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 365 * 10;

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: SESSION_MAX_AGE_SECONDS,
  path: "/",
};
