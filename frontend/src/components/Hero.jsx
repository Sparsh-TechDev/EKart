import React from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import HeroSlider from "./HeroSlider";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white py-8 sm:py-16 md:py-20 lg:py-28">
      {/* Decorative orbs */}
      <div className="absolute top-0 left-0 w-36 h-36 sm:w-48 md:w-72 sm:h-48 md:h-72 bg-indigo-400 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 right-0 w-36 h-36 sm:w-48 md:w-72 sm:h-48 md:h-72 bg-violet-400 rounded-full blur-3xl opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-purple-500 rounded-full blur-3xl opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 items-center">
          {/* Text */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-medium mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              AI-Powered Shopping Experience
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight sm:leading-[1.1] tracking-tight">
              Smart Shopping
              <span className="block bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl mt-4 sm:mt-5 md:mt-6 text-white/85 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover products faster with AI-powered search, smart
              recommendations, secure payments and lightning-fast shopping
              experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-5 sm:mt-7 md:mt-8 justify-center lg:justify-start items-center sm:items-stretch lg:items-start">
              <Button
                onClick={() => navigate("/products")}
                className="bg-white text-indigo-700 hover:bg-gray-100 font-semibold px-6 md:px-8 py-5 md:py-6 text-sm md:text-base rounded-xl shadow-lg shadow-black/10 cursor-pointer w-full sm:w-auto min-h-[44px] flex items-center justify-center"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Slider side */}
          <div className="relative flex justify-center w-full px-2 sm:px-4 overflow-hidden min-w-0">
            {/* Glow */}
            <div className="absolute w-64 md:w-96 lg:w-[450px] h-64 md:h-96 lg:h-[450px] bg-violet-400/20 rounded-full blur-3xl" />

            {/* Floating Card */}
            <div className="relative w-full max-w-full sm:max-w-xl overflow-hidden min-w-0">
              <div className="overflow-hidden w-full">
                <HeroSlider />
              </div>

              <div className="absolute -top-2 -right-1 sm:-top-5 sm:-right-5 bg-white text-gray-900 px-2 sm:px-5 py-1 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl animate-float hidden sm:block text-left">
                <p className="text-[8px] sm:text-xs text-gray-500">AI Powered Search</p>
                <h3 className="font-bold text-[10px] sm:text-sm">Find Products Instantly</h3>
              </div>

              <div className="absolute -bottom-2 -left-1 sm:-bottom-5 sm:-left-5 bg-white text-gray-900 px-2 sm:px-5 py-1 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl animate-float hidden sm:block text-left" style={{ animationDelay: "1.5s" }}>
                <p className="text-[8px] sm:text-xs text-gray-500">Products Available</p>
                <h3 className="font-bold text-[10px] sm:text-sm">10,000+</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
