// app/dashboard/page.tsx
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user?.name}</p>
      <p>Your email: {session.user?.email}</p>
    </div>
  );
}
