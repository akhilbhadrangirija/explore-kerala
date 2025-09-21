"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const ToastContext = React.createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const addToast = (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      id,
      ...toast,
      open: true,
    };
    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message, options = {}) => {
    addToast({
      type: "success",
      message,
      ...options,
    });
  };

  const error = (message, options = {}) => {
    addToast({
      type: "error",
      message,
      ...options,
    });
  };

  const info = (message, options = {}) => {
    addToast({
      type: "info",
      message,
      ...options,
    });
  };

  const warning = (message, options = {}) => {
    addToast({
      type: "warning",
      message,
      ...options,
    });
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-4 z-50 space-y-2 max-w-md mx-auto sm:mx-0">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function Toast({ toast, onClose }) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // Trigger animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <div
      className={cn(
        "w-full bg-white shadow-lg rounded-lg border pointer-events-auto transition-all duration-300 transform",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
        getStyles()
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium break-words">{toast.message}</p>
            {toast.description && (
              <p className="mt-1 text-sm opacity-90 break-words">{toast.description}</p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
