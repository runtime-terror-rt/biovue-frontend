export const initialSettings = [
  {
    id: "new-client",
    title: "New client message alerts",
    description: "Get notified immediately when a client sends a message.",
    enabled: true,
  },
  {
    id: "missed-checkin",
    title: "Missed check-in alerts",
    description:
      "Alerts when a client misses a scheduled weekly or daily check-in.",
    enabled: true,
  },
  {
    id: "milestone",
    title: "Program milestone updates",
    description: "Know when clients complete key program goals or phases.",
    enabled: true,
  },
  {
    id: "ai-insight-1",
    title: "AI insight notifications",
    description:
      "Receive automated suggestions based on client biometric data.",
    enabled: false,
  },
  {
    id: "weekly-summary",
    title: "Weekly summary email",
    description:
      "Receive automated suggestions based on client biometric data.", // Note: Image text seems reused here or slightly different
    enabled: false,
  },
  {
    id: "ai-insight-2",
    title: "AI insight notifications",
    description:
      "A comprehensive report of trainer activity and client performance.",
    enabled: false,
  },
];

export const visibilityOptions = [
  { id: "goals", label: "Show program goals by default", enabled: true },
  { id: "macros", label: "Show wellness targets (macros)", enabled: true },
  {
    id: "supplements",
    label: "Show supplement recommendations",
    enabled: true,
  },
  { id: "graphs", label: "Show progress graphs", enabled: true },
  { id: "ai-insights", label: "Show AI insights", enabled: true },
];
