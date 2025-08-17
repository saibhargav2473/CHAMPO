import React, { useState} from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = React.createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (message, duration) => addToast(message, 'success', duration);
  const error = (message, duration) => addToast(message, 'error', duration);
  const warning = (message, duration) => addToast(message, 'warning', duration);
  const info = (message, duration) => addToast(message, 'info', duration);

  return (
    <ToastContext.Provider value={{ addToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastContainer({ toasts, removeToast }) {
  const getToastStyles = (type) => {
    const baseStyles = 'flex items-center gap-3 p-4 rounded-lg shadow-lg border-l-4 animate-slide-in';
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-success-50 border-success-500 text-success-800`;
      case 'error':
        return `${baseStyles} bg-danger-50 border-danger-500 text-danger-800`;
      case 'warning':
        return `${baseStyles} bg-secondary-50 border-secondary-500 text-secondary-800`;
      case 'info':
        return `${baseStyles} bg-primary-50 border-primary-500 text-primary-800`;
      default:
        return `${baseStyles} bg-neutral-50 border-neutral-500 text-neutral-800`;
    }
  };

  const getIcon = (type) => {
    const iconClasses = 'w-5 h-5 flex-shrink-0';
    
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClasses} text-success-600`} />;
      case 'error':
        return <AlertCircle className={`${iconClasses} text-danger-600`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClasses} text-secondary-600`} />;
      case 'info':
        return <Info className={`${iconClasses} text-primary-600`} />;
      default:
        return <Info className={`${iconClasses} text-neutral-600`} />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={getToastStyles(toast.type)}
          style={{ minWidth: '300px', maxWidth: '400px' }}
        >
          {getIcon(toast.type)}
          <div className="flex-1">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-black/10 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// Convenience functions for quick toast usage
export const toast = {
  success: (message, duration) => {
    // This will be overridden by the provider
    console.log('Toast not available:', message);
  },
  error: (message, duration) => {
    console.log('Toast not available:', message);
  },
  warning: (message, duration) => {
    console.log('Toast not available:', message);
  },
  info: (message, duration) => {
    console.log('Toast not available:', message);
  }
};
