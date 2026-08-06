import type { Rule } from './rule';
import type { QrDesign } from './qr';
import type { Contact } from './contact';
import type { FacilityGuide } from './facility-guide';

export interface PublicRoomData {
  roomNumber: string;
  wifiSsid: string;
  wifiPassword?: string;
  propertyName: string;
  qrDesign?: QrDesign;
  rules?: Rule[];
  contacts?: Contact[];
  facilityGuides?: FacilityGuide[];
  isSuspended: boolean;
}
