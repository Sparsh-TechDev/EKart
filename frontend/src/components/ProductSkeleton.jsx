import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
      <div className="aspect-square bg-slate-100" />
      <div className="p-3 md:p-4 space-y-3">
        <div className="h-3 bg-slate-100 rounded-full w-1/3" />
        <div className="h-4 bg-slate-100 rounded-full w-full" />
        <div className="h-4 bg-slate-100 rounded-full w-3/4" />
        <div className="h-5 bg-slate-100 rounded-full w-1/2 mt-1" />
        <div className="h-10 bg-slate-100 rounded-xl w-full mt-2" />
      </div>
    </div>
  );
};

export default ProductSkeleton;