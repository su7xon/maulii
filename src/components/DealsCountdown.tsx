import React, { useState, useEffect } from 'react';
import { Flame, Clock, Sparkles } from 'lucide-react';

export const DealsCountdown: React.FC = () => {
  // Set initial countdown time: 7 hours, 34 minutes, 28 seconds
  const [timeLeft, setTimeLeft] = useState({
    hours: 7,
    minutes: 34,
    seconds: 28,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 }; // Loop back
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format2Digits = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="bg-linear-to-r from-[#ffe500] via-[#ffdf00] to-[#faca15] px-3 py-2 border-b border-amber-300 flex items-center justify-between text-gray-900 shadow-2xs">
      <div className="flex items-center gap-1.5">
        <div className="w-6 h-6 rounded-full bg-[#e42529] text-white flex items-center justify-center animate-pulse">
          <Flame className="w-3.5 h-3.5" />
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-black text-[#990000] uppercase tracking-wide">
              DEAL OF THE DAY
            </span>
            <span className="bg-[#e42529] text-white text-[9px] font-bold px-1 rounded-[3px]">
              UP TO 55% OFF
            </span>
          </div>
          <span className="text-[10px] text-gray-700 font-medium leading-none block">
            Prices drop for next batch in:
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-black/85 text-white px-2 py-1 rounded-md text-xs font-mono font-bold shadow-xs">
        <Clock className="w-3 h-3 text-[#ffe500]" />
        <span>{format2Digits(timeLeft.hours)}</span>
        <span className="text-[#ffe500] animate-ping">:</span>
        <span>{format2Digits(timeLeft.minutes)}</span>
        <span className="text-[#ffe500] animate-ping">:</span>
        <span>{format2Digits(timeLeft.seconds)}</span>
      </div>
    </div>
  );
};
