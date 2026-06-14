import React from "react";
import Navbar from "@/components/Navbar";
import MyOrder from "./MyOrder";

const MyOrders = () => {
  return (
    <>
      <Navbar />

      <div className="pt-20 md:pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MyOrder />
        </div>
      </div>
    </>
  );
};

export default MyOrders;