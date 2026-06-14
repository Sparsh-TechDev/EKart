import React from "react";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

import { X } from "lucide-react";

const ImageUpload = ({
  productData,
  setProductData,
}) => {
  // handle file selection
  const handleFiles = (e) => {
    const files = Array.from(
      e.target.files || [],
    );

    if (files.length) {
      setProductData((prev) => ({
        ...prev,

        // prevent crash if prev or prev.productImg is null
        productImg: [
          ...(prev?.productImg || []),
          ...files,
        ],
      }));
    }
  };

  // remove image
  const removeImage = (index) => {
    setProductData((prev) => ({
      ...prev,

      // prevent null errors
      productImg:
        prev?.productImg?.filter(
          (_, i) => i !== index,
        ) || [],
    }));
  };

  return (
    <div className="grid gap-4">
      {/* label */}
      <Label className="text-sm font-medium">
        Product Images
      </Label>

      {/* hidden input */}
      <Input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFiles}
      />

      {/* upload button */}
      <Button
        variant="outline"
        className="w-full"
        asChild
      >
        <label
          htmlFor="file-upload"
          className="cursor-pointer"
        >
          Upload Images
        </label>
      </Button>

      {/* image preview */}
      {productData?.productImg?.length >
        0 && (
        <div className="grid grid-cols-2 gap-4 mt-3 sm:grid-cols-3">
          {productData.productImg.map(
            (file, idx) => {
              let preview = "";

              // new uploaded file
              if (file instanceof File) {
                preview =
                  URL.createObjectURL(file);
              }

              // old image from database
              else if (file?.url) {
                preview = file.url;
              }

              // fallback string url
              else if (
                typeof file === "string"
              ) {
                preview = file;
              }

              // invalid image
              else {
                return null;
              }

              return (
                <Card
                  key={idx}
                  className="relative group overflow-hidden border-slate-200"
                >
                  <CardContent className="p-2">
                    <img
                      src={preview}
                      alt="product"
                      width={200}
                      height={200}
                      className="w-full h-32 object-cover rounded-md"
                    />

                    {/* remove button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();

                        removeImage(idx);
                      }}
                      className="absolute top-3 right-3 bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                    >
                      <X size={16} />
                    </button>
                  </CardContent>
                </Card>
              );
            },
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;