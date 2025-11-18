import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function checkAuth(req: Request) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  return NextResponse.next();
}
