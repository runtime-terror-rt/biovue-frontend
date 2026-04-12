"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import SuggestionCarousel from "@/components/NutritionistDashboard/SuggestionCarousel";
import { Loader2, Users } from "lucide-react";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";

export default function NutritionistClientsPage() {
  const user = useSelector(selectCurrentUser);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    console.log("Current user in Clients page:", user);
    if (!user?.id) {
      console.log("No user ID found, skipping fetch.");
      setIsLoading(false);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      setError(null);
      console.log(`Fetching suggestions for nutritionist ID: ${user.id}`);
      try {
        const response = await fetch(`https://ai.biovuedigitalwellness.com/api/v1/recommend/users/nutritionist/${user.id}`, {
          method: 'GET',
          headers: {
            'accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch suggestions: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log("AI Recommendations API Response:", result);
        
        // Ensure result is the object containing suggestions
        setData(result);
      } catch (err: any) {
        console.error("Failed to fetch suggestions:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [user?.id]);

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="text-[#0FA4A9]" size={28} />
          My Clients
        </h1>
        <p className="text-gray-500 text-sm italic">Manage your assigned clinical cases and track their progress</p>
      </div>

      {/* Suggestion Section */}
      <section className="bg-white/40 rounded-3xl p-8 border border-white/60 shadow-sm backdrop-blur-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-[#0FA4A9]" size={40} />
            <p className="text-gray-400 font-medium animate-pulse">Running AI Clinical Analysis...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
             <p className="text-red-500 font-medium">Unable to load AI suggestions at this time.</p>
          </div>
        ) : data?.suggestions && data.suggestions.length > 0 ? (
          <SuggestionCarousel suggestions={data.suggestions} />
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400">No priority suggestions available right now.</p>
          </div>
        )}
      </section>

    
    </div>
  );
}
