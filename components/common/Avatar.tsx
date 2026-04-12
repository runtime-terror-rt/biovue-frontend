"use client";

import Image from "next/image";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  border?: boolean;
}

export default function Avatar({ 
  src, 
  name, 
  size = "md", 
  className,
  border = true
}: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-14 h-14"
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  };

  return (
    <div className={cn(
      "relative rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-gray-50",
      sizeClasses[size],
      border && "border border-gray-100 shadow-sm",
      className
    )}>
      {src && src.trim() !== "" ? (
        <Image
          src={src}
          alt={name || "User Avatar"}
          fill
          className="object-cover"
          unoptimized // To avoid issues with external image URLs if not configured in next.config.js
        />
      ) : (
        <div className="text-gray-400">
          <User size={iconSizes[size]} />
        </div>
      )}
    </div>
  );
}
