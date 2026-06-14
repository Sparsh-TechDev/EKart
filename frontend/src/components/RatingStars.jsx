import React from "react";
import { Star } from "lucide-react";

const RatingStars = ({ rating = 0 }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const fillPercentage = Math.min(
          Math.max((rating - star + 1) * 100, 0),
          100
        );

        return (
          <div key={star} className="relative w-4 h-4">
            {/* Empty Star */}
            <Star
              size={16}
              className="absolute text-slate-300"
            />

            {/* Filled Portion */}
            <div
              className="absolute overflow-hidden"
              style={{
                width: `${fillPercentage}%`,
              }}
            >
              <Star
                size={16}
                className="fill-yellow-400 text-yellow-400"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RatingStars;