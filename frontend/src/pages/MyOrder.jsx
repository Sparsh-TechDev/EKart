import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderCard from "@/components/OrderCard";

const MyOrder = () => {
  // Start with null so we can tell the difference between "loading" and "empty"
  const [userOrder, setUserOrder] = useState(null);

  const getUserOrders = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      
      const res = await axios.get(`${import.meta.env.VITE_URL}/orders/my-order`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      // LOG THE DATA TO SEE EXACTLY WHAT THE BACKEND SENDS
      console.log("Orders fetched successfully:", res.data);

      if (res.data.success) {
        setUserOrder(res.data.orders);
      }
    } catch (error) {
      // PROPERLY LOG THE ERROR SO IT ISN'T SILENT
      console.error("❌ API Fetch Error:", error.response?.data || error.message);
      // Fallback to an empty array so it at least says "No orders found" instead of staying blank
      setUserOrder([]); 
    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);

  return (
  <div className="min-h-screen bg-slate-50 rounded-3xl">
    <div className="max-w-7xl mx-auto px-6 py-10">
      <OrderCard userOrder={userOrder} />
    </div>
  </div>
);
};

export default MyOrder;