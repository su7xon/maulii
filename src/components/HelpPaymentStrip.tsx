import React from 'react';
import { PhoneCall } from 'lucide-react';

const PAYMENT_BADGES: React.ReactNode[] = [
  <span key="visa" className="text-[#1a1f71] text-2xl font-black italic tracking-tighter">
    VISA
  </span>,
  <span key="maestro" className="flex items-center" title="Maestro">
    <span className="w-6 h-6 rounded-full bg-[#eb001b]" />
    <span className="w-6 h-6 rounded-full bg-[#00a1df] -ml-3 mix-blend-multiply" />
  </span>,
  <span key="cirrus" className="flex items-center" title="Cirrus">
    <span className="w-6 h-6 rounded-full bg-[#0099df]" />
    <span className="w-6 h-6 rounded-full bg-[#0099df] -ml-3 opacity-80" />
  </span>,
  <span key="amex" className="bg-[#2e77bc] text-white text-[8px] font-black leading-tight px-1.5 py-1 rounded-[3px] text-center">
    AMERICAN<br />EXPRESS
  </span>,
  <span key="icici" className="flex items-center gap-1" title="ICICI Bank">
    <span className="text-[#e65100] text-2xl font-black italic">i</span>
    <span className="text-[#1b2a6b] text-sm font-extrabold">ICICI Bank</span>
  </span>,
  <span key="rupay" className="flex items-center gap-0.5" title="RuPay">
    <span className="text-[#0f4c9c] text-lg font-black italic">RuPay</span>
    <span className="flex flex-col gap-[2px]">
      <span className="w-2 h-[3px] bg-orange-500" />
      <span className="w-2 h-[3px] bg-green-600" />
    </span>
  </span>,
  <span key="upi" className="text-[#4d7c0f] text-lg font-black italic tracking-tight" title="UPI">
    UPI
  </span>,
  <span key="emi" className="flex gap-[2px]" title="EMI">
    {['E', 'M', 'I'].map((l) => (
      <span key={l} className="bg-[#b31217] text-white text-xs font-black w-5 h-6 flex items-center justify-center rounded-[2px]">
        {l}
      </span>
    ))}
  </span>,
];

const EMI_BADGES: React.ReactNode[] = [
  <span key="hdfc" className="flex items-center bg-[#004481] text-white pl-1 pr-2 py-1 rounded-[3px]" title="HDFC Bank">
    <span className="bg-white text-[#e30613] text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-[2px] mr-1.5">
      ╬
    </span>
    <span className="text-xs font-extrabold tracking-wide">HDFC BANK</span>
  </span>,
  <span key="bajaj" className="flex items-center bg-[#0066b3] text-white px-2 py-1 rounded-[3px]" title="Bajaj Finserv">
    <span className="border-2 border-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-[3px] mr-1.5">
      B
    </span>
    <span className="text-[10px] font-extrabold leading-tight">BAJAJ<br />FINSERV</span>
  </span>,
  <span key="homecredit" className="text-[#e30613] text-sm font-black leading-tight text-center" title="Home Credit">
    HOME<br />CREDIT
  </span>,
];

export const HelpPaymentStrip: React.FC = () => {
  return (
    <section className="bg-white border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Help */}
        <div className="md:col-span-3 flex items-start gap-3.5">
          <a
            href="tel:8237305111"
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f03236] to-[#7a0d10] flex items-center justify-center shrink-0 shadow-[0_8px_20px_-6px_rgb(228_37_41/0.6)] ring-2 ring-[#e42529]/20 hover:scale-105 transition-transform"
            aria-label="Call us"
          >
            <PhoneCall className="w-6 h-6 text-white" />
          </a>
          <div>
            <a href="tel:8237305111" className="text-[15px] font-bold text-gray-900 hover:text-[#e42529] transition-colors">
              NEED HELP? CALL US: 82373 05111
            </a>
            <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">
              Available timing Monday - Sunday
              <br />
              (10 AM - 7 PM) IST
            </p>
          </div>
        </div>

        {/* Payment options */}
        <div className="md:col-span-5">
          <h4 className="text-[15px] font-medium text-gray-900 text-center tracking-wide mb-4">
            PAYMENT OPTION
          </h4>
          <div className="flex items-center justify-center flex-wrap gap-x-5 gap-y-3">
            {PAYMENT_BADGES.map((b, i) => (
              <span key={i} className="flex items-center">{b}</span>
            ))}
          </div>
        </div>

        {/* EMI options */}
        <div className="md:col-span-4">
          <h4 className="text-[15px] font-medium text-gray-900 text-center tracking-wide mb-4">
            OUR EMI OPTIONS
          </h4>
          <div className="flex items-center justify-center flex-wrap gap-x-5 gap-y-3">
            {EMI_BADGES.map((b, i) => (
              <span key={i} className="flex items-center">{b}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
