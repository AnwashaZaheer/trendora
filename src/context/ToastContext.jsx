import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Portal/Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const isSuccess = toast.type === 'success';
            const isError = toast.type === 'error';
            const isInfo = toast.type === 'info';

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl shadow-xl border text-sm font-medium glassmorphism ${
                  isSuccess
                    ? 'border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                    : isError
                    ? 'border-rose-500/30 text-rose-800 dark:text-rose-300'
                    : 'border-brand-500/30 text-brand-800 dark:text-brand-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isSuccess && <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />}
                  {isError && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                  {isInfo && <Info className="w-5 h-5 text-brand-500 shrink-0" />}
                  <span className="leading-snug">{toast.message}</span>
                </div>
                
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
