import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFacultyAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (userData, accessToken, refreshToken) => {
        set({
          user: userData,
          token: accessToken,
          refreshToken: refreshToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      // Use a distinct key to avoid conflicting with student/admin stores
      name: 'faculty-auth-storage',
      // Default storage is localStorage — persists across refreshes and new tabs
    }
  )
);
