import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Checks if a user is restricted (account older than 7 days and no plan).
 */
export const isRestricted = (user: any) => {
  if (!user) return true;

  const createdAt = new Date(user.created_at);
  const now = new Date();

  const diffDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  const hasPlan = !!user.plan_id;

  return diffDays > 7 && !hasPlan;
};

export const getFullImageUrl = (url?: any, defaultUrl?: string) => {
  const fallback = defaultUrl ?? null;

  if (!url || typeof url !== "string" || url === "null" || url === "undefined" || url.trim() === "") {
    return fallback;
  }

  if (url.startsWith("http") || url.startsWith("data:")) return url;

  const storageBase = "https://api.biovuedigitalwellness.com";
  
  // Clean the URL: remove leading slash if present
  let cleanUrl = url.startsWith("/") ? url.slice(1) : url;
  
  // If it already starts with storage/, just append to base
  if (cleanUrl.startsWith("storage/")) {
    return `${storageBase}/${cleanUrl}`;
  }
  
  // Otherwise append storage/ and the clean URL
  return `${storageBase}/storage/${cleanUrl}`;
};
