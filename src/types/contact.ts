export interface Contact {
  id: number;
  propertyId: number;
  name: string;
  role: string;
  contactType: string; // 'WHATSAPP' | 'EMAIL' | 'PHONE'
  contactValue: string;
  actionText: string;
  color: string;
  icon: string;
  link: string;
  createdAt: string;
}

export interface ContactRequest {
  name: string;
  role: string;
  contactType: string;
  contactValue: string;
  actionText?: string;
  color?: string;
  icon?: string;
  link?: string;
}
