"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"; // optional, for className merge

const scrollAreaClasses = cva("overflow-hidden rounded-lg");

const ScrollArea = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <ScrollAreaPrimitive.Root className={cn(scrollAreaClasses(), className)}>
    <ScrollAreaPrimitive.Viewport className="w-full h-full">{children}</ScrollAreaPrimitive.Viewport>
    <ScrollAreaPrimitive.Scrollbar className="flex select-none touch-none p-0.5 bg-gray-200 rounded-full" orientation="vertical">
      <ScrollAreaPrimitive.Thumb className="flex-1 bg-gray-400 rounded-full" />
    </ScrollAreaPrimitive.Scrollbar>
  </ScrollAreaPrimitive.Root>
);

export { ScrollArea };