import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/orders/all-order`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 pt-6 md:pt-8">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-500">Loading All Orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 pt-6 md:pt-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 md:mb-8">All Orders</h1>

      {orders?.length === 0 ? (
        <p className="text-slate-500 text-lg">No orders found</p>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-3 md:p-4 font-semibold text-xs md:text-sm text-slate-600">Order ID</th>
                  <th className="p-3 md:p-4 font-semibold text-xs md:text-sm text-slate-600">User</th>
                  <th className="p-3 md:p-4 font-semibold text-xs md:text-sm text-slate-600 text-center">Products</th>
                  <th className="p-3 md:p-4 font-semibold text-xs md:text-sm text-slate-600">Amount</th>
                  <th className="p-3 md:p-4 font-semibold text-xs md:text-sm text-slate-600">Status</th>
                  <th className="p-3 md:p-4 font-semibold text-xs md:text-sm text-slate-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 md:p-4 text-xs md:text-sm text-slate-500 font-mono max-w-[120px] truncate">{order._id}</td>
                    <td className="p-3 md:p-4 text-xs md:text-sm text-slate-600">
                      {order.user?.email || "Unknown User"}
                    </td>
                    <td className="p-3 md:p-4 text-xs md:text-sm text-slate-600 text-center">
                      × {order.products?.length || 0}
                    </td>
                    <td className="p-3 md:p-4 text-xs md:text-sm text-slate-800 font-semibold">
                      ₹{order.amount?.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3 md:p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] md:text-xs font-medium ${
                          order.status === "Paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : order.status === "Failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 md:p-4 text-xs md:text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;