import "server-only";
import { cookies } from "next/headers";
import { getUserByToken, type UserRecord } from "@/lib/airtable";

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

export async function getCurrentUser(): Promise<UserRecord | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return getUserByToken(token);
}
