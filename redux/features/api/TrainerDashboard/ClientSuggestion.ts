export interface UserProfile {
  user_id: string;
  goal: string;
  goal_description: string;
  key_health_concerns: string[];
}

export interface Suggestion {
  user_profile: UserProfile;
  match_reason: string;
  priority: number;
  churning_possibility: number;
  status: string;
  reason_for_attention: string | null;
  recommended_actions: string[];
}

export interface ClientSuggestionResponse {
  trainer_id: string;
  suggestions: Suggestion[];
}

const BASE_URL = "https://ai.biovuedigitalwellness.com/api/v1";

export const getClientSuggestions = async (
  trainerId: string,
): Promise<Suggestion[]> => {
  try {
    const res = await fetch(
      `${BASE_URL}/recommend/users/trainer/${trainerId}/saved/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch suggestions: ${res.status}`);
    }

    const data: ClientSuggestionResponse = await res.json();

    return data?.suggestions || [];
  } catch (error) {
    console.error("Error fetching client suggestions:", error);
    return [];
  }
};
