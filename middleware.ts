import { auth } from "./app/api/auth/[...nextauth]/auth"

export default auth((req) => {
  // protect all routes except API and static files
  return;
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
