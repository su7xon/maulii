import React, { useState } from 'react';
import { Star, BadgeCheck } from 'lucide-react';

interface LoveNote {
  id: string;
  quote: string;
  name: string;
  meta: string;
}

const NOTES: LoveNote[] = [
  {
    id: 'l1',
    quote: 'Galaxy S25 FE liya — pure Mumbai me isse best price nahi mila. Bill, warranty sab proper. Full trust!',
    name: 'Anjali Sharma',
    meta: 'Galaxy S25 FE • Mumbai',
  },
  {
    id: 'l2',
    quote: 'iPhone 16 on No-Cost EMI, upar se cover aur safety guard free mila. Staff ne sab samjha ke diya.',
    name: 'Rahul Verma',
    meta: 'iPhone 16 • Thane',
  },
  {
    id: 'l3',
    quote: 'Vivo V60 lene gayi thi, Zeiss camera live demo karke dikhaya. 100% genuine piece, seal pack.',
    name: 'Priya Nair',
    meta: 'Vivo V60 • Pune',
  },
  {
    id: 'l4',
    quote: 'Subah order kiya Oppo F31, 3 ghante me delivery! Itni fast service expect nahi ki thi.',
    name: 'Amit Patel',
    meta: 'Oppo F31 5G • Mumbai',
  },
  {
    id: 'l5',
    quote: 'Purana phone exchange me achha rate mila aur Pixel 9 pe coupon bhi laga. Paisa vasool deal.',
    name: 'Sneha Reddy',
    meta: 'Pixel 9 • Navi Mumbai',
  },
  {
    id: 'l6',
    quote: 'Nothing Phone 2a Plus liya tha, ek chhota issue aaya — turant support mila, bina bahane ke. Customer for life!',
    name: 'Vikram Singh',
    meta: 'Nothing 2a Plus • Kalyan',
  },
];

const LoveCard: React.FC<{ note: LoveNote }> = ({ note }) => (
  <div className="w-[280px] sm:w-[340px] shrink-0 bg-white rounded-2xl border border-red-100 shadow-[0_10px_30px_-12px_rgb(228_37_41/0.25)] p-4 sm:p-5 flex flex-col">
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
    <p className="text-[13px] sm:text-sm text-gray-600 italic leading-relaxed mt-2.5 flex-1">"{note.quote}"</p>
    <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-gray-100">
      <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f03236] to-[#7a0d10] text-white text-sm font-black flex items-center justify-center shrink-0">
        {note.name.charAt(0)}
      </span>
      <div className="min-w-0">
        <p className="text-xs sm:text-sm font-extrabold text-gray-900 flex items-center gap-1 truncate">
          {note.name}
          <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        </p>
        <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium truncate">{note.meta} • Verified Buyer</p>
      </div>
    </div>
  </div>
);

export const CustomerLove: React.FC = () => {
  const [paused, setPaused] = useState(false);
  const loop = [...NOTES, ...NOTES];

  return (
    <section className="pt-2">
      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-[28px] font-black tracking-tight text-gray-900">
          Wall of <span className="text-[#e42529]">Love</span>
        </h2>
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-gray-400 mt-1">
          Hamare customers kya kehte hain
        </p>
      </div>

      <div
        className="overflow-hidden -mx-3 px-3 sm:mx-0 sm:px-0"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div
          className="flex gap-3 w-max animate-marquee"
          style={paused ? { animationPlayState: 'paused' } : undefined}
        >
          {loop.map((n, i) => (
            <LoveCard key={`${n.id}-${i}`} note={n} />
          ))}
        </div>
      </div>

      <p className="text-[11px] text-gray-400 font-medium mt-2.5 text-center">
        10,000+ happy customers • 4.8★ average rating
      </p>
    </section>
  );
};
