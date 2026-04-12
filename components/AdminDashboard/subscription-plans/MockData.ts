export interface SubscriptionPlan {
  id: string;
  name: string;
  type: "Individual" | "Professional";
  billingCycle: "Monthly" | "Yearly" | "Annual";
  price: number;
  status: "Active" | "Inactive";
  createdDate: string;
  users: string;
  features: {
    aiProjections: boolean;
    aiHealthSuggestions: boolean;
    deviceSync: boolean;
    prioritySupport: boolean;
  };
  projectionsPerMonth: number;
  isActive: boolean;
}

export const mockPlans: SubscriptionPlan[] = [
  {
    id: "1",
    name: "Free Trial",
    type: "Individual",
    billingCycle: "Monthly",
    price: 0,
    status: "Active",
    createdDate: "2023-10-12",
    users: "Free Trial",
    features: {
      aiProjections: false,
      aiHealthSuggestions: false,
      deviceSync: false,
      prioritySupport: false,
    },
    projectionsPerMonth: 0,
    isActive: true,
  },
  {
    id: "2",
    name: "Plus",
    type: "Professional",
    billingCycle: "Monthly",
    price: 24,
    status: "Active",
    createdDate: "2023-10-12",
    users: "Plus",
    features: {
      aiProjections: true,
      aiHealthSuggestions: true,
      deviceSync: true,
      prioritySupport: false,
    },
    projectionsPerMonth: 100,
    isActive: true,
  },
  {
    id: "3",
    name: "Premium",
    type: "Individual",
    billingCycle: "Yearly",
    price: 280,
    status: "Active",
    createdDate: "2023-10-12",
    users: "Premium",
    features: {
      aiProjections: true,
      aiHealthSuggestions: true,
      deviceSync: true,
      prioritySupport: true,
    },
    projectionsPerMonth: 250,
    isActive: true,
  },
  {
    id: "4",
    name: "Trainer Pro",
    type: "Professional",
    billingCycle: "Annual",
    price: 89,
    status: "Active",
    createdDate: "2023-10-12",
    users: "Trainer Pro",
    features: {
      aiProjections: true,
      aiHealthSuggestions: true,
      deviceSync: true,
      prioritySupport: true,
    },
    projectionsPerMonth: 500,
    isActive: true,
  },
];
