const loaded = new Set<string>();

/** Script ek hi baar load ho — Razorpay SDK ke liye. */
export function loadScript(src: string): Promise<void> {
  if (loaded.has(src)) return Promise.resolve();
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) {
    loaded.add(src);
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.src = src;
    el.async = true;
    el.onload = () => {
      loaded.add(src);
      resolve();
    };
    el.onerror = () => reject(new Error(`Script load fail: ${src}`));
    document.body.appendChild(el);
  });
}
