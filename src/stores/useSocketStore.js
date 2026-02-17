import { create } from 'zustand';
import { io } from 'socket.io-client';

export const useSocketStore = create((set, get) => ({
  // State
  socket: null,
  isConnected: false,

  // Actions
  connect: (token) => {
    // Disconnect existing socket if any
    const existingSocket = get().socket;
    if (existingSocket) {
      existingSocket.disconnect();
    }

    // Create new socket connection
    const socket = io(
      import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000',
      {
        auth: { token },
        transports: ['websocket', 'polling'],
      }
    );

    // Connection event handlers
    socket.on('connect', () => {
      console.log(' Socket connected:', socket.id);
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      console.log(' Socket disconnected');
      set({ isConnected: false });
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      set({ isConnected: false });
    });

    set({ socket });
    return socket;
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  // Emit event
  emit: (event, data) => {
    const socket = get().socket;
    if (socket && get().isConnected) {
      socket.emit(event, data);
    }
  },

  // Listen to event
  on: (event, callback) => {
    const socket = get().socket;
    if (socket) {
      socket.on(event, callback);
    }
  },

  // Remove event listener
  off: (event, callback) => {
    const socket = get().socket;
    if (socket) {
      socket.off(event, callback);
    }
  },
}));
