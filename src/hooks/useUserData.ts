import { useSyncExternalStore } from 'react';
import type { UserData, UserSubscription } from '../types/user';
import type { SubscriptionPlan } from '../types/subscription-plan';

export type { UserData, UserSubscription, SubscriptionPlan };

const initialStore: UserData = {
  id: undefined,
  name: '',
  email: '',
  avatarUrl: '',
  roleName: '',
  isEmailVerified: false,
  isActive: false,
  subscription: undefined,
  isLoggedIn: false
};

let store: UserData = { ...initialStore };

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
    store = { ...initialStore };
    listeners.forEach((l) => l());
  }
};

const getServerSnapshot = () => initialStore;

export function useUserData() {
  const user = useSyncExternalStore(
    userStore.subscribe,
    userStore.getSnapshot,
    getServerSnapshot
  );

  const subscription = user.subscription;
  const plan = subscription?.plan || null;
  const planName = plan?.name || 'Free';
  const maxRooms = plan?.maxRooms ?? 3;
  const isUnlimited = maxRooms === -1;

  return {
    user,
    subscriptionInfo: {
      plan,
      planName,
      maxRooms,
      isUnlimited,
      isFreePlan: planName === 'Free',
      isStarterPlan: planName === 'Starter',
      isProPlan: planName === 'Pro',
      startDate: subscription?.startDate || null,
      endDate: subscription?.endDate || null,
      isActive: subscription?.status === 'ACTIVE' || subscription?.status === 'active' || !subscription,
    },
    setUserData: userStore.setUserData,
    clearUserData: userStore.clearUserData
  };
}
