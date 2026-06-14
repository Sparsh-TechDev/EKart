import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Star,
  Sparkles,
  MessageSquare,
  Check,
  ThumbsUp,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

const ReviewSection = ({
  productId,
  reviews = [],
  averageRating = 0,
  totalReviews = 0,
  onReviewAdded,
}) => {
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [sortBy, setSortBy] = useState("recent");
  const [barsAnimated, setBarsAnimated] = useState(false);

  const accessToken = localStorage.getItem("accessToken");

  // Reset local states when product ID changes
  useEffect(() => {
    setSummary("");
    setComment("");
    setRating(5);
    setHoverRating(null);
    setSortBy("recent");
  }, [productId]);

  // Trigger progress bar slide-in animation when reviews change
  useEffect(() => {
    setBarsAnimated(false);
    const t = setTimeout(() => setBarsAnimated(true), 150);
    return () => clearTimeout(t);
  }, [reviews]);

  const submitReview = async () => {
    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    try {
      setReviewLoading(true);

      const res = await axios.post(
        "http://localhost:8000/api/v1/review/add",
        {
          productId,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Review added successfully");

        setComment("");
        setRating(5);
        setHoveredStar(0);

        fetchReviews();
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message;

      if (
        errorMessage?.toLowerCase().includes("token") ||
        error?.response?.status === 401
      ) {
        toast.error("Please login first");

        setTimeout(() => {
          navigate("/login");
        }, 1500);

        return;
      }

      toast.error(errorMessage || "Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  const generateSummary = async () => {
    try {
      setSummaryLoading(true);
      const res = await axios.get(
        `http://localhost:8000/api/v1/review/summary/${productId}`,
      );

      if (res.data.success) {
        setSummary(res.data.summary);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate AI summary");
    } finally {
      setSummaryLoading(false);
    }
  };



  // Helper: Generates user initials
  const getInitials = (user) => {
    const first = user?.firstName?.[0] || "";
    const last = user?.lastName?.[0] || "";
    return (first + last).toUpperCase() || "?";
  };

  // Helper: Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Rating Distribution Calculation
  const total = reviews.length;
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return { stars, count, pct };
  });

  // Client-side Sort Logic
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === "highest") {
      return b.rating - a.rating;
    }
    if (sortBy === "lowest") {
      return a.rating - b.rating;
    }
    return 0;
  });

  return (
    <div
      id="reviews-section"
      className="mt-20 scroll-mt-24 flex flex-col gap-10 md:gap-14"
    >
      {/* 1. AI Review Insights Card */}
      {summary ? (
        <div className="animate-fade-in bg-gradient-to-br from-indigo-50/40 via-purple-50/30 to-pink-50/40 dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-pink-950/20 backdrop-blur-md border border-white/20 rounded-[32px] p-6 md:p-8 shadow-xl shadow-indigo-100/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/20 rounded-full blur-3xl -z-10 group-hover:bg-indigo-200/30 transition-all duration-500"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-200/20 rounded-full blur-3xl -z-10 group-hover:bg-pink-200/30 transition-all duration-500"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 text-white p-2.5 rounded-2xl shadow-md animate-pulse">
                <Sparkles size={20} />
              </div>
              <div>
                <span className="text-[10px] md:text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  AI Customer Insights
                </span>
                <h3 className="font-bold text-xl md:text-2xl text-slate-800 mt-1">
                  What Buyers Are Saying
                </h3>
              </div>
            </div>

            {reviews.length > 0 && (
              <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2 rounded-2xl self-start md:self-auto shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-bold">
                  {Math.round(
                    (reviews.filter((r) => r.rating >= 4).length /
                      reviews.length) *
                      100,
                  )}
                  % Positive Sentiment
                </span>
              </div>
            )}
          </div>

          <div className="prose prose-slate max-w-none text-slate-600 text-sm md:text-base leading-relaxed">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-indigo-50/20 via-purple-50/10 to-pink-50/20 border border-slate-100 rounded-[32px] p-6 md:p-8 text-center shadow-sm relative overflow-hidden">
          <div className="flex flex-col items-center gap-4 py-4 max-w-md mx-auto">
            <div className="bg-violet-50 text-violet-600 p-4 rounded-full shadow-inner">
              <Sparkles size={28} className="animate-float" />
            </div>
            <h3 className="font-bold text-lg text-slate-800">
              Summarize Customer Feedback with AI
            </h3>
            <p className="text-sm text-slate-500 leading-normal">
              Generate a smart summary of what customers love and common
              complaints based on real reviews.
            </p>
            <button
              disabled={summaryLoading || reviews.length === 0}
              onClick={generateSummary}
              className="mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:shadow-xl hover:from-indigo-700 hover:to-violet-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              {summaryLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Analyzing reviews...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate AI Summary
                </>
              )}
            </button>
            {reviews.length === 0 && (
              <span className="text-xs text-slate-400 mt-1">
                Needs at least 1 review to generate analysis.
              </span>
            )}
          </div>
        </div>
      )}

      {/* 2. Customer Rating Overview & Write Review Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Rating Stats Card */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm flex flex-col justify-between min-h-[380px]">
          <div>
            <h3 className="font-bold text-lg md:text-xl text-slate-800 mb-6">
              Customer Rating Overview
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
              <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl p-6 min-w-[140px] text-center">
                <span className="text-5xl font-black text-slate-800 tracking-tight">
                  {averageRating > 0 ? Number(averageRating).toFixed(1) : "0.0"}
                </span>
                <div className="flex gap-0.5 my-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setRating(star)}
                      className="transition-all duration-200 hover:scale-125"
                    >
                      <Star
                        size={36}
                        className={
                          star <= (hoveredStar || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Based on {totalReviews}{" "}
                  {totalReviews === 1 ? "review" : "reviews"}
                </span>
              </div>

              {/* Progress Distribution */}
              <div className="flex-1 space-y-2.5">
                {distribution.map(({ stars, count, pct }) => (
                  <div
                    key={stars}
                    className="flex items-center gap-3 text-xs font-semibold text-slate-600"
                  >
                    <span className="w-10 whitespace-nowrap">{stars} Star</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-400 to-yellow-400 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: barsAnimated ? `${pct}%` : "0%" }}
                      ></div>
                    </div>
                    <span className="w-8 text-right font-bold text-slate-700">
                      {pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-50 pt-5 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>100% genuine buyer reviews</span>
            <button
              onClick={() =>
                document
                  .getElementById("write-review-card")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              Write yours →
            </button>
          </div>
        </div>

        {/* Write Review Form Card */}
        <div
          id="write-review-card"
          className="lg:col-span-7 bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <h3 className="text-lg md:text-xl font-bold mb-1 text-slate-800">
            Share Your Experience
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Help others make informed decisions by sharing your honest product
            review.
          </p>

          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Your Rating
            </p>

            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="transition-transform duration-150 hover:scale-125 cursor-pointer focus:outline-none"
                  >
                    <Star
                      size={28}
                      className={`transition-all duration-150 ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]"
                          : "text-slate-200"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <span className="text-sm font-semibold text-indigo-600 bg-indigo-50/50 px-2.5 py-1 rounded-lg">
                {rating === 1 && "😞 Poor"}
                {rating === 2 && "😕 Fair"}
                {rating === 3 && "🙂 Good"}
                {rating === 4 && "😊 Very Good"}
                {rating === 5 && "🤩 Excellent"}
              </span>
            </div>
          </div>

          <div className="mb-5 relative">
            <label
              htmlFor="review-text"
              className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block"
            >
              Review Details
            </label>
            <textarea
              id="review-text"
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              rows={4}
              placeholder="What did you like or dislike? How does it perform?"
              className="w-full border border-slate-200 rounded-2xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all leading-relaxed placeholder:text-slate-400"
            />
            <div className="absolute bottom-3 right-4 text-xs font-semibold text-slate-400 bg-white/80 px-1.5 py-0.5 rounded">
              {comment.length} / 500
            </div>
          </div>

          <button
            onClick={submitReview}
            disabled={reviewLoading || !comment.trim()}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:shadow-xl hover:from-indigo-700 hover:to-violet-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Submitting review...
              </>
            ) : (
              "Submit Review"
            )}
          </button>
          
        </div>
      </div>

      {/* 3. Sorting and Reviews List */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="font-bold text-lg md:text-xl text-slate-800">
              Customer Reviews
            </h3>
            <p className="text-xs text-slate-400">
              Showing {sortedReviews.length} customer{" "}
              {sortedReviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* Sorting Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "recent", label: "Most Recent" },
              { id: "highest", label: "Highest Rating" },
              { id: "lowest", label: "Lowest Rating" },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  sortBy === option.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[32px] p-10 md:p-14 text-center">
            <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
              <div className="bg-white p-4 rounded-full shadow-sm border border-slate-100 text-slate-400 mb-4 animate-float">
                <MessageSquare size={32} />
              </div>

              <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2">
                No Reviews Yet
              </h3>

              <p className="text-sm text-slate-500 leading-normal mb-6">
                Be the first customer to share your experience with this product
                and help other shoppers.
              </p>

              <button
                onClick={() =>
                  document
                    .getElementById("write-review-card")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all cursor-pointer"
              >
                Write First Review
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {sortedReviews.map((review) => (
              <div
                key={review._id}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      {review.user?.profilePhoto ? (
                        <img
                          src={review.user.profilePhoto}
                          alt={`${review.user?.firstName || "User"}`}
                          className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                          {getInitials(review.user)}
                        </div>
                      )}

                      <div>
                        <h4 className="font-bold text-slate-800 text-sm md:text-base">
                          {review.user?.firstName} {review.user?.lastName}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-emerald-100">
                            <Check size={10} className="stroke-[3]" />
                            Verified Purchase
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-200"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm md:text-base leading-relaxed pl-1 whitespace-pre-line">
                    {review.comment}
                  </p>
                </div>

                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
