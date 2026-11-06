import React, { useEffect, useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

export const Confetti: React.FC<ConfettiProps> = ({ active, onComplete }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 1050);

    return () => clearTimeout(timer);
  }, [active, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center p-4">
      {/* Sleek Floating Micro-Pill Animation */}
      <div className="animate-fly-pill flex items-center gap-2.5 bg-gray-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-full shadow-[0_12px_32px_-6px_rgba(228,37,41,0.35)] border border-white/15">
        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
          <Check className="w-3 h-3 stroke-[3]" />
        </div>
        <span className="text-xs font-extrabold tracking-wide text-white">Added to Cart</span>
        <div className="w-5 h-5 rounded-full bg-red-500/20 text-[#ff4d4f] flex items-center justify-center">
          <ShoppingBag className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};
