"use client";

import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
}

export default function SuccessModal({ isOpen }: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        // Modal will close due to parent's redirect
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-lg max-w-sm mx-4 animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">
              Program Updated Successfully!
            </h2>
            <p className="text-sm text-gray-600">
              Your program changes have been saved and will be applied
              immediately.
            </p>
          </div>
          <div className="pt-2">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-2 w-2 border-b-2 border-indigo-600"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
