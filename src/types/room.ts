import type { Rule } from './rule';
import type { QrDesign } from './qr';

export interface Room {
  id: number;
  propertyId: number;
  roomNumber: string;
  wifiSsid: string;
  wifiPassword?: string;
  code?: string;
  rules?: Rule[];
  createdAt: string;
  isActive?: boolean;
  qrDesign?: QrDesign;
}

export interface RoomRequest {
  roomNumber: string;
  wifiSsid: string;
  wifiPassword?: string;
  ruleIds?: number[];
  isActive?: boolean;
  qrDesign?: QrDesign;
}

export interface RoomLog {
  id: number;
  roomId: number;
  roomNumber: string;
  action: string;
  oldData?: string;
  newData?: string;
  createdAt: string;
  createdByEmail?: string;
  createdByName?: string;
}
