// ─── Shared helpers used across api-service components ───────────────────────

export function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export const AVATAR_COLORS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-600",
  "from-teal-500 to-green-600",
  "from-orange-500 to-rose-600",
  "from-pink-500 to-rose-600",
  "from-indigo-500 to-blue-600",
  "from-emerald-500 to-teal-600",
];

export const avatarColor = (id: number) =>
  AVATAR_COLORS[id % AVATAR_COLORS.length];

export function formatDate(ds: string) {
  return new Date(ds).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
