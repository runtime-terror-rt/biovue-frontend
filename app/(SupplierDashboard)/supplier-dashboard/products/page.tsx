"use client";

import { Search, ChevronDown, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Product,
  useDeleteSupplierProductMutation,
  useGetSupplierProductsQuery,
} from "@/redux/features/api/SupplierDashboard/Product/SupplierProduct";
import { useState } from "react";
import { toast } from "sonner";
import { EditProductModal } from "@/components/SupplierDashboard/EditProductModal";
import { BulkUploadModal } from "@/components/SupplierDashboard/BulkUploadModal";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { downloadProductsXlsx } from "@/redux/features/api/SupplierDashboard/Product/DownloadCSV";
import { useAppSelector } from "@/redux/store/hooks";
import { selectCurrentToken } from "@/redux/features/slice/authSlice";

const getSafeImageSrc = (src: string | null | undefined) => {
  if (!src) return "/images/placeholder-product.png";
  if (
    src.startsWith("/") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  ) {
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

export default function MyProductsPage() {
  const { data, isLoading } = useGetSupplierProductsQuery();
  const [deleteSupplierProduct] = useDeleteSupplierProductMutation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const token = useAppSelector(selectCurrentToken);

  const handleExport = async () => {
    if (!token) {
      toast.error("You are not authenticated.");
      return;
    }
    const loadingToast = toast.loading("Exporting products...");
    try {
      await downloadProductsXlsx(token);
      toast.success("Products exported successfully!", { id: loadingToast });
    } catch (error) {
      toast.error("Failed to export products.", { id: loadingToast });
    }
  };

  const products = [...(data?.data ?? [])].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const handleDelete = async (product: Product) => {
    const confirmed = confirm(
      `Are you sure you want to delete "${product.name}"?`,
    );

    if (!confirmed) {
      toast("Deletion canceled");
      return;
    }

    try {
      await deleteSupplierProduct(product.id).unwrap();
      toast.success(`Product "${product.name}" deleted successfully!`);
    } catch (err) {
      const error = err as FetchBaseQueryError;
      toast.error(
        "data" in error && error.data && typeof error.data === "string"
          ? error.data
          : "Failed to delete product.",
      );
    }
  };

  if (isLoading) {
    return <div className="p-10">Loading products...</div>;
  }
  return (
    <div className="flex flex-col gap-10">
      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-6 mr-4">
        <div className="relative group w-full max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            size={20}
          />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-white border border-[#E4EFFF] rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[16px] font-normal leading-6 text-[#041228] placeholder:text-[#94A3B8] shadow-sm"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group min-w-35">
            <select className="w-full bg-white border border-[#E4EFFF] rounded-xl py-3.5 px-6 appearance-none cursor-pointer text-[16px] font-normal leading-6 text-[#041228] focus:outline-none shadow-sm pr-12">
              <option>All Status</option>
              <option>Active</option>
              <option>Draft</option>
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#041228] pointer-events-none"
              size={20}
            />
          </div>
          <Button
            onClick={handleExport}
            className="bg-[#14A4A9] hover:opacity-80 text-white px-8 py-3.5 rounded-xl font-normal text-[16px] leading-6 hover:bg-opacity-90 transition-all flex items-center gap-3 shadow-lg shadow-[#3A86FF]/10 cursor-pointer"
          >
            <Download size={22} strokeWidth={1.5} />
            Export Products
          </Button>
          <Button
            onClick={() => setIsBulkUploadModalOpen(true)}
            className="bg-[#14A4A9] hover:opacity-80 text-white px-8 py-3.5 rounded-xl font-normal text-[16px] leading-6 hover:bg-opacity-90 transition-all flex items-center gap-3 shadow-lg shadow-[#14A4A9]/10 cursor-pointer"
          >
            <Plus size={22} strokeWidth={1.5} />
            Bulk Upload(.xlsx)
          </Button>
          <Link
            href="/supplier-dashboard/add-product"
            className="bg-[#14A4A9] hover:opacity-80 text-white px-8 py-3.5 rounded-xl font-normal text-[16px] leading-6 hover:bg-opacity-90 transition-all flex items-center gap-3 shadow-lg shadow-[#14A4A9]/10 cursor-pointer"
          >
            <Plus size={22} strokeWidth={1.5} />
            Add New Product
          </Link>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-3xl border border-[#D9E6FF] shadow-sm overflow-hidden mr-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FBFA]/30 border-b border-[#F8FBFA]">
                <th className="px-10 py-6 text-sm font-normal text-[#94A3B8] uppercase tracking-wider">
                  Product Image
                </th>
                <th className="px-10 py-6 text-sm font-normal text-[#94A3B8] uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-10 py-6 text-sm font-normal text-[#94A3B8] uppercase tracking-wider">
                  Redirect URL
                </th>
                <th className="px-10 py-6 text-sm font-normal text-[#94A3B8] uppercase tracking-wider">
                  Price
                </th>
                <th className="px-10 py-6 text-sm font-normal text-[#94A3B8] uppercase tracking-wider text-center">
                  Status
                </th>
                <th className="px-10 py-6 text-sm font-normal text-[#94A3B8] uppercase tracking-wider text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8FBFA]">
              {products.map((product, id) => (
                <tr key={id} className="hover:bg-[#F8FBFA]/20 transition-all">
                  <td className="px-10 py-6">
                    <div className="w-16 h-16 rounded-xl bg-[#E4F0FF] overflow-hidden">
                      <Image
                        src={getSafeImageSrc(product.image)}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-[16px] font-normal text-[#041228] leading-6">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-[16px] font-normal text-[#94A3B8] leading-6">
                      {product.redirect_url}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-[16px] font-normal text-[#041228] leading-6">
                      {product.price}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span
                      className={cn(
                        "px-6 py-1.5 rounded-full text-sm font-normal",
                        product.status === "published"
                          ? "bg-[#E6F7F7] text-[#14A4A9]"
                          : "bg-gray-100 text-[#94A3B8]",
                      )}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center justify-center gap-6">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsViewModalOpen(true);
                        }}
                        className="text-[#041228]/60 hover:text-[#041228] transition-colors cursor-pointer"
                      >
                        <Eye size={22} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsEditModalOpen(true);
                        }}
                        className="text-[#041228]/60 hover:text-[#3A86FF] transition-colors cursor-pointer"
                      >
                        <Pencil size={22} />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="text-[#041228]/60 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 size={22} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="h-20" />
      </div>
      {/* View Modal */}
      {isViewModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 relative">
            <button
              className="absolute top-4 right-4"
              onClick={() => setIsViewModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Product Details</h2>
            <Image
              src={getSafeImageSrc(selectedProduct.image)}
              alt={selectedProduct.name}
              width={200}
              height={200}
              className="mb-4 object-cover rounded-lg"
            />
            <p>
              <strong>Name:</strong> {selectedProduct.name}
            </p>
            <p>
              <strong>Category:</strong> {selectedProduct.category}
            </p>
            <p>
              <strong>Price:</strong> {selectedProduct.price}
            </p>
            <p>
              <strong>Redirect URL:</strong> {selectedProduct.redirect_url}
            </p>
            <p>
              <strong>Description:</strong> {selectedProduct.description}
            </p>
          </div>
        </div>
      )}
      {isEditModalOpen && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
      {isBulkUploadModalOpen && (
        <BulkUploadModal onClose={() => setIsBulkUploadModalOpen(false)} />
      )}
    </div>
  );
}
