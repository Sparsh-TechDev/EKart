import React, { useState } from "react";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Edit, Search, Trash2 } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import { Card } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import ImageUpload from "@/components/ImageUpload";

import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { setProducts } from "@/redux/productSlice";

import axios from "axios";

const AdminProduct = () => {
  const { products } = useSelector((store) => store.product);

  const [editProduct, setEditProduct] = useState(null);

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [sortOrder, setSortOrder] = useState("");

  const accessToken = localStorage.getItem("accessToken");

  const dispatch = useDispatch();

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // update product
  const handleSave = async (e) => {
    e.preventDefault();

    if (!editProduct) return;

    const formData = new FormData();

    formData.append("productName", editProduct.productName);

    formData.append("productPrice", editProduct.productPrice);

    formData.append("productDesc", editProduct.productDesc);

    formData.append("brand", editProduct.brand);

    formData.append("category", editProduct.category);

    // keep old images
    const existingImages = editProduct.productImg
      ?.filter((img) => !(img instanceof File) && img.public_id)
      .map((img) => img.public_id);

    formData.append("existingImages", JSON.stringify(existingImages));

    // upload new files
    editProduct.productImg
      ?.filter((img) => img instanceof File)
      .forEach((file) => {
        formData.append("files", file);
      });

    try {
      setLoading(true);

      const response = await axios.put(
        `${import.meta.env.VITE_URL}/product/update/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);

        // update redux store
        const updatedProducts = products.map((p) =>
          p._id === editProduct._id ? response.data.product : p,
        );

        dispatch(setProducts(updatedProducts));

        setOpen(false);

        setEditProduct(null);
      }
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const remainingProducts = products.filter(
        (product) => product._id !== productId,
      );
      const response = await axios.delete(
        `${import.meta.env.VITE_URL}/product/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setProducts(remainingProducts));
      }
    } catch (error) {
      console.log(error);
    }
  };

  let filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (sortOrder === "lowToHigh") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.productPrice - b.productPrice);
  } else if (sortOrder === "highToLow") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.productPrice - a.productPrice);
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 pt-6 md:pt-8 flex flex-col gap-4 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Products</h1>

      {/* top section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        {/* search */}
        <div className="relative flex items-center w-full sm:w-auto">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search Product..."
            className="w-full sm:w-80 pr-10 rounded-xl bg-white border-slate-200"
          />

          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
        </div>

        {/* sort */}
        <Select onValueChange={(value)=>setSortOrder(value)}>
          <SelectTrigger className="w-full sm:w-48 bg-white rounded-xl border-slate-200">
            <SelectValue placeholder="Sort by Price" />
          </SelectTrigger>

          <SelectContent position="popper" sideOffset={4}>
            <SelectItem value="lowToHigh">Price: Low to High</SelectItem>

            <SelectItem value="highToLow">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* products */}
      <div className="flex flex-col gap-3">
        {filteredProducts.map((product, index) => {
          return (
            <Card key={index} className="px-3 md:px-4 py-3 rounded-2xl shadow-sm border-slate-100">
              <div className="flex items-center justify-between gap-3">
                {/* product info */}
                <div className="flex gap-3 md:gap-4 items-center flex-1 min-w-0">
                  <img
                    src={product.productImg?.[0]?.url}
                    alt="product"
                    className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl flex-shrink-0"
                  />

                  <h1 className="font-semibold text-sm md:text-base text-slate-700 line-clamp-2 min-w-0">
                    {product.productName}
                  </h1>
                </div>

                {/* price */}
                <h1 className="font-bold text-sm md:text-base text-slate-800 whitespace-nowrap">
                  ₹{product.productPrice.toLocaleString("en-IN")}
                </h1>

                {/* actions */}
                <div className="flex gap-2 md:gap-3 flex-shrink-0">
                  {/* edit dialog */}
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <button
                        onClick={() => {
                          setEditProduct(product);
                          setOpen(true);
                        }}
                        className="p-2 rounded-lg hover:bg-emerald-50 transition-colors"
                      >
                        <Edit className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                      </button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[625px] max-h-[740px] overflow-y-scroll rounded-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit product</DialogTitle>

                        <DialogDescription>
                          Make changes to your product here. Click save when
                          you&apos;re done.
                        </DialogDescription>
                      </DialogHeader>

                      {/* form */}
                      <div className="flex flex-col gap-3">
                        {/* name */}
                        <div className="grid gap-2">
                          <Label>Product Name</Label>

                          <Input
                            type="text"
                            onChange={handleChange}
                            value={editProduct?.productName || ""}
                            name="productName"
                            required
                            className="rounded-xl"
                          />
                        </div>

                        {/* price */}
                        <div className="grid gap-2">
                          <Label>Price</Label>

                          <Input
                            type="number"
                            onChange={handleChange}
                            value={editProduct?.productPrice || ""}
                            name="productPrice"
                            required
                            className="rounded-xl"
                          />
                        </div>

                        {/* brand/category */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label>Brand</Label>

                            <Input
                              type="text"
                              onChange={handleChange}
                              value={editProduct?.brand || ""}
                              name="brand"
                              required
                              className="rounded-xl"
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label>Category</Label>

                            <Input
                              type="text"
                              onChange={handleChange}
                              value={editProduct?.category || ""}
                              name="category"
                              required
                              className="rounded-xl"
                            />
                          </div>
                        </div>

                        {/* description */}
                        <div className="grid gap-2">
                          <div className="flex items-center">
                            <Label>Description</Label>
                          </div>

                          <Textarea
                            name="productDesc"
                            onChange={handleChange}
                            value={editProduct?.productDesc || ""}
                            className="rounded-xl"
                          />
                        </div>

                        {/* images */}
                        <ImageUpload
                          productData={editProduct}
                          setProductData={setEditProduct}
                        />
                      </div>

                      {/* footer */}
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline" className="rounded-xl">Cancel</Button>
                        </DialogClose>

                        <Button
                          onClick={handleSave}
                          type="submit"
                          disabled={loading}
                          className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                        >
                          {loading ? "Saving..." : "Save changes"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* delete */}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete this product from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(product._id)}
                          className="rounded-xl bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminProduct;
