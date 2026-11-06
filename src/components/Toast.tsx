import React from 'react';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'cart' | 'info';
  onClose: () => void;
  onViewCart?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose, onViewCart }) => {
  return (
    <div className="fixed bottom-24 md:bottom-8 inset-x-4 max-w-sm mx-auto z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div className="bg-gray-900/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-xl shadow-xl flex items-center justify-between gap-2 border border-white/10">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {type === 'cart' ? (
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="text-xs font-semibold truncate">{message}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {type === 'cart' && onViewCart && (
            <button
              onClick={() => {
                onViewCart();
                onClose();
              }}
              className="text-[11px] font-black text-amber-300 hover:text-amber-200 bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md transition-colors"
            >
              View Cart ➜
            </button>
          )}

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
