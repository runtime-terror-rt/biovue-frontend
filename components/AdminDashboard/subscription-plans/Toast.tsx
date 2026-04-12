"use client";

import { useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
          isSuccess
            ? "bg-green-50 border border-green-200"
            : "bg-red-50 border border-red-200"
        }`}
      >
        {isSuccess ? (
          <CheckCircle size={20} className="text-green-600" />
        ) : (
          <AlertCircle size={20} className="text-red-600" />
        )}
        <span
          className={`text-sm font-medium ${
            isSuccess ? "text-green-800" : "text-red-800"
          }`}
        >
          {message}
        </span>
        <button
          onClick={onClose}
          className={`ml-2 ${
            isSuccess ? "text-green-600" : "text-red-600"
          } hover:opacity-70`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
