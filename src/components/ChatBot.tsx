import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Mic, Sparkles } from 'lucide-react';
import { Product } from '../types';

// Fast free-tier Groq models (verified live). First working one wins.
const MODELS = ['openai/gpt-oss-20b', 'qwen/qwen3.8-27b'];

interface Msg {
  role: 'user' | 'assistant';
  text: string;
}

interface ChatBotProps {
  product: Product;
  products: Product[];
  onViewProduct: (p: Product) => void;
}

function buildSystemPrompt(product: Product, products: Product[]): string {
  const specLines = Object.entries(product.specs)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');
  const catalog = products
    .slice(0, 25)
    .map((p) => `- ${p.brand} ${p.name} — ₹${p.price.toLocaleString('en-IN')} (MRP ₹${p.mrp.toLocaleString('en-IN')}, ${p.rating}★)`)
    .join('\n');
  return `You are "Mauli Assistant", the shopping helper for Mauli Mobile (online mobile store, Mumbai, India).
User is viewing THIS product: ${product.brand} ${product.name} — Price ₹${product.price.toLocaleString('en-IN')}, MRP ₹${product.mrp.toLocaleString('en-IN')} (${product.discountPercentage}% off), Rating ${product.rating}★ (${product.ratingCount} ratings), EMI from ₹${product.emiStartsAt.toLocaleString('en-IN')}/mo, Specs: ${specLines}. Features: ${product.features.join('; ')}.

Other products in store (suggest ONLY from this list, never invent prices):
${catalog}

Store facts: free express delivery in Mumbai 400001, 7-day replacement, 1-yr brand warranty, COD/UPI/Card accepted, bank offers on HDFC/ICICI/SBI/PNB cards.
Rules: reply SHORT (2-4 lines max), in simple English, prices always in ₹ with Indian format, never invent specs/prices, if asked about something not in catalog say it's not available and suggest closest alternative.`;
}

async function askGroq(system: string, history: Msg[]): Promise<string> {
  const key = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
  if (!key) throw new Error('Chat API key missing. Add VITE_GROQ_API_KEY to .env');
  const messages = [
    { role: 'system', content: system },
    ...history.slice(-10).map((m) => ({ role: m.role, content: m.text })),
  ];
  let lastErr = '';
  for (const model of MODELS) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 30000);
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages, temperature: 0.4, max_tokens: 400 }),
        signal: ctrl.signal,
      });
      clearTimeout(t);
      if (res.status === 401) throw new Error('Invalid API key');
      if (!res.ok) {
        lastErr = `Model ${model} failed (${res.status})`;
        continue; // try next model
      }
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content?.trim();
      if (!text) {
        lastErr = 'Empty reply';
        continue;
      }
      return text;
    } catch (e) {
      lastErr = e instanceof Error ? e.message : 'Network error';
      if (lastErr === 'Invalid API key') throw e;
    }
  }
  throw new Error(lastErr || 'All models failed');
}

const QUICK = ['What are the best offers?', 'Is EMI available?', 'Compare with similar', 'Good for gaming?'];

