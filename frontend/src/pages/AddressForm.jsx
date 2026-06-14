import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { setCart } from "@/redux/productSlice";
import {
  addAddress,
  deleteAddress,
  setSelectedAddress, // FIX: import the actual action creator instead of trying to dispatch the state value
} from "@/redux/userSlice";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

const initialFormState = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "",
};

const AddressForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const buyNowProduct = location.state?.product;
  const buyNowQuantity = location.state?.quantity || 1;
  const isBuyNow = location.state?.buyNow;
  const accessToken = localStorage.getItem("accessToken");

  // FIX: use safe defaults so the component does not crash if store.user/store.product is not ready yet
  const { addresses = [], selectedAddress = null } = useSelector(
    (store) => store.user || {},
  );
  const cart = useSelector(
    (store) => store.product?.cart || { items: [], totalPrice: 0 },
  );

  const [formData, setFormData] = useState(initialFormState);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // FIX: make the UI react to saved addresses even if they arrive after initial render
  const [showForm, setShowForm] = useState(addresses.length === 0);

  useEffect(() => {
    // FIX: when there are saved addresses, show the list instead of keeping the form open forever
    if (addresses.length > 0) {
      setShowForm(false);
    } else {
      setShowForm(true);
    }
  }, [addresses.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // FIX: basic validation; the old code saved empty/partial records if the button was clicked
    const hasEmptyField = Object.values(formData).some(
      (value) => !value.trim(),
    );
    if (hasEmptyField) {
      toast.error("Please fill all address fields");
      return;
    }

    dispatch(addAddress(formData));

    // FIX: auto-select the newly added address so the highlight is visible immediately
    dispatch(setSelectedAddress(addresses.length));

    // FIX: reset the form after save so old values do not stay in the inputs
    setFormData(initialFormState);

    setShowForm(false);
    toast.success("Address saved");
  };

  const handleSelectAddress = (index) => {
    // FIX: use the real action creator; this is what was broken in the original code
    dispatch(setSelectedAddress(index));
  };

  const handleDeleteAddress = (e, index) => {
    e.stopPropagation(); // FIX: prevent the delete click from also selecting the card
    dispatch(deleteAddress(index));
  };

  const subtotal = isBuyNow
    ? buyNowProduct.productPrice * buyNowQuantity
    : (cart?.totalPrice ?? 0);

  const itemCount = isBuyNow ? buyNowQuantity : (cart?.items?.length ?? 0);

  const shipping = subtotal > 499 ? 0 : 50;

  const tax = Number((subtotal * 0.05).toFixed(2));

  const total = subtotal + shipping + tax;

  const handlePayment = async () => {
    try {
      setPaymentLoading(true);

      const { data } = await axios.post(
        `${import.meta.env.VITE_URL}/orders/create-order`,
        {
          products: isBuyNow
            ? [
                {
                  productId: buyNowProduct._id,
                  quantity: buyNowQuantity,
                },
              ]
            : cart?.items?.map((item) => ({
                productId: item.productId._id,
                quantity: item.quantity,
              })),
          tax,
          shipping,
          amount: total,
          currency: "INR",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!data.success) {
        setPaymentLoading(false);
        return toast.error("Something went wrong");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        name: "Ekart",
        description: "Order Payment",

        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_URL}/orders/verify-payment`,
              response,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );

            setPaymentLoading(false);

            if (verifyRes.data.success) {
              toast.success("✅ Payment Successful!");
              if (!isBuyNow) {
                dispatch(setCart({ items: [], totalPrice: 0 }));
              }
              navigate("/order-success");
            } else {
              toast.error("❌ Payment verification failed!");
            }
          } catch (error) {
            setPaymentLoading(false);

            console.log("❌ Error verifying payment:", error);

            toast.error("❌ Error verifying payment");
          }
        },

        modal: {
          ondismiss: async function () {
            setPaymentLoading(false);

            try {
              await axios.post(
                `${import.meta.env.VITE_URL}/orders/verify-payment`,
                {
                  razorpay_order_id: data.order.id,
                  paymentFailed: true,
                },
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                },
              );
            } catch (error) {
              console.log(error);
            }

            toast.error("Payment cancelled or failed");
          },
        },

        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },

        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", async function (response) {
        setPaymentLoading(false);

        try {
          await axios.post(
            `${import.meta.env.VITE_URL}/orders/verify-payment`,
            {
              razorpay_order_id: data.order.id,
              paymentFailed: true,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
        } catch (error) {
          console.log(error);
        }

        toast.error("Payment failed. Please try again!");
      });

      rzp.open();
    } catch (error) {
      setPaymentLoading(false);

      console.log(error);

      toast.error("Something went wrong while processing payment");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 py-10 pt-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.25fr_0.85fr]">
        {/* Left side */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Delivery details
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Add a new address or choose a saved one.
              </p>
            </div>

            {!showForm && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(true)}
                className="rounded-full"
              >
                + Add new address
              </Button>
            )}
          </div>

          {showForm ? (
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="abc@xyz.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Street, Area"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Mumbai"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  {/* FIX: label was incorrectly saying "City" for the state field */}
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="Maharashtra"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="zip">Zip Code</Label>
                  <Input
                    id="zip"
                    name="zip"
                    placeholder="700001"
                    value={formData.zip}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    placeholder="India"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={handleSave}
                  className="rounded-full"
                >
                  Save Address
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData(initialFormState);
                    setShowForm(false);
                  }}
                  className="rounded-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                  No saved addresses yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr, index) => {
                    const isSelected = selectedAddress === index;

                    return (
                      <div
                        key={index}
                        onClick={() => handleSelectAddress(index)}
                        className={`group relative cursor-pointer rounded-2xl border p-5 transition-all duration-200 ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200 shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="mb-3 flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-base font-semibold text-slate-900">
                                {addr.fullName}
                              </p>

                              {isSelected && (
                                <span className="rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white">
                                  Selected
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-500">
                              {addr.phone}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleDeleteAddress(e, index)}
                            className="rounded-full px-3 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>

                        <p className="text-sm leading-6 text-slate-700">
                          {addr.email}
                          <br />
                          {addr.address}, {addr.city}, {addr.state}, {addr.zip},{" "}
                          {addr.country}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="button"
                  disabled={selectedAddress === null || paymentLoading}
                  className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-200/50"
                  onClick={handlePayment}
                >
                  {paymentLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right side */}
        <Card className="h-fit rounded-3xl border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {isBuyNow && (
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                <div className="flex gap-3">
                  <img
                    src={buyNowProduct?.productImg?.[0]?.url}
                    alt={buyNowProduct?.productName}
                    className="w-16 h-16 rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <h4 className="font-semibold text-sm line-clamp-2">
                      {buyNowProduct?.productName}
                    </h4>

                    <p className="text-xs text-slate-500 mt-1">
                      Quantity: {buyNowQuantity}
                    </p>

                    <p className="font-bold text-indigo-600 mt-1">
                      ₹
                      {(
                        buyNowProduct?.productPrice * buyNowQuantity
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-slate-600">
                Subtotal ({itemCount}) items
              </span>
              <span className="font-medium">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Shipping</span>
              <span
                className={`font-medium ${subtotal > 499 ? "text-green-400" : "text-red-500"}`}
              >
                {shipping === 0
                  ? "FREE"
                  : `₹${shipping.toLocaleString("en-IN")}`}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Tax</span>
              <span className="font-medium">
                ₹{tax.toLocaleString("en-IN")}
              </span>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <p>• Free shipping on orders above ₹499</p>
              <p>• 7-days return policy</p>
              <p>• 🔒 Secure checkout with SSL encryption</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddressForm;
