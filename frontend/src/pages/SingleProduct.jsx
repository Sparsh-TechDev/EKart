import Breadcrums from "@/components/Breadcrums";
import ProductDesc from "@/components/ProductDesc";
import ProductImg from "@/components/ProductImg";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";
import ReviewSection from "@/components/ReviewSection";

const SingleProduct = () => {
  const { id: productId } = useParams();

  const navigate = useNavigate();

  const { products } = useSelector((store) => store.product);

  const product = products.find((item) => item._id === productId);

  const [recommendations, setRecommendations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/review/${productId}`
      );

      if (res.data.success) {
        setReviews(res.data.reviews);
        setAverageRating(Number(res.data.averageRating) || 0);
        setTotalReviews(Number(res.data.totalReviews) || 0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/product/recommendations/${productId}`,
      );

      if (response.data.success) {
        setRecommendations(response.data.recommendations);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRecommendations();
    fetchReviews();
  }, [productId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  if (!product) {
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading Product...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-24 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrums product={product} />

      {/* Product Section */}
      <div className="mt-6 md:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-start">
        <ProductImg
  images={product.productImg}
  product={product}
/>
        <ProductDesc product={product} averageRating={averageRating} totalReviews={totalReviews} />
      </div>

      <ReviewSection
        productId={productId}
        reviews={reviews}
        averageRating={averageRating}
        totalReviews={totalReviews}
        onReviewAdded={fetchReviews}
      />

{/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="mt-16 md:mt-24">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-800">
              Smart Recommendations
            </h2>

            <span className="text-[10px] md:text-xs bg-violet-100 text-violet-700 px-2.5 md:px-3 py-1 rounded-full font-medium">
              AI Powered
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {recommendations.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/products/${item._id}`)}
                className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="overflow-hidden aspect-square bg-slate-50">
                  <img
                    src={item.productImg?.[0]?.url}
                    alt={item.productName}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-3 md:p-4">
                  <h3 className="font-semibold text-sm md:text-base text-slate-800 line-clamp-2 leading-snug">
                    {item.productName}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1">{item.brand}</p>

                  <p className="text-indigo-600 text-base md:text-lg font-bold mt-2">
                    ₹{Number(item.productPrice).toLocaleString("en-IN")}
                  </p>

                  <button className="mt-3 w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-2 rounded-xl text-xs md:text-sm font-medium hover:from-indigo-700 hover:to-violet-700 transition-all shadow-sm">
                    View Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProduct;