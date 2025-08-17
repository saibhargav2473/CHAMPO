import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const PopupContext = React.createContext();

export function PopupProvider({ children }) {
  const [popups, setPopups] = React.useState([]);

  const showPopup = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const newPopup = { id, message, type, duration };
    setPopups(prev => [...prev, newPopup]);

    if (duration > 0) {
      setTimeout(() => {
        hidePopup(id);
      }, duration);
    }
  };

  const hidePopup = (id) => {
    setPopups(prev => prev.filter(popup => popup.id !== id));
  };

  const success = (message, duration) => showPopup(message, 'success', duration);
  const error = (message, duration) => showPopup(message, 'error', duration);
  const warning = (message, duration) => showPopup(message, 'warning', duration);
  const info = (message, duration) => showPopup(message, 'info', duration);

  return (
    <PopupContext.Provider value={{ showPopup, success, error, warning, info, hidePopup }}>
      {children}
      <PopupContainer popups={popups} hidePopup={hidePopup} />
    </PopupContext.Provider>
  );
}

export function usePopup() {
  const context = React.useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
}

function PopupContainer({ popups, hidePopup }) {
  const getPopupStyles = (type) => {
    const baseStyles = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 p-4 rounded-lg shadow-lg border-l-4 animate-slide-in';
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-white border-success-500 text-neutral-900`;
      case 'error':
        return `${baseStyles} bg-white border-danger-500 text-neutral-900`;
      case 'warning':
        return `${baseStyles} bg-white border-secondary-500 text-neutral-900`;
      case 'info':
        return `${baseStyles} bg-white border-neutral-500 text-neutral-900`;
      default:
        return `${baseStyles} bg-white border-neutral-500 text-neutral-900`;
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
        return <Info className={`${iconClasses} text-neutral-600`} />;
      default:
        return <Info className={`${iconClasses} text-neutral-600`} />;
    }
  };

  return (
    <div className="space-y-2">
      {popups.map((popup, index) => (
        <div
          key={popup.id}
          className={getPopupStyles(popup.type)}
          style={{ top: `${4 + (index * 80)}px` }}
        >
          <div className="flex items-start gap-3">
            {getIcon(popup.type)}
            <div className="flex-1">
              <p className="text-sm font-medium">{popup.message}</p>
            </div>
            <button
              onClick={() => hidePopup(popup.id)}
              className="p-1 hover:bg-neutral-100 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Modal Popup Component
export function ModalPopup({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} animate-scale-in`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// Confirmation Popup
export function ConfirmPopup({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) {
  return (
    <ModalPopup isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <p className="text-neutral-700">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="btn btn-ghost"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="btn btn-danger"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </ModalPopup>
  );
}
