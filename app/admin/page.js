"use client";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";

function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timerId);
  }, []);

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }
  const stats = [
    { label: "Total Orders", value: "128", change: "+12%" },
    { label: "Restaurants", value: "42", change: "+4" },
    { label: "Revenue", value: "Rs. 48,250", change: "+18%" },
    { label: "Pending Orders", value: "9", change: "Live" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">Overview of FoodRush operations.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <div className="mt-3 flex items-end justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{stat.value}</h2>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>

          <div className="mt-4 space-y-3">
            {["ORD-1024", "ORD-1025", "ORD-1026"].map((order) => (
              <div
                key={order}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
              >
                <span className="font-medium text-gray-900">{order}</span>
                <span className="text-sm text-orange-600">Preparing</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>

          <div className="mt-4 grid gap-3">
            <button className="rounded-md bg-orange-600 px-4 py-3 text-left font-medium text-white hover:bg-orange-700">
              Add Restaurant
            </button>
            <button className="rounded-md border border-gray-300 px-4 py-3 text-left font-medium text-gray-700 hover:bg-gray-50">
              View Pending Orders
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
