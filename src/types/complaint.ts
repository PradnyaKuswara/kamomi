export type ComplaintStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export interface Complaint {
  id: number;
  roomId: number;
  roomNumber: string;
  propertyName: string;
  category: string;
  description: string;
  guestName?: string;
  guestContact?: string;
  ipAddress?: string;
  status: ComplaintStatus;
  responseNote?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateComplaintStatusRequest {
  status: ComplaintStatus;
  responseNote?: string;
}

export interface CreatePublicComplaintRequest {
  roomCode: string;
  category: string;
  description: string;
  guestName?: string;
  guestContact?: string;
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
