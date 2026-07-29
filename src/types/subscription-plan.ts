export interface SubscriptionPlan {
  id?: number;
  name: string;
  price: number;
  description?: string;
  maxRooms: number;
  billingCycle: string;
  features: string;
  isActive?: boolean;
}


export interface SubscriptionPlanUser {
  name: string;
  price: {
    source: string;
    parsedValue: number;
  };
  description: string;
  maxRooms: number;
  billingCycle: string;
  features: string;
}