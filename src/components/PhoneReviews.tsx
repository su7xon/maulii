import React, { useEffect, useRef, useState } from 'react';
import { Star, Volume2, VolumeX, BadgeCheck } from 'lucide-react';

interface Review {
  id: string;
  src: string;
  phone: string;
  buyer: string;
  quote: string;
}

const REVIEWS: Review[] = [
  {
    id: 'r1',
    src: '/videos/review-1.mp4',
    phone: 'Galaxy S25 FE',
    buyer: 'Rahul • Mumbai',
    quote: 'BEST CAMERA PHONE IN THIS BUDGET!',
  },
  {
    id: 'r2',
    src: '/videos/review-2.mp4',
    phone: 'Vivo V60',
    buyer: 'Priya • Pune',
    quote: 'ZEISS CAMERA IS NEXT LEVEL!',
  },
  {
    id: 'r3',
    src: '/videos/review-3.mp4',
    phone: 'Oppo F31 5G',
    buyer: 'Amit • Delhi',
    quote: 'BATTERY KING, 2 DAYS BACKUP!',
  },
  {
    id: 'r4',
    src: '/videos/review-4.mp4',
    phone: 'Nothing Phone 2a',
    buyer: 'Sneha • Bengaluru',
    quote: 'GLYPH LIGHTS LOOK SO PREMIUM!',
  },
  {
    id: 'r5',
    src: '/videos/review-5.mp4',
    phone: 'iPhone 16 Pro',
    buyer: 'Vikram • Hyderabad',
    quote: 'SWITCHED TO IPHONE, ZERO REGRETS!',
  },
  {
    id: 'r6',
    src: '/videos/review-6.mp4',
    phone: 'Galaxy Z Fold',
    buyer: 'Neha • Chennai',
    quote: 'FOLD DISPLAY IS PURE MAGIC!',
  },
];

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  // Keep muted property in sync (React muted attr quirk fix)
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  // Play only when card visible on screen — keeps scroll smooth, saves data
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [review.src]);

  return (
    <div className="relative shrink-0 w-[210px] sm:w-[235px] aspect-[9/16] rounded-xl overflow-hidden bg-gray-900 shadow-[0_10px_30px_-10px_rgb(0_0_0/0.4)] snap-start group">
      <video
        ref={videoRef}
        src={review.src}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        disablePictureInPicture
        onClick={() => setMuted((m) => !m)}
      />

      {/* Top: phone tag + mute btn */}
      <div className="absolute top-0 inset-x-0 p-2.5 flex items-start justify-between z-10">
        <span className="bg-black/55 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/15">
          {review.phone}
        </span>
        <button
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? 'Unmute' : 'Mute'}
          className="w-8 h-8 rounded-full bg-black/55 backdrop-blur text-white flex items-center justify-center border border-white/15 active:scale-90 transition-transform"
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom gradient + stars + quote */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-10 z-10 pointer-events-none">
        <div className="flex gap-0.5 mb-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <p className="text-white text-[13px] font-black italic leading-tight">"{review.quote}"</p>
        <p className="flex items-center gap-1 text-white/70 text-[10px] font-semibold mt-1.5">
          <BadgeCheck className="w-3 h-3 text-emerald-400" />
          {review.buyer} • Verified Buyer
        </p>
      </div>
    </div>
  );
};

export const PhoneReviews: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="pt-2">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
          PHONE REVIEWS
        </h2>
        <div className="mt-1 h-1 w-24 bg-[#e42529] rounded-full" />
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3.5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1 -mx-3 px-3 sm:mx-0 sm:px-0"
      >
        {REVIEWS.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>

      <p className="text-[11px] text-gray-400 font-medium mt-2.5 text-center sm:text-left">
        Tap video to unmute • Real buyers, real reviews
      </p>
    </section>
  );
};
