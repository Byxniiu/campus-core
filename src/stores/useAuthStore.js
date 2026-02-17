import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (userData) => set({ user: userData }),

      setTokens: (accessToken, refreshToken) =>
        set({
          token: accessToken,
          refreshToken: refreshToken,
        }),

      login: (userData, accessToken, refreshToken) => {
        console.log(' AuthStore.login() called with:', {
          user: userData,
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
        });

        set({
          user: userData,
          token: accessToken,
          refreshToken,
          isAuthenticated: true,
        });

        console.log(' AuthStore.login() state updated');
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
          user: { ...state.user, ...updates },
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      // Getters
      getUser: () => get().user,
      getToken: () => get().token,
      isAuth: () => get().isAuthenticated,
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
