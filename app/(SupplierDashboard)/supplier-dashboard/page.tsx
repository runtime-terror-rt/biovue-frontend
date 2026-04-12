"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useGetSupplierDashboardQuery } from "@/redux/features/api/SupplierDashboard/Product/SupplierOverview";
import { CheckCircle, FileText, Package, ShoppingCart } from "lucide-react";

export default function SupplierDashboardPage() {
  const { data, isLoading } = useGetSupplierDashboardQuery();
  console.log("Supplier dashboard data:", data);

  if (isLoading) {
    return <div className="p-10">Loading dashboard...</div>;
  }

  const stats = [
    {
      label: "Total Products",
      value: data?.stats.total_products ?? 0,
      icon: Package,
      color: "bg-[#E4F0FF] text-[#3A86FF]",
    },
    {
      label: "Active Products",
      value: data?.stats.active_products ?? 0,
      icon: CheckCircle,
      color: "bg-[#E6F7F7] text-[#14A4A9]",
    },
    {
      label: "Draft Products",
      value: data?.stats.draft_products ?? 0,
      icon: FileText,
      color: "bg-[#FFF3E6] text-[#FF8C42]",
    },
    // {
    //   label: "Total Orders",
    //   value: data?.stats.total_orders ?? 0,
    //   icon: ShoppingCart,
    //   color: "bg-[#F3E8FF] text-[#9333EA]",
    // },
  ];

  const products = data?.recent_products ?? [];

  return (
    <div className="flex flex-col gap-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-3xl p-8 border border-[#D9E6FF] shadow-sm flex items-center gap-6"
          >
            <div
              className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0",
                stat.color,
              )}
            >
              <stat.icon size={30} strokeWidth={1.2} />
            </div>
            <div className="flex flex-col relative w-full">
              <span className="text-4xl font-normal text-[#041228] mb-1">
                {stat.value}
              </span>
              <span className="text-[16px] font-normal text-[#94A3B8] leading-6">
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Products Card */}
      <div className="bg-white rounded-3xl border border-[#D9E6FF] shadow-sm overflow-hidden mt-2">
        <div className="px-10 py-8 border-b border-[#F8FBFA] flex items-center justify-between">
          <h2 className="text-xl font-normal text-[#041228]">
            Recent Products
          </h2>
          <Link
            href="/supplier-dashboard/products"
            className="text-[#3A86FF] font-normal hover:underline cursor-pointer"
          >
            View All
          </Link>
        </div>
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
                  Status
                </th>
                <th className="px-10 py-6 text-sm font-normal text-[#94A3B8] uppercase tracking-wider">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8FBFA]">
              {products.map((product, idx) => (
                <tr key={idx} className="hover:bg-[#F8FBFA]/20 transition-all">
                  <td className="px-10 py-5">
                    <div className="w-14 h-14 rounded-xl bg-[#E4F0FF] overflow-hidden">
                      <Image
                        src={
                          product.product_image ??
                          "/images/placeholder-product.png"
                        }
                        alt={product.product_name}
                        width={56}
                        height={56}
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-10 py-5">
                    <span className="text-[16px] font-normal text-[#041228] leading-6">
                      {product.product_name}
                    </span>
                  </td>
                  <td className="px-10 py-5">
                    <span className="text-[16px] font-normal text-[#94A3B8] leading-6">
                      {product.redirect_url}
                    </span>
                  </td>
                  <td className="px-10 py-5">
                    <span className="px-6 py-1.5 rounded-full bg-[#E6F7F7] text-[#14A4A9] text-sm font-normal">
                      {product.status}
                    </span>
                  </td>
                  <td className="px-10 py-5">
                    <span className="text-[16px] font-normal text-[#041228] leading-6">
                      {product.price}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="h-20" />{" "}
        {/* Bottom spacing padding to match card shape */}
      </div>
    </div>
  );
}
