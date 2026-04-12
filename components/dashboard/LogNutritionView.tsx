"use client";

import { useState } from "react";
import { Apple, X, ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useCalculateNutritionMutation,
  usePostNutritionLogMutation,
  useGetNutritionShowQuery,
} from "@/redux/features/api/userDashboard/nutrition";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import { toast } from "sonner";
import { useEffect } from "react";

interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  caloriesPerUnit: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  macroBreakdown?: {
    mainIngredients: string[];
    proteinSources: string[];
    carbSources: string[];
    fatSources: string[];
  };
}
type MealType = "breakfast" | "lunch" | "dinner" | "snacks";

interface MealEntry {
  id: string;
  type: MealType;
  foods: FoodItem[];
  time: string;
}

interface FoodLogViewProps {
  onSave: () => void;
  onBack: () => void;
}

const MEAL_TYPES = [
  {
    label: "Breakfast",
    value: "breakfast",
    color: "bg-orange-100 border-orange-300",
  },
  { label: "Lunch", value: "lunch", color: "bg-blue-100 border-blue-300" },
  {
    label: "Dinner",
    value: "dinner",
    color: "bg-purple-100 border-purple-300",
  },
  { label: "Snacks", value: "snacks", color: "bg-green-100 border-green-300" },
];

export default function FoodLogView({ onSave, onBack }: FoodLogViewProps) {
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.id || currentUser?.user_id;

  const { data: existingNutrition, isLoading: isLoadingExisting } =
    useGetNutritionShowQuery(undefined);
  const [calculateNutrition, { isLoading: loadingAiCalories }] =
    useCalculateNutritionMutation();
  const [postNutritionLog, { isLoading: isSaving }] =
    usePostNutritionLogMutation();

  const [calorieTarget, setCalorieTarget] = useState(2000);
  const [customUnitInput, setCustomUnitInput] = useState("");
  const [meals, setMeals] = useState<MealEntry[]>([
    {
      id: "static-1",
      type: "breakfast",
      time: "08:00 AM",
      foods: [
        {
          id: "f-1",
          name: "Eggs",
          quantity: 2,
          unit: "piece",
          caloriesPerUnit: 78,
          calories: 156,
          protein: 12.6,
          carbs: 0.8,
          fat: 10.6,
        },
      ],
    },
  ]);

  useEffect(() => {
    if (existingNutrition?.nutrition) {
      const nutri = existingNutrition.nutrition;

      // Update calorie target if available in API (assuming a field exists or using fallback)
      if (nutri.daily_target) {
        setCalorieTarget(nutri.daily_target);
      }

      if (nutri.foods?.length > 0) {
        const apiFoods = nutri.foods.map((f: any, index: number) => ({
          id: `api-${index}`,
          name: f.food,
          quantity: f.quantity,
          unit: f.unit,
          // Since the API response gives a summary nutrition object, we use its values
          calories: Number(nutri.calories.value),
          protein: Number(nutri.macros.protein.value),
          carbs: Number(nutri.macros.carbs.value),
          fat: Number(nutri.macros.fat.value),
          // We divide by quantity to get per-unit if needed for edits, but usually it's a fixed log
          caloriesPerUnit: Number(nutri.calories.value) / f.quantity,
        }));

        setMeals([
          {
            id: "dynamic-1",
            type: "breakfast",
            time: "Today's Log",
            foods: apiFoods,
          },
        ]);
      }
    }
  }, [existingNutrition]);
  const [addingToMeal, setAddingToMeal] = useState<string | null>(null);
  const [foodNameInput, setFoodNameInput] = useState("");
  const [foodQuantityInput, setFoodQuantityInput] = useState("");
  const [foodUnitInput, setFoodUnitInput] = useState("g");
  const [aiCalorieResult, setAiCalorieResult] = useState<{
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    mainIngredients?: string[];
    proteinSources?: string[];
    carbSources?: string[];
    fatSources?: string[];
  } | null>(null);

  const getTotalMacros = () => {
    const total = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    meals.forEach((meal) => {
      meal.foods.forEach((food) => {
        total.calories += food.calories;
        total.protein += food.protein;
        total.carbs += food.carbs;
        total.fat += food.fat;
      });
    });
    return total;
  };

  const getProgressColor = () => {
    const total = getTotalMacros().calories;
    const percentage = (total / calorieTarget) * 100;

    if (percentage >= 95 && percentage <= 105) return "bg-green-500";
    if (percentage > 105 && percentage <= 150) return "bg-yellow-500";
    if (percentage < 95 && percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getProgressPercentage = () => {
    const total = getTotalMacros().calories;
    return Math.min((total / calorieTarget) * 100, 100);
  };

  // Macro targets based on calorie target
  const getMacroTargets = () => {
    return {
      protein: (calorieTarget * 0.3) / 4, // 30% of calories from protein (4 cal/g)
      carbs: (calorieTarget * 0.5) / 4, // 50% of calories from carbs (4 cal/g)
      fat: (calorieTarget * 0.2) / 9, // 20% of calories from fat (9 cal/g)
    };
  };

  // Get macro progress color: Red (<50%), Yellow (50-100%), Green (100%+)
  const getMacroProgressColor = (actual: number, target: number) => {
    const percentage = (actual / target) * 100;
    if (percentage < 50) return "#EF4444"; // Red
    if (percentage < 100) return "#EAB308"; // Yellow
    return "#22C55E"; // Green
  };

  const getMacroProgressPercentage = (actual: number, target: number) => {
    return Math.min((actual / target) * 100, 100);
  };

  // Fetch calorie info and macro breakdown from AI
  const fetchAiCalories = async () => {
    if (!foodNameInput.trim() || !foodQuantityInput) {
      toast.error("Please enter food name and quantity");
      return;
    }

    try {
      const response = await calculateNutrition({
        user_id: userId,
        foods: [
          {
            food: foodNameInput,
            quantity: parseFloat(foodQuantityInput),
            unit: foodUnitInput === "custom" ? customUnitInput : foodUnitInput,
          },
        ],
      }).unwrap();

      const nutri = response.nutrition;
      if (nutri) {
        setAiCalorieResult({
          calories: Number(nutri.calories.value),
          protein: Number(nutri.macros.protein.value),
          carbs: Number(nutri.macros.carbs.value),
          fat: Number(nutri.macros.fat.value),
          mainIngredients: nutri.foods?.[0]?.ingredients || [],
          proteinSources: nutri.foods?.[0]?.protein_sources || [],
          carbSources: nutri.foods?.[0]?.carb_sources || [],
          fatSources: nutri.foods?.[0]?.fat_sources || [],
        });
      }
    } catch (error) {
      console.error("Nutrition calculation error:", error);
      toast.error(
        "Unable to get calorie info. Please check food name and try again.",
      );
    }
  };

  const addFoodToMeal = (mealId: string) => {
    if (!aiCalorieResult) {
      alert("Please fetch calorie information first");
      return;
    }

    setMeals(
      meals.map((meal) =>
        meal.id === mealId
          ? {
              ...meal,
              foods: [
                ...meal.foods,
                {
                  id: Math.random().toString(),
                  name: foodNameInput,
                  quantity: parseFloat(foodQuantityInput),
                  // unit: foodUnitInput,
                  unit:
                    foodUnitInput === "custom"
                      ? customUnitInput
                      : foodUnitInput,
                  caloriesPerUnit:
                    aiCalorieResult.calories / parseFloat(foodQuantityInput),
                  calories: Math.round(aiCalorieResult.calories),
                  protein: aiCalorieResult.protein,
                  carbs: aiCalorieResult.carbs,
                  fat: aiCalorieResult.fat,
                  macroBreakdown: {
                    mainIngredients: aiCalorieResult.mainIngredients || [],
                    proteinSources: aiCalorieResult.proteinSources || [],
                    carbSources: aiCalorieResult.carbSources || [],
                    fatSources: aiCalorieResult.fatSources || [],
                  },
                },
              ],
            }
          : meal,
      ),
    );
    setAddingToMeal(null);
    setFoodNameInput("");
    setFoodQuantityInput("");
    setFoodUnitInput("g");
    setAiCalorieResult(null);
    setCustomUnitInput("");
  };

  const removeFoodFromMeal = (mealId: string, foodId: string) => {
    setMeals(
      meals.map((meal) =>
        meal.id === mealId
          ? { ...meal, foods: meal.foods.filter((f) => f.id !== foodId) }
          : meal,
      ),
    );
  };

  const addNewMeal = (type: MealType) => {
    const newMeal: MealEntry = {
      id: Math.random().toString(),
      type,
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      foods: [],
    };
    setMeals([...meals, newMeal]);
  };

  const totals = getTotalMacros();
  const caloriePercentage = getProgressPercentage();

  const handleSave = async () => {
    if (meals.every((meal) => meal.foods.length === 0)) {
      toast.error("Please add at least one food item before saving.");
      return;
    }

    try {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const payload = {
        log_date: today,
        user_id: userId,
        meals: meals.map((meal) => ({
          type: meal.type,
          foods: meal.foods.map((f) => ({
            food: f.name,
            quantity: f.quantity,
            unit: f.unit,
            calories: f.calories,
            protein: f.protein,
            carbs: f.carbs,
            fat: f.fat,
          })),
        })),
      };

      const response = await postNutritionLog(payload).unwrap();
      if (response.success || response.status === "success") {
        toast.success("Nutrition data logged successfully!");
        onSave();
      } else {
        toast.error(response.message || "Failed to log nutrition data.");
      }
    } catch (err: any) {
      console.error("Nutrition log submission error:", err);

      const errorData = err.data || {};
      const errorMessage = (errorData.message || "").toLowerCase();
      const exception = (errorData.exception || "").toLowerCase();

      if (
        err.status === 409 ||
        err.status === 500 ||
        exception.includes("uniqueconstraintviolationexception") ||
        errorMessage.includes("duplicate entry") ||
        errorMessage.includes("already logged")
      ) {
        toast.error("You have already logged nutrition for today.");
      } else {
        toast.error(
          errorData.message ||
            "An error occurred while saving. Please try again.",
        );
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Back Button */}
      <div className="self-start">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#3A86FF]/30 text-[#5F6F73] hover:text-[#1F2D2E] hover:bg-blue-50/50 rounded-lg text-xs font-semibold transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back To Habit
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#E6F6F6] border border-[#0FA4A9]/20 flex items-center justify-center shrink-0">
              <Apple size={22} className="text-[#0FA4A9]" />
            </div>
            <div>
              <h2 className="text-[22px] font-bold text-[#3A86FF]">Food Log</h2>
              <p className="text-sm text-gray-500">
                Log your meals and track macros
              </p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="p-1 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Calorie Target Section */}
        <div className="flex flex-col gap-4 p-6 rounded-2xl border border-[#3A86FF]/25 bg-linear-to-br from-blue-50 to-white">
          <div className="flex items-center justify-between">
            <label className="text-[#1F2D2E] font-semibold text-[16px]">
              Daily Calorie Target
            </label>
            <input
              type="number"
              value={calorieTarget}
              onChange={(e) =>
                setCalorieTarget(parseInt(e.target.value) || 2000)
              }
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-right font-semibold focus:outline-none focus:border-[#3A86FF]"
            />
          </div>

          {/* Progress Bar */}
          <div className="flex flex-col gap-3">
            <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300 flex items-center justify-center text-white font-bold text-sm",
                  getProgressColor(),
                )}
                style={{ width: `${caloriePercentage}%` }}
              >
                {caloriePercentage > 10 && `${Math.round(caloriePercentage)}%`}
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                <span className="font-bold text-[#1F2D2E]">
                  {Math.round(totals.calories)}
                </span>{" "}
                / {calorieTarget} kcal
              </span>
              <span>
                {caloriePercentage > 100
                  ? `+${Math.round(caloriePercentage - 100)}%`
                  : `${Math.round(100 - caloriePercentage)}% remaining`}
              </span>
            </div>
          </div>

          {/* Macro Progress Bars */}
          <div className="mt-6 pt-4 border-t border-gray-200 space-y-4">
            <p className="text-sm font-semibold text-[#1F2D2E]">
              Macro Progress
            </p>
            <div className="grid grid-cols-3 gap-4">
              {/* Protein Progress */}
              {/* <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-700">
                    Protein
                  </label>
                  <span className="text-xs font-bold text-[#1F2D2E]">
                    {totals.protein.toFixed(0)}g /{" "}
                    {getMacroTargets().protein.toFixed(0)}g
                  </span>
                </div>
                <div className="h-2 bg-[#32A26E] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${getMacroProgressPercentage(totals.protein, getMacroTargets().protein)}%`,
                      backgroundColor: getMacroProgressColor(
                        totals.protein,
                        getMacroTargets().protein,
                      ),
                    }}
                  />
                </div>
              </div> */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-700">
                    Protein
                  </label>
                  <span className="text-xs font-bold text-[#1F2D2E]">
                    {totals.protein.toFixed(0)}g /{" "}
                    {getMacroTargets().protein.toFixed(0)}g
                  </span>
                </div>

                {/* ✅ Track (gray like calorie bar) */}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  {/* ✅ Filled portion */}
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${getMacroProgressPercentage(
                        totals.protein,
                        getMacroTargets().protein,
                      )}%`,
                      backgroundColor: getMacroProgressColor(
                        totals.protein,
                        getMacroTargets().protein,
                      ),
                    }}
                  />
                </div>
              </div>

              {/* Carbs Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-700">
                    Carbs
                  </label>
                  <span className="text-xs font-bold text-[#1F2D2E]">
                    {totals.carbs.toFixed(0)}g /{" "}
                    {getMacroTargets().carbs.toFixed(0)}g
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${getMacroProgressPercentage(
                        totals.carbs,
                        getMacroTargets().carbs,
                      )}%`,
                      backgroundColor: getMacroProgressColor(
                        totals.carbs,
                        getMacroTargets().carbs,
                      ),
                    }}
                  />
                </div>
              </div>

              {/* Fat Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-700">
                    Fat
                  </label>
                  <span className="text-xs font-bold text-[#1F2D2E]">
                    {totals.fat.toFixed(0)}g /{" "}
                    {getMacroTargets().fat.toFixed(0)}g
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${getMacroProgressPercentage(
                        totals.fat,
                        getMacroTargets().fat,
                      )}%`,
                      backgroundColor: getMacroProgressColor(
                        totals.fat,
                        getMacroTargets().fat,
                      ),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Macro Summary */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Protein</p>
              <p className="text-lg font-bold text-[#1F2D2E]">
                {totals.protein.toFixed(1)}g
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Carbs</p>
              <p className="text-lg font-bold text-[#1F2D2E]">
                {totals.carbs.toFixed(1)}g
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Fat</p>
              <p className="text-lg font-bold text-[#1F2D2E]">
                {totals.fat.toFixed(1)}g
              </p>
            </div>
          </div>
        </div>

        {/* Meals Section */}
        <div className="flex flex-col gap-6">
          <h3 className="text-[18px] font-bold text-[#1F2D2E]">Meals</h3>

          {meals.map((meal) => (
            <div
              key={meal.id}
              className={cn(
                "p-6 rounded-2xl border-2",
                MEAL_TYPES.find((m) => m.value === meal.type)?.color || "",
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-[16px] font-bold text-[#1F2D2E] capitalize">
                    {meal.type}
                  </h4>
                  <p className="text-xs text-gray-600">{meal.time}</p>
                </div>
                <button
                  onClick={() => setAddingToMeal(meal.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all"
                >
                  <Plus size={16} />
                  Add Food
                </button>
              </div>

              {/* Food Items */}
              {meal.foods.length > 0 ? (
                <div className="space-y-3 mb-4">
                  {meal.foods.map((food) => (
                    <div
                      key={food.id}
                      className="p-3 bg-white rounded-lg border border-gray-100 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#1F2D2E]">
                            {food.name} - {food.quantity} {food.unit}
                          </p>
                          <p className="text-xs text-gray-600">
                            {food.caloriesPerUnit.toFixed(2)} cal/{food.unit} ×{" "}
                            {food.quantity} = {food.calories} cal
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            P: {food.protein.toFixed(1)}g | C:{" "}
                            {food.carbs.toFixed(1)}g | F: {food.fat.toFixed(1)}g
                          </p>
                        </div>
                        <button
                          onClick={() => removeFoodFromMeal(meal.id, food.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Macro Breakdown */}
                      {food.macroBreakdown && (
                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2 bg-gray-50 p-2 rounded text-xs">
                          {food.macroBreakdown.mainIngredients &&
                            food.macroBreakdown.mainIngredients.length > 0 && (
                              <div>
                                <p className="font-semibold text-gray-700">
                                  Contains:
                                </p>
                                <p className="text-gray-600">
                                  {food.macroBreakdown.mainIngredients.join(
                                    ", ",
                                  )}
                                </p>
                              </div>
                            )}
                          {food.macroBreakdown.proteinSources &&
                            food.macroBreakdown.proteinSources.length > 0 && (
                              <div>
                                <p className="font-semibold text-gray-700">
                                  Protein from:
                                </p>
                                <p className="text-gray-600">
                                  {food.macroBreakdown.proteinSources.join(
                                    ", ",
                                  )}
                                </p>
                              </div>
                            )}
                          {food.macroBreakdown.carbSources &&
                            food.macroBreakdown.carbSources.length > 0 && (
                              <div>
                                <p className="font-semibold text-gray-700">
                                  Carbs from:
                                </p>
                                <p className="text-gray-600">
                                  {food.macroBreakdown.carbSources.join(", ")}
                                </p>
                              </div>
                            )}
                          {food.macroBreakdown.fatSources &&
                            food.macroBreakdown.fatSources.length > 0 && (
                              <div>
                                <p className="font-semibold text-gray-700">
                                  Fat from:
                                </p>
                                <p className="text-gray-600">
                                  {food.macroBreakdown.fatSources.join(", ")}
                                </p>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic mb-4">
                  No foods added yet
                </p>
              )}

              {/* Add Food Form */}
              {addingToMeal === meal.id && (
                <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 space-y-3">
                  <p className="text-sm font-semibold text-[#1F2D2E]">
                    Add Food Item
                  </p>

                  {/* Food Name Input */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Food Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chicken Breast, Brown Rice, Apple"
                      value={foodNameInput}
                      onChange={(e) => setFoodNameInput(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#3A86FF]"
                    />
                  </div>

                  {/* Quantity and Unit Input */}
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 150"
                        value={foodQuantityInput}
                        onChange={(e) => setFoodQuantityInput(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#3A86FF]"
                      />
                    </div>

                    <div className="col-span-2 space-y-2">
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Unit
                      </label>

                      <select
                        value={foodUnitInput}
                        onChange={(e) => {
                          setFoodUnitInput(e.target.value);
                          if (e.target.value !== "custom") {
                            setCustomUnitInput("");
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#3A86FF]"
                      >
                        <option value="g">grams</option>
                        <option value="ml">ml</option>
                        <option value="piece">piece</option>
                        <option value="cup">cup</option>
                        <option value="tbsp">tbsp</option>
                        <option value="custom">
                          Custom (input unit manually)
                        </option>
                      </select>

                      {foodUnitInput === "custom" && (
                        <input
                          type="text"
                          placeholder="e.g. slice, bowl, handful"
                          value={customUnitInput}
                          onChange={(e) => setCustomUnitInput(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#3A86FF]"
                        />
                      )}
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={fetchAiCalories}
                        disabled={loadingAiCalories}
                        className="w-full px-3 py-2 bg-[#3A86FF] text-white rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50"
                      >
                        {loadingAiCalories ? "Loading..." : "Get Calories"}
                      </button>
                    </div>
                  </div>

                  {/* AI Result Display */}
                  {aiCalorieResult && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
                      <p className="text-sm font-semibold text-green-900">
                        ✓ Nutritional Info Retrieved from AI
                      </p>

                      {/* Main Ingredients */}
                      {aiCalorieResult.mainIngredients &&
                        aiCalorieResult.mainIngredients.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-700 mb-1">
                              Main Ingredients:
                            </p>
                            <p className="text-xs text-gray-600">
                              {aiCalorieResult.mainIngredients.join(", ")}
                            </p>
                          </div>
                        )}

                      {/* Macro Summary */}
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div>
                          <p className="text-gray-600">Calories</p>
                          <p className="font-bold text-green-700">
                            {aiCalorieResult.calories}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Protein</p>
                          <p className="font-bold text-green-700">
                            {aiCalorieResult.protein.toFixed(1)}g
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Carbs</p>
                          <p className="font-bold text-green-700">
                            {aiCalorieResult.carbs.toFixed(1)}g
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Fat</p>
                          <p className="font-bold text-green-700">
                            {aiCalorieResult.fat.toFixed(1)}g
                          </p>
                        </div>
                      </div>

                      {/* Macro Sources */}
                      <div className="space-y-2 pt-2 border-t border-green-200">
                        {aiCalorieResult.proteinSources &&
                          aiCalorieResult.proteinSources.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-700">
                                Protein from:
                              </p>
                              <p className="text-xs text-gray-600">
                                {aiCalorieResult.proteinSources.join(", ")}
                              </p>
                            </div>
                          )}
                        {aiCalorieResult.carbSources &&
                          aiCalorieResult.carbSources.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-700">
                                Carbs from:
                              </p>
                              <p className="text-xs text-gray-600">
                                {aiCalorieResult.carbSources.join(", ")}
                              </p>
                            </div>
                          )}
                        {aiCalorieResult.fatSources &&
                          aiCalorieResult.fatSources.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-700">
                                Fat from:
                              </p>
                              <p className="text-xs text-gray-600">
                                {aiCalorieResult.fatSources.join(", ")}
                              </p>
                            </div>
                          )}
                      </div>

                      <button
                        onClick={() => addFoodToMeal(meal.id)}
                        className="w-full px-3 py-2 bg-[#0FA4A9] text-white rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all"
                      >
                        Confirm & Add
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Add New Meal */}
          <div className="flex gap-3 flex-wrap">
            {MEAL_TYPES.map((mealType) => (
              <button
                key={mealType.value}
                onClick={() => addNewMeal(mealType.value as MealType)}
                className={cn(
                  "px-4 py-2 rounded-lg font-semibold text-sm border-2 transition-all",
                  meals.some((m) => m.type === mealType.value)
                    ? "opacity-50 cursor-default"
                    : "border-gray-300 hover:border-gray-400",
                )}
                disabled={meals.some((m) => m.type === mealType.value)}
              >
                <Plus size={16} className="inline mr-2" />
                Add {mealType.label}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-[#0FA4A9] text-white py-4 rounded-xl font-bold text-[18px] hover:bg-opacity-90 transition-all cursor-pointer shadow-lg shadow-[#0FA4A9]/20 flex items-center justify-center gap-2"
        >
          {isSaving && <Loader2 className="animate-spin" size={20} />}
          {isSaving ? "Saving..." : "Save Food Log"}
        </button>
      </div>
    </div>
  );
}
