import React, { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { setCart } from "@/redux/productSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Loader2, ShoppingCart, Zap } from "lucide-react";

import RatingStars from "./RatingStars";

const ProductDesc = ({ product, averageRating = 0, totalReviews = 0 }) => {
  const accessToken = localStorage.getItem("accessToken");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(false);

  const [quantity, setQuantity] = useState(1);

  const [cartLoading, setCartLoading] = useState(false);

  const [buyNowLoading, setBuyNowLoading] = useState(false);

  const addToCart = async (productId, quantity) => {
    try {
      setCartLoading(true);

      const response = await axios.post(
        "http://localhost:8000/api/v1/cart/add",
        {
          productId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Product added to cart");

        dispatch(setCart(response.data.cart));
      }
    } catch (error) {
      console.log(error);

      toast.error("Please login to add items to cart");
    } finally {
      setCartLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!accessToken) {
      toast.error("Please login first");

      navigate("/login");

      return;
    }

    setBuyNowLoading(true);

    navigate("/address", {
      state: {
        buyNow: true,
        product,
        quantity,
      },
    });

    setTimeout(() => {
      setBuyNowLoading(false);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-5 pb-24 lg:pb-0">
      {/* Product Title */}

      <h1 className="font-bold text-2xl md:text-3xl text-slate-900 leading-tight">
        {product.productName}
      </h1>

      {/* Rating */}

      <div className="flex items-center gap-3 flex-wrap">
        <RatingStars rating={averageRating} />

        <span className="font-bold text-slate-800">
          {averageRating > 0 ? Number(averageRating).toFixed(1) : "0.0"}
        </span>

        <span className="text-slate-300">•</span>

        <button
          onClick={() => {
            document.getElementById("reviews-section")?.scrollIntoView({
              behavior: "smooth",
            });
          }}
          className="
            text-slate-500
            hover:text-indigo-600
            hover:underline
            underline-offset-4
            transition
          "
        >
          {totalReviews} {totalReviews === 1 ? "Review" : "Reviews"}
        </button>
      </div>

      {/* Category & Brand */}

      <div className="flex gap-2 flex-wrap">
        <span
          className="
            bg-slate-100
            text-slate-700
            px-3
            py-1
            rounded-full
            text-xs
            font-medium
          "
        >
          {product.category}
        </span>

        <span
          className="
            bg-indigo-50
            text-indigo-600
            px-3
            py-1
            rounded-full
            text-xs
            font-medium
          "
        >
          {product.brand}
        </span>
      </div>

      {/* Price */}

      <h2 className="text-3xl font-bold text-indigo-600">
        ₹{product.productPrice.toLocaleString("en-IN")}
      </h2>

      {/* Description */}

      <div
        className="
          bg-slate-50
          border
          border-slate-100
          rounded-2xl
          p-5
          shadow-sm
        "
      >
        <h3 className="font-semibold text-lg mb-3">Product Description</h3>

        <p
          className={`
            text-slate-600
            leading-7
            whitespace-pre-line
            ${expanded ? "" : "line-clamp-6"}
          `}
        >
          {product.productDesc}
        </p>

        {product.productDesc?.length > 300 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="
              mt-3
              text-indigo-600
              font-semibold
              hover:text-indigo-700
            "
          >
            {expanded ? "Read Less ↑" : "Read Full Description →"}
          </button>
        )}
      </div>

      {/* Quantity + Total */}

      <div
        className="
          bg-white
          border
          border-slate-200
          rounded-2xl
          p-4
          shadow-sm
        "
      >
        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-4
          "
        >
          <div className="flex items-center gap-4">
            <p className="font-semibold text-slate-700">Quantity</p>

            <div
              className="
                flex
                items-center
                border
                border-slate-200
                rounded-xl
                overflow-hidden
              "
            >
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="
                  w-10
                  h-10
                  hover:bg-slate-100
                  transition
                "
              >
                -
              </button>

              <span className="w-12 text-center font-semibold">{quantity}</span>

              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="
                  w-10
                  h-10
                  hover:bg-slate-100
                  transition
                "
              >
                +
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-500">Total Price</p>

            <p className="text-xl font-bold text-indigo-600">
              ₹{(product.productPrice * quantity).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}

      {/* Desktop Buttons */}

      <div className="hidden lg:grid grid-cols-2 gap-4">
        <Button
          disabled={buyNowLoading}
          onClick={handleBuyNow}
          className="
            h-14
            bg-gradient-to-r
            from-indigo-600
            to-violet-600
            hover:from-indigo-700
            hover:to-violet-700
            rounded-xl
            shadow-md
            cursor-pointer
          "
        >
          {buyNowLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Redirecting...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Buy Now
            </>
          )}
        </Button>

        <Button
          disabled={cartLoading}
          onClick={() => addToCart(product._id, quantity)}
          className="
            h-14
            bg-gradient-to-r
            from-indigo-600
            to-violet-600
            hover:from-indigo-700
            hover:to-violet-700
            rounded-xl
            shadow-md
            cursor-pointer
          "
        >
          {cartLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add To Cart
            </>
          )}
        </Button>
      </div>

      {/* Mobile Fixed Bottom Bar */}

<div
  className="
    lg:hidden
    fixed
    bottom-0
    left-0
    right-0
    z-50
    bg-white
    border-t
    border-slate-200
    shadow-2xl
    p-3
  "
>
  <div className="flex gap-3">
    <Button
      onClick={handleBuyNow}
      className="
        flex-1
        bg-gradient-to-r
        from-indigo-600
        to-violet-600
      "
    >
      <Zap className="w-4 h-4 mr-2" />
      Buy Now
    </Button>

    <Button
      onClick={() => addToCart(product._id, quantity)}
      className="
        flex-1
        bg-gradient-to-r
        from-indigo-600
        to-violet-600
      "
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      Cart
    </Button>
  </div>
</div>

    </div>
  );
};

export default ProductDesc;
