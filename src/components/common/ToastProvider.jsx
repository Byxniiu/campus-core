import { Toaster } from 'react-hot-toast';

// Configure toast defaults
const toastConfig = {
  position: 'top-right',
  duration: 4000,
  style: {
    background: '#fff',
    color: '#333',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  success: {
    iconTheme: {
      primary: '#10b981',
      secondary: '#fff',
    },
  },
  error: {
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fff',
    },
  },
};

export const ToastProvider = () => {
  return <Toaster {...toastConfig} />;
};

export default ToastProvider;
