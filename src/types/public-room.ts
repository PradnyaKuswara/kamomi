import type { Rule } from './rule';

export interface PublicRoomData {
  roomNumber: string;
  wifiSsid: string;
  wifiPassword?: string;
  propertyName: string;
  customTitle: string;
  customInstruction: string;
  showLogo: boolean;
  rules?: Rule[];
  isSuspended: boolean;
}
