import { create } from "zustand";
import * as followRequestsApi from "../api/followRequests";

interface IFollowRequestsStore {
  hasIncoming: boolean;
  loadIncomingCount: () => Promise<void>;
  reset: () => void;
}

export const useFollowRequestsStore = create<IFollowRequestsStore>((set) => ({
  hasIncoming: false,

  loadIncomingCount: async () => {
    try {
      const count = await followRequestsApi.getIncomingCount();
      set({ hasIncoming: count > 0 });
    } catch {
      set({ hasIncoming: false });
    }
  },

  reset: () => set({ hasIncoming: false }),
}));

export const useFollowRequests = () => useFollowRequestsStore();
