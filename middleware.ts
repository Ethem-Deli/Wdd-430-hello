import { NextRequest } from "next/server";
import { checkAuth } from "./app/api/auth/[...nextauth]/middlewareAuth";

export default async function middleware(req: NextRequest) {
  return checkAuth(req);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
