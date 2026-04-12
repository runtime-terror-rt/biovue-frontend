"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProgressGoal = {
  goal: string;
  progress: number;
  target: number;
  unit: string;
};

export default function ProgressGoals({
  progressGoals,
}: {
  progressGoals: ProgressGoal[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {progressGoals.map((goal, index) => {
            const percentage = (goal.progress / goal.target) * 100;
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-medium text-[#1F2937]">{goal.goal}</h4>
                  <span className="text-sm font-semibold text-[#0D9488]">
                    {goal.progress}/{goal.target} {goal.unit}
                  </span>
                </div>
                <div className="w-full bg-[#E5E7EB] rounded-full h-3">
                  <div
                    className="bg-[#0D9488] h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-[#6B7280]">
                  {Math.round(percentage)}% completed
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
