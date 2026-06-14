import React from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30 p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8 md:p-10 max-w-md w-full text-center animate-scale-in">

        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="p-4 bg-emerald-100 rounded-2xl">
            <CheckCircle className="h-14 w-14 md:h-20 md:w-20 text-emerald-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl md:text-2xl font-bold mt-6 text-slate-900">
          Payment Successful 🎉
        </h1>

        {/* Message */}
        <p className="text-slate-500 mt-2 text-sm md:text-base">
          Thank you for your purchase! Your order has been placed successfully.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => navigate("/products")}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all font-medium text-sm md:text-base shadow-md shadow-indigo-200/50 flex items-center justify-center gap-2"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="w-full border border-indigo-200 text-indigo-600 py-3 rounded-xl hover:bg-indigo-50 transition-all font-medium text-sm md:text-base"
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;