/**
 * Utility function to check if a user is invited and has accepted the invitation
 * This is used to determine if a user should bypass payment and go directly to dashboard
 */

export interface User {
  id?: number;
  is_invited?: boolean | string | number;
  invitation_status?: string;
  plan_id?: number | null;
  [key: string]: any;
}

/**
 * Check if a user is invited AND has accepted the invitation
 *
 * Logic:
 * - is_invited must be true (handles boolean, string "true", or number 1)
 * - invitation_status must be "accepted" (case-insensitive)
 *
 * @param user - The user object from the login response
 * @returns true if user is invited AND status is accepted, false otherwise
 */
export const isInvitedAndAccepted = (user: User | null): boolean => {
  if (!user) return false;

  const invited = user.is_invited;
  const status = (user.invitation_status || "").toString().toLowerCase();

  // Handle different data types for is_invited (boolean, string, number)
  const invitedBool =
    invited === true || invited === "true" || invited === 1 || invited === "1";

  // Both conditions must be true
  return invitedBool && status === "accepted";
};

/**
 * Determine if user should bypass payment
 *
 * User bypasses payment if:
 * - They are invited AND accepted
 *
 * User shows payment if:
 * - They are NOT invited, OR
 * - They are invited but status is pending/rejected/other
 *
 * @param user - The user object from the login response
 * @returns true if user should bypass payment, false if they should go through payment flow
 */
/**
 * Check if user is a business professional
 *
 * Professionals (trainers, coaches, nutritionists, suppliers) ALWAYS see payment step
 * Only end users can bypass payment if invited+accepted
 *
 * @param user - The user object from the login response
 * @returns true if user is a professional, false otherwise
 */
export const isProfessional = (user: User | null): boolean => {
  if (!user) return false;

  const userType = (user.user_type || "").toString().toLowerCase();
  const professionType = (user.profession_type || "").toString().toLowerCase();

  // Check if user_type is "professional"
  if (userType === "professional") {
    return true;
  }

  // Also check specific profession types (trainer, coach, nutritionist, supplier)
  const professionalTypes = [
    "trainer_coach",
    "trainer",
    "coach",
    "nutritionist",
    "supplement_supplier",
    "supplier",
  ];

  return professionalTypes.includes(professionType);
};

/**
 * Determine if user should bypass payment and plan selection
 *
 * User bypasses payment if:
 * - They are invited AND accepted, AND
 * - They are NOT a business professional
 *
 * Professionals ALWAYS see payment and plan selection
 *
 * @param user - The user object from the login response
 * @returns true if user should bypass payment, false if they should go through payment flow
 */
export const shouldBypassPayment = (user: User | null): boolean => {
  // Professionals always go through payment
  if (isProfessional(user)) {
    return false;
  }

  // Only non-professionals who are invited+accepted bypass payment
  return isInvitedAndAccepted(user);
};
