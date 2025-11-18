import getServerSession from "next-auth";
import { authConfig } from "../auth/auth.config";

export async function GET() {
  const session = await getServerSession(authConfig);

  if (session) {
    return new Response(
      JSON.stringify({ content: "You are signed in. Protected content." }),
      { status: 200 }
    );
  } else {
    return new Response(
      JSON.stringify({ error: "You must be signed in to view this content." }),
      { status: 401 }
    );
  }
}
