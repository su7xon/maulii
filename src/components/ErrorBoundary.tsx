import React from 'react';

interface State {
  error: Error | null;
}

/** Last-resort guard: ek runtime error se poora app blank na ho. */
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App crashed:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="min-h-screen bg-[#f2f4f8] flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-3xl border border-gray-100 shadow-lg p-7 text-center">
          <h1 className="text-lg font-black text-[#1a1a1a]">Kuch galat ho gaya</h1>
          <p className="text-sm text-gray-500 mt-2">Page load nahi ho paya. Neeche wala button dabayo.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 w-full bg-gradient-to-b from-[#f03236] to-[#c21418] text-white text-sm font-extrabold py-3 rounded-xl active:scale-[0.99] transition"
          >
            Reload karo
          </button>
        </div>
      </div>
    );
  }
}
