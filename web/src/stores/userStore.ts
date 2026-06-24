import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/api/client';

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  constitutionResult: { primaryType: string; secondaryType: string | null } | null;
  baziResult: any | null;
  setUser: (user: User | null) => void;
  setConstitution: (result: { primaryType: string; secondaryType: string | null } | null) => void;
  setBazi: (result: any | null) => void;
  logout: () => void;
  initialize: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      constitutionResult: null,
      baziResult: null,
      setUser: (user) => set({ user, isLoggedIn: user !== null }),
      setConstitution: (constitutionResult) => set({ constitutionResult }),
      setBazi: (baziResult) => set({ baziResult }),
      logout: () => {
        localStorage.removeItem('user');
        set({ user: null, isLoggedIn: false, constitutionResult: null, baziResult: null });
      },
      initialize: () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            set({ user, isLoggedIn: true });
          } catch {
            localStorage.removeItem('user');
          }
        }
      },
    }),
    { name: 'nah-user' }
  )
);
