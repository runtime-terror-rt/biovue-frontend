export type Macro = {
  protein: number;
  carbs: number;
  fat: number;
};

export type FoodItem = {
  id: string;
  name: string;
  servingSize: string;
  calories: number;
  macros: Macro;
};

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type MealLog = {
  id: string;
  mealType: MealType;
  foods: FoodItem[];
};
