import { ShoppingCart, Heart, Zap } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCart, setWishlist } from "@/redux/productSlice";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, loading }) => {
  const { productImg, productPrice, productName, brand } = product;

  const accessToken = localStorage.getItem("accessToken");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { wishlist } = useSelector((store) => store.product);

  const [cartLoading, setCartLoading] = useState(false);

  const [buyNowLoading, setBuyNowLoading] = useState(false);

  const isWishlisted = wishlist?.some((item) => item._id === product._id);

  const addToCart = async (productId) => {
    try {
      setCartLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_URL}/cart/add`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Product added to Cart");

        dispatch(setCart(response.data.cart));
      }
    } catch (error) {
      console.log(error);

      toast.error("Please login to add items in cart");
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
      },
    });

    setTimeout(() => {
      setBuyNowLoading(false);
    }, 500);
  };
  const toggleWishlist = async () => {
    try {
      if (!accessToken) {
        toast.error("Please login first");
        return;
      }

      let response;

      if (isWishlisted) {
        response = await axios.delete(
          `${import.meta.env.VITE_URL}/wishlist/remove/${product._id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_URL}/wishlist/add`,
          {
            productId: product._id,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
      }

      if (response.data.success) {
        dispatch(setWishlist(response.data.wishlist?.products || []));

        toast.success(
          isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
        );
      }
    } catch (error) {
      console.log(error.response?.data);
      console.log(error);

      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
        <div className="aspect-square bg-slate-100" />

        <div className="p-3 md:p-4 space-y-3">
          <div className="h-3 bg-slate-100 rounded-full w-1/3" />

          <div className="h-4 bg-slate-100 rounded-full w-full" />

          <div className="h-4 bg-slate-100 rounded-full w-2/3" />

          <div className="h-5 bg-slate-100 rounded-full w-1/2 mt-1" />

          <div className="h-10 bg-slate-100 rounded-xl w-full mt-2" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        group
        bg-white
        rounded-2xl
        overflow-hidden
        shadow-sm
        hover:shadow-xl
        border
        border-slate-100
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >
      {/* Product Image */}

      <div
        className="
          aspect-square
          bg-slate-50
          overflow-hidden
          cursor-pointer
          relative
        "
        onClick={() => navigate(`/products/${product._id}`)}
      >
        {/* Wishlist Button */}

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist();
          }}
          className="
            absolute
            top-3
            right-3
            z-10
            w-10
            h-10
            rounded-full
            bg-white/95
            backdrop-blur-sm
            shadow-md
            flex
            items-center
            justify-center
            hover:scale-110
            transition-all
            duration-300
            cursor-pointer
          "
        >
          <Heart
            className={`
              w-5
              h-5
              transition-all
              duration-300
              ${
                isWishlisted
                  ? "fill-pink-500 text-pink-500 scale-110"
                  : "text-slate-500 hover:text-pink-500"
              }
            `}
          />
        </button>

        <img
          src={productImg?.[0]?.url}
          alt={productName}
          loading="lazy"
          className="
            w-full
            h-full
            object-cover
            group-hover:scale-105
            transition-transform
            duration-500
          "
        />
      </div>

      {/* Content */}

      <div className="p-3 md:p-4 space-y-2">
        {brand && (
          <p
            className="
              text-[11px]
              md:text-xs
              font-medium
              text-slate-400
              uppercase
              tracking-wider
            "
          >
            {brand}
          </p>
        )}

        <h3
          onClick={() => navigate(`/products/${product._id}`)}
          className="
            text-sm
            md:text-base
            font-semibold
            text-slate-800
            line-clamp-2
            cursor-pointer
            hover:text-indigo-600
            transition-colors
            leading-snug
            min-h-[2.8rem]
          "
        >
          {productName}
        </h3>

        <p className="text-base md:text-lg font-bold text-slate-900">
          ₹{Number(productPrice).toLocaleString("en-IN")}
        </p>

        {/* <Button
          onClick={() => addToCart(product._id)}
          disabled={cartLoading}
          className="
            w-full
            rounded-xl
            bg-gradient-to-r
            from-indigo-600
            to-violet-600
            hover:from-indigo-700
            hover:to-violet-700
            text-white
            text-xs
            md:text-sm
            font-medium
            shadow-sm
            shadow-indigo-200/50
            hover:shadow-md
            hover:shadow-indigo-200/50
            transition-all
            duration-300
            cursor-pointer
            h-9
            md:h-10
          "
        >
          {cartLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Adding...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Add To Cart
            </span>
          )}
        </Button> */}

        <div className="grid grid-cols-[70%_30%] gap-2 mt-3">
          <Button
            onClick={handleBuyNow}
            className="
      h-10
      rounded-xl
      bg-gradient-to-r
      from-indigo-600
      to-violet-600
      hover:from-indigo-700
      hover:to-violet-700
      text-white
      font-medium
      cursor-pointer
    "
          >
            <Zap className="w-4 h-4 mr-2" />
            Buy Now
          </Button>

          <Button
            onClick={() => addToCart(product._id)}
            disabled={cartLoading}
            variant="outline"
            className="
      h-10
      rounded-xl
      border-indigo-200
      text-indigo-600
      hover:bg-indigo-50
      cursor-pointer
    "
          >
            {cartLoading ? (
              <span className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
