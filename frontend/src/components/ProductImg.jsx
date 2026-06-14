import React, { useEffect, useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import WishlistButton from "./WishlistButton";

const ProductImg = ({ images, product }) => {
  const [mainImg, setMainImg] = useState(images?.[0]?.url);

  useEffect(() => {
    if (images?.length > 0) {
      setMainImg(images[0].url);
    }
  }, [images]);

  return (
    <div className="w-full flex flex-col-reverse md:flex-row gap-3 md:gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
        {images.map((img, index) => (
          <button
            key={img.public_id || index}
            onClick={() => setMainImg(img.url)}
            className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer hover:opacity-100 ${
              mainImg === img.url
                ? "border-indigo-500 shadow-md opacity-100"
                : "border-slate-200 opacity-70"
            }`}
          >
            <img
              src={img.url}
              alt=""
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1">
        <div className="relative bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
          <div className="absolute top-4 right-4 z-20">
  <WishlistButton product={product} />
</div>
          <Zoom>
            <img
              src={mainImg}
              alt=""
              className="w-full max-w-lg mx-auto object-contain aspect-square p-4"
            />
          </Zoom>
        </div>
      </div>
    </div>
  );
};

export default ProductImg;