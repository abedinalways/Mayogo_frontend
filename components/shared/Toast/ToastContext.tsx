"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Lock,
  X,
} from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info" | "restricted";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (options: Omit<ToastMessage, "id">) => string;
  dismissToast: (id: string) => void;
  success: (message: string, title?: string) => string;
  error: (message: string, title?: string) => string;
  warning: (message: string, title?: string) => string;
  info: (message: string, title?: string) => string;
  showRestrictedToast: (message?: string, title?: string) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      type,
      title,
      message,
      duration = 4500,
    }: Omit<ToastMessage, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastMessage = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }

      return id;
    },
    [dismissToast]
  );

  const success = useCallback(
    (message: string, title?: string) =>
      showToast({ type: "success", title: title || "Success", message }),
    [showToast]
  );

  const error = useCallback(
    (message: string, title?: string) =>
      showToast({ type: "error", title: title || "Error", message }),
    [showToast]
  );

  const warning = useCallback(
    (message: string, title?: string) =>
      showToast({ type: "warning", title: title || "Notice", message }),
    [showToast]
  );

  const info = useCallback(
    (message: string, title?: string) =>
      showToast({ type: "info", title: title || "Info", message }),
    [showToast]
  );

  const showRestrictedToast = useCallback(
    (
      message: string = "You have view-only access. Management permission is required to perform this action.",
      title: string = "Access Restricted"
    ) =>
      showToast({
        type: "restricted",
        title,
        message,
        duration: 5000,
      }),
    [showToast]
  );

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      dismissToast,
      success,
      error,
      warning,
      info,
      showRestrictedToast,
    }),
    [toasts, showToast, dismissToast, success, error, warning, info, showRestrictedToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0 font-['Manrope']"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  const config = {
    success: {
      border: "border-emerald-200",
      bg: "bg-white",
      iconBg: "bg-emerald-50 text-emerald-600",
      titleColor: "text-emerald-950",
      textColor: "text-emerald-800",
      icon: <CheckCircle2 className="h-5 w-5" />,
    },
    error: {
      border: "border-red-200",
      bg: "bg-white",
      iconBg: "bg-red-50 text-red-600",
      titleColor: "text-red-950",
      textColor: "text-red-800",
      icon: <AlertCircle className="h-5 w-5" />,
    },
    warning: {
      border: "border-amber-200",
      bg: "bg-white",
      iconBg: "bg-amber-50 text-amber-600",
      titleColor: "text-amber-950",
      textColor: "text-amber-800",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    info: {
      border: "border-blue-200",
      bg: "bg-white",
      iconBg: "bg-blue-50 text-blue-600",
      titleColor: "text-blue-950",
      textColor: "text-blue-800",
      icon: <Info className="h-5 w-5" />,
    },
    restricted: {
      border: "border-amber-300",
      bg: "bg-[#FFFDF7]",
      iconBg: "bg-[#FEF3C7] text-[#D97706]",
      titleColor: "text-[#92400E]",
      textColor: "text-[#78350F]",
      icon: <Lock className="h-5 w-5" />,
    },
  }[toast.type];

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border ${config.border} ${config.bg} transition-all duration-300 animate-in slide-in-from-bottom-3`}
    >
      <div className={`p-2 rounded-lg shrink-0 ${config.iconBg}`}>
        {config.icon}
      </div>

      <div className="flex-1 pt-0.5 min-w-0">
        {toast.title && (
          <h4 className={`text-sm font-bold ${config.titleColor} leading-tight`}>
            {toast.title}
          </h4>
        )}
        <p className={`text-xs mt-1 leading-relaxed ${config.textColor}`}>
          {toast.message}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
