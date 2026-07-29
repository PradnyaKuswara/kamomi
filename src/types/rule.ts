export interface Rule {
  id: number;
  propertyId: number;
  title: string;
  description: string;
  category: string; // 'Wajib' | 'Larangan' | 'Ketentuan'
  sequence: number;
  isActive: boolean;
  createdAt: string;
}

export interface RuleRequest {
  title: string;
  description: string;
  category: string;
  sequence: number;
  isActive: boolean;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

