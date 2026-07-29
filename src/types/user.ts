import type { SubscriptionPlanUser } from "./subscription-plan";
import type { Property } from "./property";

export interface UserSubscription {
  id: number;
  status: string;
  startDate: string;
  endDate: string;
  plan: SubscriptionPlanUser;
}

export interface UserData {
  id?: number;
  name: string;
  email: string;
  avatarUrl?: string;
  roleName?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  subscription?: UserSubscription;
  properties?: Property[];
  isLoggedIn: boolean;
}
