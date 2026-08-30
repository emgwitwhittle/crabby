import { NextRequest, NextResponse } from "next/server";
import { getUserByToken } from "@/lib/airtable";
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/session";

export async function GET(request: NextRequest, { params }: RouteContext<"/login/[token]">) {
  const { token } = await params;
  const user = await getUserByToken(token);

  const url = new URL(user ? "/" : "/login/invalid", request.url);
  const response = NextResponse.redirect(url);

  if (user) {
    response.cookies.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
  }

  return response;
}
