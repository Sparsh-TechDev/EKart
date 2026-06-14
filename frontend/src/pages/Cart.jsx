import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import userLogo from "../assets/userLogo.png";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { setCart } from "@/redux/productSlice";
import { toast } from "sonner";
import { useEffect } from "react";

const Cart = () => {
  const { cart } = useSelector((store) => store.product);

  console.log(cart);

  const subtotal = cart?.totalPrice;
  const shipping = subtotal > 499 ? 0 : 50;
  const tax = subtotal * 0.05; // 5%
  const total = subtotal + shipping + tax;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const API = `${import.meta.env.VITE_URL}/cart`;
  const accessToken = localStorage.getItem("accessToken");

  const loadCart = async () => {
    try {
      const response = await axios.get(`${API}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data.success) {
        dispatch(setCart(response.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const response = await axios.put(
        `${API}/update`,
        { productId, type },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.data.success) {
        dispatch(setCart(response.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const response = await axios.delete(`${API}/remove`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: { productId },
      });
      if (response.data.success) {
        dispatch(setCart(response.data.cart));
        toast.success("Product removed from cart");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCart();
  }, [dispatch]);

  return (
    <div className="pt-20 md:pt-24 bg-slate-50/50 min-h-screen pb-10">
      {cart?.items?.length > 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 md:mb-8">
            Shopping Cart
          </h1>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* LEFT SECTION */}
            <div className="flex flex-col gap-4 md:gap-5 flex-1">
              {cart?.items?.map((product, index) => {
                return (
                  <Card
                    key={index}
                    className="p-4 md:p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-5">
                      {/* Product Info */}
                      <div className="flex items-center gap-4 md:gap-5">
                        {/* Product Image */}
                        <div className="w-20 h-20 md:w-28 md:h-28 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0">
                          <img
                            src={
                              product?.productId?.productImg?.[0]?.url ||
                              userLogo
                            }
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="min-w-0 flex-1">
                          <h1 className="font-semibold text-sm md:text-lg text-slate-800 line-clamp-2">
                            {product?.productId?.productName}
                          </h1>

                          <p className="text-xs md:text-sm text-slate-400 mt-1">
                            {product?.productId?.category}
                          </p>

                          <p className="text-indigo-600 font-bold text-base md:text-lg mt-2">
                            ₹
                            {product?.productId?.productPrice?.toLocaleString(
                              "en-IN",
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Quantity + Price */}
                      <div className="flex sm:flex-col items-center sm:items-end gap-3 md:gap-4">
                        {/* Quantity Buttons */}
                        <div className="flex items-center gap-3">
                          <Button
                            onClick={() =>
                              handleUpdateQuantity(
                                product.productId._id,
                                "decrease",
                              )
                            }
                            variant="outline"
                            className="rounded-full w-8 h-8 md:w-10 md:h-10 text-base md:text-lg p-0"
                          >
                            -
                          </Button>

                          <span className="font-semibold text-base md:text-lg w-6 text-center">
                            {product?.quantity}
                          </span>

                          <Button
                            onClick={() =>
                              handleUpdateQuantity(
                                product.productId._id,
                                "increase",
                              )
                            }
                            variant="outline"
                            className="rounded-full w-8 h-8 md:w-10 md:h-10 text-base md:text-lg p-0"
                          >
                            +
                          </Button>
                        </div>

                        {/* Total Price */}
                        <p className="font-bold text-slate-700 text-base md:text-lg">
                          ₹
                          {(
                            product?.productId?.productPrice * product?.quantity
                          )?.toLocaleString("en-IN")}
                        </p>

                        {/* Remove */}
                        <button
                          onClick={() => handleRemove(product?.productId?._id)}
                          className="flex items-center gap-1 text-red-500 hover:text-red-600 text-xs md:text-sm font-medium transition"
                        >
                          <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* RIGHT SECTION */}
            <div className="w-full lg:w-[380px] xl:w-[400px]">
              <Card className="rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl">Order Summary</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 md:space-y-5">
                  {/* Subtotal */}
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal ({cart?.items?.length} items)</span>

                    <span className="font-medium">
                      ₹{cart?.totalPrice?.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Shipping</span>
                    <span className={`font-medium ${subtotal > 499 ? "text-emerald-500" : "text-red-500"}`}>{shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN")}`}</span>
                  </div>

                  {/* Tax */}
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Tax (5%)</span>
                    <span className="font-medium">
                      ₹
                      {tax.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between text-lg md:text-xl font-bold">
                    <span>Total</span>

                    <span className="text-indigo-600">
                      ₹
                      {total.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div className="space-y-3 pt-3">
                    <div className="flex space-x-2">
                      <Input placeholder="Promo Code" className="rounded-xl" />
                      <Button variant="outline" className="rounded-xl">Apply</Button>
                    </div>

                    {/* Checkout Button */}
                    <Button onClick={()=>navigate('/address')} className="w-full h-11 md:h-12 text-sm md:text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-md shadow-indigo-200/50 cursor-pointer">
                      Proceed to Checkout
                    </Button>

                    {/* Continue Shopping */}
                    <Link to="/products" className="block text-center text-sm text-slate-500 hover:text-indigo-600 transition">
                      Continue Shopping
                    </Link>
                  </div>
                  <div className="text-xs md:text-sm text-slate-400 pt-3 space-y-1">
                    <p>• Free shipping on orders above ₹499</p>
                    <p>• 7-days return policy</p>
                    <p>• Secure checkout with SSL encryption</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
          <div className="bg-indigo-100 p-5 md:p-6 rounded-2xl">
            <ShoppingCart className="w-12 h-12 md:w-16 md:h-16 text-indigo-600" />
          </div>

          <h1 className="mt-6 text-xl md:text-2xl font-bold text-slate-800">
            Your Cart is Empty
          </h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base">
            Looks like you haven't added anything yet.
          </p>

          <Button
            onClick={() => navigate("/products")}
            className="mt-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-5 px-6 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-md shadow-indigo-200/50 cursor-pointer"
          >
            Continue Shopping
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
