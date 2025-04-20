// authStore.ts
import { create } from 'zustand';
import axios from '../utils/axios';
import { User } from '../types';

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  loadUser: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  loadUser: async () => {
    try {
      const res = await axios.get('/me'); // This should return user from session cookie
      set({ user: res.data.user });
    } catch (err) {
      console.log(err);
      set({ user: null });
    }
  },

  logout: () => {
    set({ user: null });
  },
}));
