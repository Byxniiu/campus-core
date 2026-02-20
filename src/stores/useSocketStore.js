import { create } from 'zustand';
import { io } from 'socket.io-client';

/**
 * Zustand store that manages a single Socket.IO connection.
 * Wraps connect / disconnect / emit / on / off in a tidy API.
 */
export const useSocketStore = create((set, get) => ({
  socket: null,
  isConnected: false,

  /** Connect (or re-connect) with the given JWT token */
  connect: (token) => {
    // Reuse existing connected socket
    const existing = get().socket;
    if (existing && existing.connected) return existing;

    // Disconnect stale socket if any
    if (existing) existing.disconnect();

    const serverUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(
      '/api',
      ''
    );

    const socket = io(serverUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      console.log('[socket] connected:', socket.id);
      set({ isConnected: true });
    });

    socket.on('disconnect', (reason) => {
      console.log('[socket] disconnected:', reason);
      set({ isConnected: false });
    });

    socket.on('connect_error', (err) => {
      console.error('[socket] connect error:', err.message);
      set({ isConnected: false });
    });

    set({ socket });
    return socket;
  },

  /** Cleanly disconnect and reset */
  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  /** Emit an event (no-op if not connected) */
  emit: (event, data) => {
    const { socket, isConnected } = get();
    if (socket && isConnected) socket.emit(event, data);
  },

  /** Register a listener */
  on: (event, cb) => {
    const { socket } = get();
    if (socket) socket.on(event, cb);
  },

  /** Remove a listener */
  off: (event, cb) => {
    const { socket } = get();
    if (socket) socket.off(event, cb);
  },
}));
