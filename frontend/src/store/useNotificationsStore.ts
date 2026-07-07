import { create } from "zustand";
import * as notificationsApi from "../api/notifications";

interface INotificationsStore {
  unreadCount: number;
  loadUnreadCount: () => Promise<void>;
  reset: () => void;
}

export const useNotificationsStore = create<INotificationsStore>((set) => ({
  unreadCount: 0,

  loadUnreadCount: async () => {
    try {
      const count = await notificationsApi.getUnreadCount();
      set({ unreadCount: count });
    } catch {
      set({ unreadCount: 0 });
    }
  },

  reset: () => set({ unreadCount: 0 }),
}));

export const useNotifications = () => useNotificationsStore();
