import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { X, SlidersHorizontal, RotateCcw, ChevronDown } from "lucide-react";

const FilterSidebar = ({
  search,
  setSearch,
  category,
  setCategory,
  brand,
  setBrand,
  allProducts,
  priceRange,
  setPriceRange,
  isOpen,
  onClose,
}) => {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const Categories = allProducts.map((p) => p.category);
  const UniqueCategory = ["All", ...new Set(Categories)];

  const INITIAL_CATEGORY_COUNT = 5;

  const visibleCategories = showAllCategories
    ? UniqueCategory
    : UniqueCategory.slice(0, INITIAL_CATEGORY_COUNT);

  const Brands = allProducts.map((p) => p.brand);
  const UniqueBrand = ["All", ...new Set(Brands)];

  const handleCategory = (val) => {
    setCategory(val);
  };

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };

  const handleMinChange = (e) => {
    const value = Number(e.target.value);
    if (value <= priceRange[1]) setPriceRange([value, priceRange[1]]);
  };

  const handleMaxChange = (e) => {
    const value = Number(e.target.value);
    if (value >= priceRange[0]) setPriceRange([priceRange[0], value]);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setBrand("All");
    setPriceRange([0, 999999]);
  };

  // Count active filters
  const activeFilterCount = [
    category !== "All",
    brand !== "All",
    priceRange[0] > 0 || priceRange[1] < 999999,
    search.trim() !== "",
  ].filter(Boolean).length;

  const filterContent = (
    <div className="space-y-6">
      {/* Header (mobile only) */}
      <div className="flex items-center justify-between md:hidden">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close filters"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* Desktop header */}
      <div className="hidden md:flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <h2 className="text-base font-semibold text-slate-900">Filters</h2>
        </div>
        {activeFilterCount > 0 && (
          <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
            {activeFilterCount} active
          </span>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Search
        </label>
        <div className="relative">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="bg-slate-50 border-slate-200 rounded-xl pl-3 pr-3 py-2.5 text-sm focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all w-full"
          />
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Category */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Category
        </label>
        <div className="flex flex-col gap-1.5">
          {visibleCategories.map((item, index) => (
            <button
              key={index}
              onClick={() => handleCategory(item)}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                category === item
                  ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  category === item
                    ? "border-indigo-600 bg-indigo-600"
                    : "border-slate-300"
                }`}
              >
                {category === item && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </span>
              {item}
            </button>
          ))}
          {UniqueCategory.length > INITIAL_CATEGORY_COUNT && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="flex items-center gap-2 mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showAllCategories ? "rotate-180" : ""
                }`}
              />

              {showAllCategories
                ? "See Less"
                : `See ${
                    UniqueCategory.length - INITIAL_CATEGORY_COUNT
                  } More Categories`}
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Brand */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Brand
        </label>
        <div className="relative">
          <select
            className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 font-medium focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer pr-9"
            value={brand}
            onChange={handleBrandChange}
          >
            {UniqueBrand.map((item, index) => (
              <option key={index} value={item}>
                {item === "All" ? "All Brands" : item}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Price Range */}
      <div className="space-y-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Price Range
        </label>

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <span className="text-[10px] text-slate-400 mb-1 block">Min</span>
            <input
              type="number"
              min="0"
              max="5000"
              value={priceRange[0]}
              onChange={handleMinChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
          <span className="text-slate-300 mt-4">—</span>
          <div className="flex-1">
            <span className="text-[10px] text-slate-400 mb-1 block">Max</span>
            <input
              type="number"
              min="0"
              max="999999"
              value={priceRange[1]}
              onChange={handleMaxChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2 px-1">
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={priceRange[0]}
            onChange={handleMinChange}
            className="w-full"
          />
          <input
            type="range"
            min="0"
            max="999999"
            step="100"
            value={priceRange[1]}
            onChange={handleMaxChange}
            className="w-full"
          />
        </div>

        <p className="text-xs text-slate-500 font-medium text-center">
          ₹{priceRange[0].toLocaleString("en-IN")} — ₹
          {priceRange[1].toLocaleString("en-IN")}
        </p>
      </div>

      <div className="border-t border-slate-100" />

      {/* Reset */}
      <Button
        onClick={resetFilters}
        variant="outline"
        className="w-full rounded-xl border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all cursor-pointer"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset Filters
      </Button>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-72 lg:w-80 flex-shrink-0">
        <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-slate-100 p-5 max-h-[calc(100vh-7rem)] overflow-y-auto">
          {filterContent}
        </div>
      </aside>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out md:hidden overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Filter options"
      >
        <div className="p-5">{filterContent}</div>
      </div>
    </>
  );
};

export default FilterSidebar;
