// Weight, Activity, Nutrition Data
export const weightData = [
  { name: "M", val: 217 },
  { name: "T", val: 214 },
  { name: "W", val: 216 },
  { name: "T", val: 212 },
  { name: "F", val: 214 },
  { name: "S", val: 210 },
  { name: "S", val: 209 },
];

export const activityData = [
  { name: "M", val: 2000 },
  { name: "T", val: 2400 },
  { name: "W", val: 2700 },
  { name: "T", val: 1800 },
  { name: "F", val: 2200 },
  { name: "S", val: 1500 },
  { name: "S", val: 1000 },
];

export const nutritionData = [
  { name: "M", p: 30, c: 40, f: 30 },
  { name: "T", p: 35, c: 35, f: 30 },
  { name: "W", p: 40, c: 30, f: 30 },
  { name: "T", p: 30, c: 45, f: 25 },
  { name: "F", p: 35, c: 40, f: 25 },
  { name: "S", p: 25, c: 35, f: 40 },
  { name: "S", p: 30, c: 30, f: 40 },
];

// Metrics cards for Current Health Overview
export const healthMetrics = [
  {
    label: "Current Weight",
    value: "204.0",
    unit: "lbs",
    status: "+12 lbs above ideal",
    desc: "Based on standard wellness ranges",
    color: "text-[#3A86FF]",
  },
  {
    label: "BMI",
    value: "29.3",
    unit: "",
    status: "Healthy range : 18.5 - 24.9",
    desc: "Your Body fat is higher than the recommended range",
    color: "text-[#F59E0B]",
  },
  {
    label: "Nutrition Quality",
    value: "80/100",
    unit: "",
    status: "Balanced",
    desc: "your meals are fueling you well today",
    color: "text-[#10B981]",
  },
  {
    label: "Weekly Workouts",
    value: "2",
    unit: "session",
    status: "Recommended : 4-5 sessions",
    desc: "Regular workouts help reach your wellness goal faster",
    color: "text-[#EF4444]",
  },
  {
    label: "Daily Steps",
    value: "29.3",
    unit: "",
    status: "Goal : 8000 steps",
    desc: "Increasing daily movement improves overall health",
    color: "text-[#EF4444]",
  },
  {
    label: "Sleep Hours",
    value: "6.5",
    unit: "hrs",
    status: "Recommended : 7-9 hours",
    desc: "Quality sleep supports recovery & focus.",
    color: "text-[#EF4444]",
  },
];
