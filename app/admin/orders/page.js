"use client";
import { useState, useEffect } from "react";
import Loading from "@/components/Loading";

function AdminOrders() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timerId);
  }, []);

  if (loading) {
    return <Loading message="Loading orders..." />;
  }

  const orders = [
    {
      id: "ORD-1024",
      customer: "Darshan",
      total: "Rs. 820",
      status: "Preparing",
    },
    { id: "ORD-1025", customer: "Amit", total: "Rs. 450", status: "Delivered" },
    {
      id: "ORD-1026",
      customer: "Sneha",
      total: "Rs. 1,120",
      status: "Pending",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-gray-600">Manage customer orders.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-5 py-3">Order ID</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-5 py-4 font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="px-5 py-4 text-gray-600">{order.customer}</td>
                <td className="px-5 py-4 text-gray-600">{order.total}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;
