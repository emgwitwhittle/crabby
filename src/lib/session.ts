import "server-only";
import { cookies } from "next/headers";
import { getUserByToken, type UserRecord } from "@/lib/airtable";
import { SESSION_COOKIE } from "@/lib/session-cookie";

export { SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/session-cookie";

export async function getCurrentUser(): Promise<UserRecord | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return getUserByToken(token);
}
