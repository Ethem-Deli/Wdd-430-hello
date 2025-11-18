import { auth } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
  const session = await auth();

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
