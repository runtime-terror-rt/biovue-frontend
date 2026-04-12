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