export const ChatBot: React.FC<ChatBotProps> = ({ product, products, onViewProduct }) => {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<any>(null);

  // Fresh greeting whenever a different product opens
  useEffect(() => {
    setMsgs([
      {
        role: 'assistant',
        text: `Hello! 🙏`,
      },
    ]);
    setInput('');
    setBusy(false);
  }, [product.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, busy, open]);

  const toggleVoice = () => {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) return;
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const rec = new SR();
    rec.lang = 'en-IN';
    rec.interimResults = false;
    rec.onresult = (e: any) => setInput(e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    try {
      rec.start();
    } catch {
      setListening(false);
    }
  };

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    const next = [...msgs, { role: 'user' as const, text: q }];
    setMsgs(next);
    setInput('');
    setBusy(true);
    try {
      const reply = await askGroq(buildSystemPrompt(product, products), next);
      setMsgs([...next, { role: 'assistant', text: reply }]);
    } catch (e) {
      setMsgs([...next, { role: 'assistant', text: `Sorry, I couldn't reply right now (${e instanceof Error ? e.message : 'error'}). Please try again in a bit 🙏` }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* Floating button (same spot WhatsApp uses on home) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Chat with Mauli Assistant"
          title="Chat with Mauli Assistant"
          className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-40 w-[56px] h-[56px] rounded-full overflow-hidden border-[3px] border-[#e42529] bg-white shadow-[0_10px_30px_-6px_rgb(0_0_0/0.4)] hover:scale-110 active:scale-95 transition-transform"
        >
          <img src="/chatbot-avatar.jpeg" alt="Mauli Assistant" className="w-full h-full object-cover" />
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
        </button>
      )}

      {open && (
        <div className="fixed z-40 inset-x-0 bottom-0 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[380px] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[76vh] sm:h-[540px] sm:max-h-[82vh]">
          {/* Grabber (mobile sheet) */}
          <div className="sm:hidden pt-2 flex justify-center shrink-0">
            <span className="w-10 h-1 rounded-full bg-gray-300" />
          </div>
          {/* Header */}
          <div className="bg-white px-4 py-2.5 flex items-center gap-1.5 shrink-0 border-b border-gray-100">
            <Sparkles className="w-5 h-5 text-[#e42529]" />
            <span className="text-[17px] font-extrabold tracking-tight bg-gradient-to-r from-[#e42529] to-[#b8860b] bg-clip-text text-transparent">
              Ask AI
            </span>
            <button onClick={() => setOpen(false)} aria-label="Close chat"
              className="ml-auto p-1.5 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-800" />
            </button>
          </div>
          {/* Product context */}
          <div className="px-4 pt-3 pb-1 flex gap-2.5 items-start shrink-0 bg-white">
            <img src={product.image} alt={product.name}
              className="w-11 h-14 object-contain rounded-lg border border-gray-200 bg-gray-50 p-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[15px] font-extrabold text-gray-900 leading-tight">Ask about this</p>
              <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{product.name}</p>
              <p className="text-xs font-extrabold text-gray-900 mt-0.5">
                ₹{product.price.toLocaleString('en-IN')} • {product.discountPercentage}% off
              </p>
            </div>
          </div>

          {/* Messages */}
          <div ref={boxRef} className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2.5 bg-white">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-[#e42529] text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-3.5 py-2.5 shadow-sm flex gap-1">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Suggestion pills — only until user asks something */}
          {!msgs.some((m) => m.role === 'user') && (
          <div className="px-4 py-2 flex flex-col gap-2 bg-white shrink-0 min-h-0 max-h-48 overflow-y-auto">
            {QUICK.map((q) => (
              <button key={q} onClick={() => send(q)} disabled={busy}
                className="self-start max-w-full text-left text-[13px] font-semibold text-gray-900 bg-white border-[1.5px] border-[#e42529]/60 px-3.5 py-2 rounded-full hover:bg-red-50 disabled:opacity-50 transition-colors truncate">
                {q}
              </button>
            ))}
            <a
              href={`https://wa.me/918237305111?text=${encodeURIComponent(`Hi! I need expert advice about ${product.brand} ${product.name.split(',')[0]}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start flex items-center gap-2 text-[13px] font-semibold text-gray-900 bg-white border-[1.5px] border-[#e42529]/60 pl-1.5 pr-3.5 py-1.5 rounded-full hover:bg-red-50 transition-colors"
            >
              <img src="/chatbot-avatar.jpeg" alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
              Chat with expert on WhatsApp
            </a>
          </div>
          )}

          {/* Input */}
          <div className="px-4 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] bg-white shrink-0">
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-center gap-1 border-[1.5px] border-gray-300 rounded-2xl pl-4 pr-1.5 py-1.5 focus-within:border-[#e42529] transition-colors"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI"
                className="flex-1 text-base sm:text-sm focus:outline-none min-w-0 placeholder-gray-400 bg-transparent"
              />
              <button type="button" onClick={toggleVoice} aria-label="Voice input"
                className={`p-2 rounded-full transition-colors shrink-0 ${listening ? 'text-[#e42529] animate-pulse bg-red-50' : 'text-gray-500 hover:bg-gray-100'}`}>
                <Mic className="w-5 h-5" />
              </button>
              <button type="submit" disabled={busy || !input.trim()} aria-label="Send"
                className="w-9 h-9 rounded-full bg-[#e42529] hover:bg-[#c21418] disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-colors">
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
            <p className="text-[10px] text-gray-400 text-center mt-1.5">
              AI-generated responses may not always be correct
            </p>
          </div>
        </div>
      )}
    </>
  );
};
