import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Heart, ShoppingCart, Trash2 } from "lucide-react";

import { toast } from "sonner";

import { setWishlist, setCart } from "@/redux/productSlice";

const Wishlist = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const accessToken = localStorage.getItem("accessToken");

  const { wishlist } = useSelector((store) => store.product);

  const removeFromWishlist = async (productId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_URL}/wishlist/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        dispatch(setWishlist(res.data.wishlist.products));

        toast.success("Removed from wishlist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const moveToCart = async (productId) => {
    try {
      const cartRes = await axios.post(
        `${import.meta.env.VITE_URL}/cart/add`,
        {
          productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (cartRes.data.success) {
        dispatch(setCart(cartRes.data.cart));

        const wishlistRes = await axios.delete(
          `${import.meta.env.VITE_URL}/wishlist/remove/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        dispatch(setWishlist(wishlistRes.data.wishlist.products));

        toast.success("Moved to cart");
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  };

  if (!wishlist.length) {
    return (
      <div className="pt-28 min-h-screen flex flex-col items-center justify-center px-4">
        <Heart size={70} className="text-pink-500 mb-5" />

        <h2 className="text-3xl font-bold text-slate-800">
          Your Wishlist is Empty
        </h2>

        <p className="text-slate-500 mt-3 text-center max-w-md">
          Save products you love and come back to them later.
        </p>

        <button
          onClick={() => navigate("/products")}
          className="
            mt-6
            px-6
            py-3
            rounded-xl
            text-white
            font-medium
            bg-gradient-to-r
            from-indigo-600
            to-violet-600
          "
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="text-pink-500 fill-pink-500" />

        <h1 className="text-3xl font-bold text-slate-900">My Wishlist</h1>

        <span
          className="
            bg-pink-100
            text-pink-600
            px-3
            py-1
            rounded-full
            text-sm
            font-medium
          "
        >
          {wishlist.length}
        </span>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((product) => (
          <div
            key={product._id}
            className="
              bg-white
              rounded-3xl
              border
              border-slate-100
              overflow-hidden
              shadow-sm
              hover:shadow-xl
              transition-all
            "
          >
            {/* <div
              onClick={() => navigate(`/products/${product._id}`)}
              className="cursor-pointer"
            >
              <img
                src={product.productImg?.[0]?.url}
                alt={product.productName}
                className="
                  w-full
                  h-64
                  object-cover
                "
              />
            </div> */}

            {/* <div
              onClick={() => navigate(`/products/${product._id}`)}
              className="h-44 bg-white flex items-center justify-center p-4 border-b"
            >
              <img
                src={product.productImg?.[0]?.url}
                alt={product.productName}
                className="h-full object-contain"
              />
            </div> */}

            <div onClick={() => navigate(`/products/${product._id}`)} className="h-48 bg-slate-50 flex items-center justify-center overflow-hidden rounded-t-2xl">
  <img
    src={product.productImg?.[0]?.url}
    alt={product.productName}
    className="max-h-40 max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
  />
</div>

            <div className="p-5">
              <h3
                className="
                  font-semibold
                  text-slate-800
                  line-clamp-2
                  min-h-[52px]
                "
              >
                {product.productName}
              </h3>

              <p
                className="
                  text-2xl
                  font-bold
                  text-indigo-600
                  mt-3
                "
              >
                ₹{product.productPrice.toLocaleString("en-IN")}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <button
                  onClick={() => moveToCart(product._id)}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    py-3
                    rounded-xl
                    text-white
                    font-medium
                    bg-gradient-to-r
                    from-indigo-600
                    to-violet-600
                  "
                >
                  <ShoppingCart size={18} />
                  Cart
                </button>

                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    py-3
                    rounded-xl
                    border
                    border-red-200
                    text-red-500
                    hover:bg-red-50
                  "
                >
                  <Trash2 size={18} />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
