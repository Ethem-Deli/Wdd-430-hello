"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="p-8">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!session) return null;

  // Dashboard Data
  const summaryCards = [
    { label: "Collected", value: "$7,498.25" },
    { label: "Pending", value: "$2,350.90" },
    { label: "Total Invoices", value: "845" },
    { label: "Total Customers", value: "267" },
  ];

  const revenueData = [
    { month: "Jan", revenue: 4500 },
    { month: "Feb", revenue: 3200 },
    { month: "Mar", revenue: 5100 },
    { month: "Apr", revenue: 6100 },
    { month: "May", revenue: 7200 },
    { month: "Jun", revenue: 6800 },
  ];

  const invoices = [
    {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      amount: "$450.00",
      avatar: "https://i.pravatar.cc/150?img=32",
    },
    {
      name: "Michael Brown",
      email: "michael@example.com",
      amount: "$220.00",
      avatar: "https://i.pravatar.cc/150?img=14",
    },
    {
      name: "Emily Davis",
      email: "emily@example.com",
      amount: "$980.00",
      avatar: "https://i.pravatar.cc/150?img=25",
    },
  ];

  return (
    <div className="p-8 space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome, {session.user?.name} — {session.user?.email}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((item) => (
          <div
            key={item.label}
            className="p-6 rounded-xl border shadow-sm bg-white"
          >
            <p className="text-gray-500 text-sm">{item.label}</p>
            <p className="text-2xl font-semibold mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="p-6 rounded-xl border shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Recent Revenue</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Latest Invoices */}
      <div className="p-6 rounded-xl border shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Latest Invoices</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="py-2">Customer</th>
              <th className="py-2">Email</th>
              <th className="py-2">Amount</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.email} className="border-b">
                <td className="py-3 flex items-center gap-3">
                  <img
                    src={inv.avatar}
                    className="w-10 h-10 rounded-full"
                    alt=""
                  />
                  <span className="font-medium">{inv.name}</span>
                </td>
                <td className="py-3 text-gray-600">{inv.email}</td>
                <td className="py-3 font-semibold">{inv.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-gray-500 text-sm mt-4">Updated just now</p>
      </div>
    </div>
  );
}
