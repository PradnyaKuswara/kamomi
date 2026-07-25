import { useSyncExternalStore } from 'react';

export interface UserData {
  name: string;
  email: string;
  avatarUrl?: string;
  roleName?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  isLoggedIn: boolean;
}

let store: UserData = {
  name: '',
  email: '',
  avatarUrl: '',
  roleName: '',
  isEmailVerified: false,
  isActive: false,
  isLoggedIn: false
};

const listeners = new Set<() => void>();

export const userStore = {
  getSnapshot() {
    return store;
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  setUserData(data: Partial<UserData>) {
    store = { ...store, ...data };
    listeners.forEach((l) => l());
  },
  clearUserData() {
    store = { name: '', email: '', avatarUrl: '', roleName: '', isEmailVerified: false, isActive: false, isLoggedIn: false };
    listeners.forEach((l) => l());
  }
};

export function useUserData() {
  const user = useSyncExternalStore(
    userStore.subscribe,
    userStore.getSnapshot,
    () => ({ name: '', email: '', avatarUrl: '', roleName: '', isEmailVerified: false, isActive: false, isLoggedIn: false })
  );
  return {
    user,
    setUserData: userStore.setUserData,
    clearUserData: userStore.clearUserData
  };
}
