import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest): NextResponse {
  const auth = req.headers.get("authorization") || "";
  const [_type, token] = auth.split(" ");
  if (!token) return unauthorized();

  const [user, pass] = Buffer.from(token, "base64").toString().split(":");

  if (
    user !== process.env.BASIC_AUTH_USER ||
    pass !== process.env.BASIC_AUTH_PASSWORD
  ) {
    return unauthorized();
  }

  return NextResponse.next();
}

function unauthorized(): NextResponse {
  return new Response("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Protected"' },
  }) as unknown as NextResponse;
}

// Apply to every route except static files
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
