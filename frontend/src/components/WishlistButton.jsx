import React from "react";
import axios from "axios";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setWishlist } from "@/redux/productSlice";

const WishlistButton = ({ product }) => {
  const dispatch = useDispatch();

  const { wishlist } = useSelector(
    (store) => store.product
  );

  const accessToken =
    localStorage.getItem("accessToken");

  const isWishlisted = wishlist.some(
    (item) => item._id === product._id
  );

  const handleWishlist = async (e) => {
    e?.stopPropagation();

    try {
      if (!accessToken) {
        toast.error("Please login first");
        return;
      }

      let res;

      if (isWishlisted) {
        res = await axios.delete(
          `${import.meta.env.VITE_URL}/wishlist/remove/${product._id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } else {
        res = await axios.post(
          `${import.meta.env.VITE_URL}/wishlist/add`,
          {
            productId: product._id,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }

      dispatch(
        setWishlist(
          res.data.wishlist.products
        )
      );

      toast.success(
        isWishlisted
          ? "Removed from Wishlist"
          : "Added to Wishlist"
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      onClick={handleWishlist}
      className="
        bg-white
        p-2.5
        rounded-full
        shadow-md
        hover:scale-110
        transition-all
        duration-200
      "
    >
      <Heart
        size={18}
        className={
          isWishlisted
            ? "fill-pink-500 text-pink-500"
            : "text-slate-400"
        }
      />
    </button>
  );
};

export default WishlistButton;