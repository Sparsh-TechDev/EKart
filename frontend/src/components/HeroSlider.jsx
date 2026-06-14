import React from "react";

const productsRow1 = [
  "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&q=80",
  "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=1200&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80",
  "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&q=80",
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80",
];

const productsRow2 = [
  "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&q=80",
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80",
  "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=1200&q=80",
  "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&q=80",
  "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=1200&q=80",
];

const HeroSlider = () => {
  return (
    <div className="relative w-full max-w-full sm:max-w-xl ml-auto rounded-2xl overflow-hidden">

      {/* Top Row */}
      <div className="flex gap-3 sm:gap-4 md:gap-6 animate-marquee">
        {[...productsRow1, ...productsRow1].map((img, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg sm:rounded-2xl md:rounded-3xl p-2 sm:p-3 md:p-4 min-w-[75px] sm:min-w-[120px] lg:min-w-[140px] min-h-[75px] sm:min-h-[120px] lg:min-h-[140px] shadow-xl flex-shrink-0"
          >
            <img
              src={img}
              alt=""
              loading="lazy"
              className="h-12 sm:h-24 lg:h-28 object-contain mx-auto rounded-md sm:rounded-xl md:rounded-2xl"
            />
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="flex gap-3 sm:gap-4 md:gap-6 animate-marquee-reverse mt-3 sm:mt-4 md:mt-6">
        {[...productsRow2, ...productsRow2].map((img, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg sm:rounded-2xl md:rounded-3xl p-2 sm:p-3 md:p-4 min-w-[75px] sm:min-w-[120px] lg:min-w-[140px] min-h-[75px] sm:min-h-[120px] lg:min-h-[140px] shadow-xl flex-shrink-0"
          >
            <img
              src={img}
              alt=""
              loading="lazy"
              className="h-12 sm:h-24 lg:h-28 object-contain mx-auto rounded-md sm:rounded-xl md:rounded-2xl"
            />
          </div>
        ))}
      </div>

    </div>
  );
};

export default HeroSlider;