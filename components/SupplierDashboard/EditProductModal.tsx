"use client";

import {
  Product,
  useUpdateSupplierProductMutation,
} from "@/redux/features/api/SupplierDashboard/Product/SupplierProduct";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { X } from "lucide-react";

const getSafeImageSrc = (src: string | null | undefined) => {
  if (!src) return "/images/placeholder-product.png";
  if (src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://") || src.startsWith("blob:")) {
    try {
      if (src.startsWith("http")) {
        new URL(src);
      }
      return src;
    } catch (e) {
      return "/images/placeholder-product.png";
    }
  }
  return "/images/placeholder-product.png";
};

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
}

export function EditProductModal({ product, onClose }: EditProductModalProps) {
  const [updateSupplierProduct, { isLoading }] =
    useUpdateSupplierProductMutation();

  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    price: string;
    redirect_url: string;
    description: string;
    status: "draft" | "published";
    image?: File;
  }>({
    name: product.name,
    category: product.category,
    price: product.price,
    redirect_url: product.redirect_url,
    description: product.description,
    status: product.status,
    image: undefined,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    getSafeImageSrc(product.image)
  );

  useEffect(() => {
    if (formData.image) {
      const objectUrl = URL.createObjectURL(formData.image);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [formData.image]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.files) {
      const file = e.target.files[0];
      if (file) {
        setFormData((prev) => ({ ...prev, [name]: file }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSupplierProduct({ id: product.id, data: formData }).unwrap();
      toast.success("Product updated successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Update failed.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 w-113 relative flex flex-col gap-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <button
          className="absolute top-6 right-6 text-[#94A3B8] hover:text-[#041228] transition-colors bg-[#F8FBFA] p-2 rounded-full"
          onClick={onClose}
          type="button"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-[#041228]">Edit Product</h2>
          <p className="text-sm text-[#94A3B8]">Update your product information</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Image Preview Area */}
          <div className="flex items-center gap-6 p-4 bg-[#F8FBFA] rounded-2xl border border-[#D9E6FF]">
            <div className="w-20 h-20 rounded-xl bg-[#E4F0FF] overflow-hidden shrink-0 border border-[#D9E6FF]">
              <Image
                src={getSafeImageSrc(imagePreview)}
                alt="Preview"
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[#041228]">Product Image</span>
              <label className="text-xs text-[#3A86FF] font-medium hover:underline cursor-pointer">
                Change Image
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#94A3B8] ml-1">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="bg-white border border-[#E4EFFF] rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-sm font-normal text-[#041228] placeholder:text-[#94A3B8]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#94A3B8] ml-1">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                className="bg-white border border-[#E4EFFF] rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-sm font-normal text-[#041228] placeholder:text-[#94A3B8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#94A3B8] ml-1">Price</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                className="bg-white border border-[#E4EFFF] rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-sm font-normal text-[#041228] placeholder:text-[#94A3B8]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#94A3B8] ml-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="bg-white border border-[#E4EFFF] rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-sm font-normal text-[#041228] cursor-pointer appearance-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#94A3B8] ml-1">Redirect URL</label>
            <input
              type="text"
              name="redirect_url"
              value={formData.redirect_url}
              onChange={handleChange}
              placeholder="Redirect URL"
              className="bg-white border border-[#E4EFFF] rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-sm font-normal text-[#041228] placeholder:text-[#94A3B8]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#94A3B8] ml-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              rows={3}
              className="bg-white border border-[#E4EFFF] rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-sm font-normal text-[#041228] placeholder:text-[#94A3B8] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#3A86FF] text-white py-3.5 rounded-xl font-medium text-sm hover:bg-opacity-90 transition-all shadow-lg shadow-[#3A86FF]/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
          >
            {isLoading ? "Updating Product..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
