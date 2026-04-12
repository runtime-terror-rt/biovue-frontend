"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ArrowRight, Home, LayoutDashboard, Loader2, Receipt } from "lucide-react";
import { useGetPaymentSummaryQuery } from "@/redux/features/api/paymentApi";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { baseApi } from "@/redux/features/api/baseApi";
import { useEffect } from "react";

const PaymentSuccessPage = () => {
  const { data, isLoading, isError } = useGetPaymentSummaryQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data?.success) {
      console.log("Payment successful, invalidating tags...");
      dispatch(baseApi.util.invalidateTags(["Projection", "Profile"]));
    }
  }, [data, dispatch]);

  console.log(data,"showpricing data ")

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-[#0FA4A9] animate-spin mb-4" />
        <p className="text-[#5F6F73] font-medium animate-pulse">Confirming your transaction...</p>
      </div>
    );
  }

  if (isError || !data?.success || !data?.latest_payment) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <Receipt className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-[#1F2D2E] mb-2">Something went wrong</h1>
        <p className="text-[#5F6F73] max-w-md mb-8">
          We couldn't retrieve your payment details. If you've just completed a payment, it might take a moment to reflect.
        </p>
        <Link 
          href="/" 
          className="bg-[#0FA4A9] text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-md"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const { latest_payment, user } = data;

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans py-10">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-center">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="BioVue Logo"
            width={120}
            height={60}
            className="w-24 md:w-[120px] object-contain"
          />
        </Link>
      </header>

      <main className="container mx-auto px-6  flex flex-col items-center">
        {/* Success Icon & Heading */}
        <div className="text-center mb-10 animate-in fade-in zoom-in duration-700">
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#1F2D2E] mb-3">Subscription Confirmed!</h1>
          <p className="text-[#5F6F73] text-lg">
            Thank you, <span className="text-[#1F2D2E] font-semibold">{user?.name || 'Customer'}</span>. Your {latest_payment?.plan?.name || 'Subscription'} plan is now active.
          </p>
        </div>

        {/* Transaction Details Card */}
        <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#E5E9EA] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 animate-in slide-in-from-bottom-8 duration-700 delay-150">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-50">
            <div>
              <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Transaction ID</p>
              <p className="text-[#1F2D2E] font-mono text-sm break-all">{latest_payment?.transaction_id || 'N/A'}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Status</p>
              <span className="bg-[#E6F6F6] text-[#0FA4A9] text-xs font-bold px-3 py-1 rounded-full border border-[#B2E2E3]">
                {(latest_payment?.status || 'Active').toUpperCase()}
              </span>
            </div>
          </div>

          <div className="space-y-6 mb-10">
            <div className="flex justify-between items-center px-4 py-5 bg-[#F9FAFB] rounded-2xl border border-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100">
                   <div className="w-3 h-3 rounded-full bg-[#3A86FF]" />
                </div>
                <div>
                  <p className="font-bold text-[#1F2D2E]">{latest_payment?.plan?.name || 'Membership'} Plan</p>
                  <p className="text-xs text-[#5F6F73] font-medium">Billed {(latest_payment?.currency || 'USD').toUpperCase()}</p>
                </div>
              </div>
              <p className="text-xl font-bold text-[#1F2D2E]">${latest_payment?.amount || '0.00'}</p>
            </div>

            <div className="flex justify-between items-center text-sm px-2">
              <span className="text-[#5F6F73] font-medium">Subtotal</span>
              <span className="text-[#1F2D2E] font-semibold">${latest_payment?.amount || '0.00'}</span>
            </div>
           
            <div className="pt-4 border-t border-gray-50 flex justify-between items-center px-2">
              <span className="text-base font-bold text-[#1F2D2E]">Total Amount Paid</span>
              <span className="text-2xl font-black text-[#0FA4A9]">${latest_payment?.amount || '0.00'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/user-dashboard" 
              className="flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-2xl font-bold  transition-all group"
            >
              <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
              Go To Dashboard
            </Link>
            <Link 
              href="/" 
              className="flex items-center justify-center gap-2 bg-[#E6F6F6] text-[#0FA4A9] py-4 rounded-2xl font-bold hover:bg-[#D9EFEF] transition-all border border-[#B2E2E3]"
            >
              <Home size={20} />
              Back Home
            </Link>
          </div>
        </div>

        
      </main>
    </div>
  );
};

export default PaymentSuccessPage;
