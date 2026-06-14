import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderCard = ({ userOrder }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-3">
      <div className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <Button variant="outline" onClick={() => navigate(-1)} className="rounded-xl">
              <ArrowLeft className="w-4 h-4" />
            </Button>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">My Orders</h1>

              <p className="text-xs md:text-sm text-slate-500">Track and manage your purchases</p>
            </div>
          </div>

          <div className="bg-indigo-100 text-indigo-700 px-3 md:px-4 py-1.5 md:py-2 rounded-full font-medium text-sm">
            {userOrder?.length || 0} Orders
          </div>
        </div>

        {userOrder === null ? (
          <p className="text-slate-500 text-lg md:text-xl">Loading your orders...</p>
        ) : userOrder.length === 0 ? (
          <div className="text-center py-16 md:py-20">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-700">No Orders Yet</h2>

            <p className="text-slate-500 mt-2 text-sm md:text-base">
              Start shopping to place your first order.
            </p>

            <Button
              className="mt-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl shadow-md shadow-indigo-200/50 cursor-pointer"
              onClick={() => navigate("/products")}
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6 w-full">
            {userOrder.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 p-4 md:p-6"
              >
                {/* --- Order Header --- */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                  <h2 className="text-sm md:text-base font-semibold text-slate-800">
                    Order ID: <span className="text-slate-500 text-xs md:text-sm break-all">{order._id}</span>
                  </h2>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Total Amount</p>
                    <p className="text-lg md:text-2xl font-bold text-indigo-600">
                      ₹{order.amount?.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* --- User Info & Status Badge --- */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                  <div>
                    <p className="text-xs md:text-sm text-slate-600">
                      <span className="font-medium">User: </span>
                      {order.user?.firstName || "Unknown"}{" "}
                      {order.user?.lastName}
                    </p>
                    <p className="text-xs text-slate-400">
                      Email: {order.user?.email || "N/A"}
                    </p>
                  </div>
                  <span
                    className={`text-white text-xs font-medium px-3 py-1 rounded-full ${
                      order.status === "Paid"
                        ? "bg-emerald-500"
                        : order.status === "Failed"
                          ? "bg-red-500"
                          : "bg-amber-400"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* --- Products List --- */}
                <h3 className="font-medium text-sm text-slate-700 mb-2">Products:</h3>
                <ul className="space-y-2">
                  {order.products?.map((product, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 md:gap-5 bg-slate-50 p-3 md:p-4 rounded-xl hover:bg-slate-100 transition-all"
                    >
                      {/* SAFE IMAGE RENDERING */}
                      {product.productId?.productImg?.[0]?.url ? (
                        <img
                          onClick={() =>
                            navigate(`/products/${product.productId._id}`)
                          }
                          src={product.productId.productImg[0].url}
                          alt="product"
                          className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover cursor-pointer flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-200 rounded-lg flex items-center justify-center text-[10px] text-slate-400 flex-shrink-0">
                          No Image
                        </div>
                      )}

                      {/* SAFE TEXT RENDERING */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-1 text-slate-800">
                          {product.productId?.productName ||
                            "Product Unavailable"}
                        </h3>

                        <p className="text-xs text-slate-400">
                          Qty: {product.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-indigo-600 text-sm whitespace-nowrap">
                        ₹{" "}
                        {product.productId?.productPrice.toLocaleString() || 0}{" "}
                        × {product.quantity}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
