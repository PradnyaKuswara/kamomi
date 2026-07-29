export interface Property {
  id: number;
  propertyType: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  isActive: boolean;
  createdAt?: string;
}
