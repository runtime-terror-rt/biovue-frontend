export interface ClientNeedingAttention {
  id: number;
  name: string;
  status: "need-attention" | "on-track" | "inactive";
  turningRate: number;
  reason: string;
  lastActivity: string;
  goal: string;
}

export const clientsNeedingAttention: ClientNeedingAttention[] = [
  {
    id: 1,
    name: "Alex Rivera",
    status: "need-attention",
    turningRate: 45,
    reason:
      "No logging activity for 3 days. Client engagement has dropped by 45%.",
    lastActivity: "3 days ago",
    goal: "Fat loss",
  },
  {
    id: 2,
    name: "Sarah Chen",
    status: "need-attention",
    turningRate: 32,
    reason:
      "Inconsistent workout completion. Missed 2 out of last 4 scheduled sessions.",
    lastActivity: "2 hours ago",
    goal: "Muscle gain",
  },
  {
    id: 3,
    name: "Jordan Smith",
    status: "need-attention",
    turningRate: 58,
    reason:
      "Missed weekly check-in and has not logged any nutrition data this week.",
    lastActivity: "5 days ago",
    goal: "General wellness",
  },
  {
    id: 4,
    name: "Marcus Johnson",
    status: "need-attention",
    turningRate: 38,
    reason:
      "Weight fluctuations indicate possible diet inconsistency. Trending downward in adherence.",
    lastActivity: "1 day ago",
    goal: "Weight loss",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    status: "need-attention",
    turningRate: 52,
    reason:
      "Low activity tracking compliance. Only 20% of daily steps logged this week.",
    lastActivity: "4 days ago",
    goal: "Fitness improvement",
  },
];
