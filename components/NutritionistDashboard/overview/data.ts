export interface ActionCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkText: string;
  href: string;
}

export interface Client {
  id: number;
  name: string;
  goal: string;
  projectionUsed: string;
  status: "on-track" | "need-attention" | "inactive";
  activity: string;
}

export interface Activity {
  id: number;
  description: string;
  timeAgo: string;
}

export const activities: Activity[] = [
  {
    id: 1,
    description: "Alex logged nutrition data",
    timeAgo: "10 mins",
  },
  {
    id: 2,
    description: "Maria completed daily meal plan",
    timeAgo: "20 mins",
  },
  {
    id: 3,
    description: "You updated meal plan for John",
    timeAgo: "1 day",
  },
  {
    id: 4,
    description: "Sarah posted a food log photo",
    timeAgo: "4 hours",
  },
];
