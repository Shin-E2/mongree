export const SESSION_STORAGE_KEY = 'tempSignupFormData';

export interface SignupTempFormData {
  name?: string;
  nickname?: string;
  email?: string;
  address?: {
    zoneCode?: string;
    address?: string;
    detailAddress?: string;
  };
} 