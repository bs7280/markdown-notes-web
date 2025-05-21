import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest): NextResponse {
  const auth = req.headers.get("authorization");
  if (!auth) return unauthorized();

  // ignore the first part (“Basic”) and grab the token
  const [, token] = auth.split(" ");
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
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Protected"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
