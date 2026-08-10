export const NOTIFICATION_TYPES = {
  NEW_COMPLAINT: 'NEW_COMPLAINT',
  COMPLAINT_UPDATED: 'COMPLAINT_UPDATED',
  QR_ACTIVITY: 'QR_ACTIVITY',
  RULE_VIOLATION: 'RULE_VIOLATION',
  SUBSCRIPTION: 'SUBSCRIPTION',
  SYSTEM: 'SYSTEM',
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

export interface Notification {
  id: number;
  userId: number;
  propertyId?: number;
  propertyName?: string;
  title: string;
  message: string;
  type: NotificationType | string;
  referenceId?: number;
  isRead: boolean;
  createdAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
