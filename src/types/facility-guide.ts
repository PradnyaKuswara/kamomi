export interface FacilityGuide {
  id: number;
  propertyId?: number;
  name: string;
  icon: string;
  title: string;
  steps: string[];
  createdAt?: string;
}
