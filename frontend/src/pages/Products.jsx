import FilterSidebar from "@/components/FilterSidebar";
import React, { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/redux/productSlice";
import {
  Loader2,
  Sparkles,
  Search,
  SlidersHorizontal,
  PackageSearch,
} from "lucide-react";

const Products = () => {
  const { products } = useSelector((store) => store.product);

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 999999]);
  const [sortOrder, setSortOrder] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const dispatch = useDispatch();

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/v1/product/getallproducts`,
      );
      if (response.data.success) {
        setAllProducts(response.data.products);
        dispatch(setProducts(response.data.products));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAISearch = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    try {
      setAiLoading(true);

      // Reset previous filters
      setBrand("All");
      setCategory("All");
      setPriceRange([0, 999999]);

      const response = await axios.post(
        "http://localhost:8000/api/v1/ai/search",
        {
          query: aiPrompt,
        },
      );

      if (!response.data.success) {
        toast.error("AI search failed");
        return;
      }

      const filters = response.data.filters;

      console.log("AI Filters:", filters);

      setAiResult(filters);

      const categoryMap = {
        mobile: "Mobile",
        phone: "Mobile",
        phones: "Mobile",
        smartphone: "Mobile",

        laptop: "Laptops",
        laptops: "Laptops",
      };

      const brandMap = {
        apple: "Apple",
        samsung: "Samsung",
      };

      // Apply Brand
      if (filters.brand) {
        const normalizedBrand =
          brandMap[filters.brand.toLowerCase()] || filters.brand;

        setBrand(normalizedBrand);
      }

      // Apply Category
      if (filters.category) {
        const normalizedCategory =
          categoryMap[filters.category.toLowerCase()] || filters.category;

        setCategory(normalizedCategory);
      }

      // Apply Budget
      if (filters.minPrice !== null || filters.maxPrice !== null) {
        setPriceRange([
          Number(filters.minPrice || 0),
          Number(filters.maxPrice || 999999),
        ]);
      }

      toast.success("✨ AI filters applied");
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || "AI search failed");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (allProducts.length === 0) return;

    let filtered = [...allProducts];

    if (search.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (brand !== "All") {
      filtered = filtered.filter((p) => p.brand === brand);
    }

    filtered = filtered.filter(
      (p) => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1],
    );

    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.productPrice - b.productPrice);
    } else if (sortOrder === "highToLow") {
      filtered.sort((a, b) => b.productPrice - a.productPrice);
    }

    dispatch(setProducts(filtered));
  }, [search, category, brand, priceRange, sortOrder, allProducts, dispatch]);

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div className="pt-20 md:pt-24 pb-12 min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* AI Search Section */}
        <div className="mb-6 md:mb-8">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/60 p-3 md:p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
                <input
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAISearch()}
                  placeholder="Ask AI: Samsung phone under ₹30000..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 md:py-3 text-sm md:text-base text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  aria-label="AI-powered product search"
                />
              </div>
              <button
                disabled={aiLoading}
                onClick={handleAISearch}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-60 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm shadow-violet-200/50 transition-all duration-200 cursor-pointer whitespace-nowrap"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    AI Search
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* AI Result Banner */}
        {aiResult && (
          <div className="mb-6 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200/60 rounded-xl p-3 md:p-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-violet-100 rounded-lg flex-shrink-0">
                <Sparkles className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-violet-700 uppercase tracking-wide mb-1">
                  AI Understood
                </p>
                <p className="text-sm text-violet-600">
                  {aiResult.brand && `Brand: ${aiResult.brand}`}
                  {aiResult.category && ` • Category: ${aiResult.category}`}
                  {aiResult.minPrice &&
                    aiResult.maxPrice &&
                    ` • Budget: ₹${aiResult.minPrice} – ₹${aiResult.maxPrice}`}
                  {!aiResult.minPrice &&
                    aiResult.maxPrice &&
                    ` • Under ₹${aiResult.maxPrice}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile filter + sort controls */}
        <div className="grid grid-cols-2 gap-3 mb-6 md:hidden">
          <button
            onClick={() => setFilterOpen(true)}
            className=" h-11 w-full flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 "
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          <div className="w-full">
            <Select
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value)}
            >
              <SelectTrigger
                className=" w-full !h-11 min-h-11 rounded-xl border-slate-200"
              >
                <SelectValue placeholder="Sort" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value="lowToHigh">Price: Low → High</SelectItem>
                  <SelectItem value="highToLow">Price: High → Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main layout */}
        <div className="flex gap-6 lg:gap-8">
          {/* Sidebar */}
          <FilterSidebar
            allProducts={allProducts}
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            brand={brand}
            setBrand={setBrand}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            isOpen={filterOpen}
            onClose={() => setFilterOpen(false)}
          />

          {/* Products area */}
          <div className="flex-1 min-w-0">
            {/* Desktop sort (above grid) */}
            <div className="hidden md:flex items-center justify-between mb-5">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {products.length}
                </span>{" "}
                results
              </p>
              <Select
                value={sortOrder}
                onValueChange={(value) => setSortOrder(value)}
              >
                <SelectTrigger className="w-48 rounded-xl border-slate-200 bg-white text-sm">
                  <SelectValue placeholder="Sort by Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="lowToHigh">Price: Low → High</SelectItem>
                    <SelectItem value="highToLow">Price: High → Low</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
                {[...Array(8)].map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 md:py-28 text-center animate-fade-in">
                <div className="p-4 bg-slate-100 rounded-2xl mb-6">
                  <PackageSearch className="w-12 h-12 text-slate-400" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-700">
                  No Products Found
                </h2>
                <p className="text-slate-500 mt-2 text-sm md:text-base max-w-md">
                  Try adjusting your search or filter criteria to find what
                  you're looking for.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    loading={loading}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
