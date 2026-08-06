import type { Rule } from './rule';

export interface Room {
  id: number;
  propertyId: number;
  roomNumber: string;
  wifiSsid: string;
  wifiPassword?: string;
  code?: string;
  rules?: Rule[];
  createdAt: string;
}

export interface RoomRequest {
  roomNumber: string;
  wifiSsid: string;
  wifiPassword?: string;
  ruleIds?: number[];
}
