export interface PlanPermissions {
  maxRooms: number;
  maxStaff: number;
  maxUploadPhotoSizeMb: number;
  canExportData: boolean;
  canDownloadBatchQR: boolean;
  canCustomizeQRTemplate: boolean;
  canWhatsAppNotify: boolean;
  canCustomLogoBranding: boolean;
  canAnalyticsDashboard: boolean;
}

export function getPlanPermissions(planName?: string): PlanPermissions {
  const name = (planName || 'Free').toLowerCase();

  if (name.includes('enterprise') || name.includes('ultimate')) {
    return {
      maxRooms: -1, // Unlimited
      maxStaff: -1, // Unlimited
      maxUploadPhotoSizeMb: 10,
      canExportData: true,
      canDownloadBatchQR: true,
      canCustomizeQRTemplate: true,
      canWhatsAppNotify: true,
      canCustomLogoBranding: true,
      canAnalyticsDashboard: true,
    };
  }

  if (name.includes('business') || name.includes('pro')) {
    return {
      maxRooms: 30,
      maxStaff: 5,
      maxUploadPhotoSizeMb: 5,
      canExportData: true,
      canDownloadBatchQR: true,
      canCustomizeQRTemplate: true,
      canWhatsAppNotify: true,
      canCustomLogoBranding: false,
      canAnalyticsDashboard: false,
    };
  }

  if (name.includes('starter')) {
    return {
      maxRooms: 15,
      maxStaff: 2,
      maxUploadPhotoSizeMb: 2,
      canExportData: true,
      canDownloadBatchQR: true,
      canCustomizeQRTemplate: true,
      canWhatsAppNotify: false,
      canCustomLogoBranding: false,
      canAnalyticsDashboard: false,
    };
  }

  // Default: FREE Plan
  return {
    maxRooms: 5,
    maxStaff: 0, // Cuma 1 owner
    maxUploadPhotoSizeMb: 0,
    canExportData: false,
    canDownloadBatchQR: false,
    canCustomizeQRTemplate: false,
    canWhatsAppNotify: false,
    canCustomLogoBranding: false,
    canAnalyticsDashboard: false,
  };
}
