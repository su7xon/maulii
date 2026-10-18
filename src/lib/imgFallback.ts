/** Neutral placeholder so a dead image URL never shows a broken-image icon. */
const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">' +
  '<rect width="200" height="200" fill="#f3f4f6"/>' +
  '<rect x="66" y="30" width="68" height="132" rx="12" fill="#fff" stroke="#c9cfd6" stroke-width="4"/>' +
  '<line x1="86" y1="46" x2="114" y2="46" stroke="#c9cfd6" stroke-width="4" stroke-linecap="round"/>' +
  '<circle cx="100" cy="146" r="4" fill="#c9cfd6"/>' +
  '</svg>';

export const FALLBACK_IMAGE = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

/** `img onError` handler: swap to the placeholder once — never loops. */
export const onImgError = (e: { currentTarget: HTMLImageElement }) => {
  const img = e.currentTarget;
  if (img.dataset.fallback === '1') return;
  img.dataset.fallback = '1';
  img.src = FALLBACK_IMAGE;
};
