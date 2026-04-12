"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";

interface AvatarProps {
  className?: string;
  children: React.ReactNode;
}

const Avatar = ({ className, children }: AvatarProps) => (
  <AvatarPrimitive.Root
    className={`inline-flex items-center justify-center overflow-hidden rounded-full ${className}`}
  >
    {children}
  </AvatarPrimitive.Root>
);

const AvatarImage = AvatarPrimitive.Image;
const AvatarFallback = AvatarPrimitive.Fallback;

export { Avatar, AvatarImage, AvatarFallback };
