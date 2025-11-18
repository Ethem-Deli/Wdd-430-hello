import { getServerSession } from "next-auth/next"
import { auth } from "@/app/api/auth/[...nextauth]/route";

export default async function handler(req, res) {
  const session = await auth();

  if (session) {
    res.status(200).json({
      content: "You are signed in. Protected content.",
    });
  } else {
    res.status(401).json({
      error: "You must be signed in to view this content.",
    });
  }
}
