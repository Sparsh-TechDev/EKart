import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { setProducts } from "@/redux/productSlice";
import axios from "axios";
import {
  CircleDollarSign,
  Image as ImageIcon,
  LayoutDashboard,
  Loader2,
  PackagePlus,
  Tags,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const AddProduct = () => {
  const accessToken = localStorage.getItem("accessToken");

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [aiLoading, setAiLoading] = useState(false);

  const { products } = useSelector((store) => store.product);

  const [productData, setProductData] = useState({
    productName: "",
    productPrice: "",
    productDesc: "",
    productImg: [],
    brand: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productData.productName || !productData.productPrice) {
      toast.error("Please fill in the required fields");
      return;
    }

    if (productData.productImg.length === 0) {
      toast.error("Please select at least 1 image");
      return;
    }

    const formData = new FormData();

    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("productDesc", productData.productDesc);
    formData.append("brand", productData.brand);
    formData.append("category", productData.category);

    productData.productImg.forEach((img) => {
      formData.append("files", img);
    });

    try {
      setLoading(true);

      const response = await axios.post(
        `http://localhost:8000/api/v1/product/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        dispatch(setProducts([...products, response.data.product]));

        toast.success(response.data.message);

        setProductData({
          productName: "",
          productPrice: "",
          productDesc: "",
          productImg: [],
          brand: "",
          category: "",
        });
      }
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = async (e) => {
    setProductData({
      productName: "",
      productPrice: "",
      productDesc: "",
      productImg: [],
      brand: "",
      category: "",
    });
  };

  const generateDescription = async () => {
    if (
      !productData.productName ||
      !productData.brand ||
      !productData.category
    ) {
      toast.error("Please fill Product Name, Brand and Category first");
      return;
    }

    try {
      setAiLoading(true);

      const response = await axios.post(
        "http://localhost:8000/api/v1/product/generate-description",
        {
          productName: productData.productName,
          brand: productData.brand,
          category: productData.category,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.success) {
        setProductData((prev) => ({
          ...prev,
          productDesc: response.data.description,
        }));

        toast.success("AI Description generated successfully");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message || "Failed to generate description",
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 pt-6 md:pt-8 min-h-screen bg-slate-50/50 pb-20">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
  <h1 className="text-3xl font-bold">
    Add New Product
  </h1>

  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
    ✨ AI Powered
  </span>
</div>

              <p className="text-sm text-slate-500 mt-1">
                Create a new product and publish it to your store.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleDiscard} variant="outline" className="px-6">
              Discard
            </Button>

            <Button
              disabled={loading}
              onClick={handleSubmit}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 shadow-sm transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Product"
              )}
            </Button>
          </div>
        </div>

        {/* form layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* left column */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* general info */}
            <Card className="shadow-sm border-slate-200/60">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <LayoutDashboard className="h-5 w-5 text-indigo-500" />
                  General Information
                </CardTitle>

                <CardDescription>
                  The primary details of your product.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="productName" className="text-sm font-medium">
                    Product Name <span className="text-red-500">*</span>
                  </Label>

                  <Input
                    id="productName"
                    onChange={handleChange}
                    value={productData.productName}
                    type="text"
                    name="productName"
                    placeholder="e.g. iPhone 15 Pro Max"
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="productDesc"
                      className="text-sm font-medium"
                    >
                      Description
                    </Label>

                    <Button
                      type="button"
                      size="sm"
                      onClick={generateDescription}
                      disabled={aiLoading}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {aiLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "✨ Generate AI Description"
                      )}
                    </Button>
                  </div>

                  <Textarea
                    id="productDesc"
                    onChange={handleChange}
                    value={productData.productDesc}
                    name="productDesc"
                    placeholder="Write a detailed description of this product..."
                    className="min-h-[140px] bg-white resize-y"
                  />
                </div>
              </CardContent>
            </Card>

            {/* media/images */}
            <Card className="shadow-sm border-slate-200/60">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ImageIcon className="h-5 w-5 text-indigo-500" />
                  Media & Images <span className="text-red-500">*</span>
                </CardTitle>

                <CardDescription>
                  Upload high-quality images to showcase your product.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="rounded-xl border border-dashed border-slate-300 p-6 bg-slate-50 hover:bg-slate-100/50 transition-colors">
                  <ImageUpload
                    productData={productData}
                    setProductData={setProductData}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* right column */}
          <div className="flex flex-col gap-8">
            {/* pricing */}
            <Card className="shadow-sm border-slate-200/60">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CircleDollarSign className="h-5 w-5 text-emerald-500" />
                  Pricing
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="productPrice" className="text-sm font-medium">
                    Base Price <span className="text-red-500">*</span>
                  </Label>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                      ₹
                    </span>

                    <Input
                      id="productPrice"
                      onChange={handleChange}
                      value={productData.productPrice}
                      type="number"
                      name="productPrice"
                      placeholder="0.00"
                      className="pl-7 bg-white"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* organization */}
            <Card className="shadow-sm border-slate-200/60">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Tags className="h-5 w-5 text-orange-500" />
                  Organization
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-sm font-medium">
                    Brand
                    <span className="text-red-500">*</span>
                  </Label>

                  <Input
                    id="brand"
                    onChange={handleChange}
                    value={productData.brand}
                    type="text"
                    name="brand"
                    placeholder="e.g. Apple"
                    className="bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category
                    <span className="text-red-500">*</span>
                  </Label>

                  <Input
                    id="category"
                    onChange={handleChange}
                    value={productData.category}
                    type="text"
                    name="category"
                    placeholder="e.g. Electronics, Mobile"
                    className="bg-white"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* summary card */}
            <Card className="shadow-sm border-slate-200/60 bg-indigo-50/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <PackagePlus className="h-6 w-6 text-indigo-600" />
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900">
                      Ready to publish?
                    </h4>

                    <p className="text-xs text-slate-500 mt-1">
                      Make sure you have added a competitive price and at least
                      one high quality image.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
