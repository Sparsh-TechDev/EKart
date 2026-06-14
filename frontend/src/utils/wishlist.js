import axios from "axios";

export const getWishlist = async (token) => {
  return axios.get(
    "http://localhost:8000/api/v1/wishlist/my-wishlist",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const addToWishlist = async (
  productId,
  token
) => {
  return axios.post(
    "http://localhost:8000/api/v1/wishlist/add",
    { productId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const removeFromWishlist = async (
  productId,
  token
) => {
  return axios.delete(
    `http://localhost:8000/api/v1/wishlist/remove/${productId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};