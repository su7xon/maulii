import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isCloudConfigured } from './firebase';

const DOC_ID = 'mauli-store';

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return (JSON.parse(raw) as T) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key: string, val: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* quota full — ignore, cloud has it */
  }
}

/**
 * Image upload → compressed JPEG base64 data-URL.
 *
 * Ye base64 value admin object (category/banner/etc) me save hoti hai aur
 * saveCloudKey() se Firestore (stores/mauli-store) me sync ho jati hai.
 * Firebase Storage use NAHI hota — uske CORS issues upload fail kara rahe the
 * (browser preflight 404). Image ko resize + compress karke base64 chhota
 * rakha jata hai taki Firestore ki 1MB document limit ke andar fit rahe,
 * warna cloud sync fail ho jata.
 */
const MAX_IMG_DIM = 1280;
const JPEG_QUALITY = 0.75;

function rawBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error('File read failed'));
    r.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('Image decode failed'));
    el.src = src;
  });
}

async function compressImage(file: File): Promise<string | null> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const scale = Math.min(1, MAX_IMG_DIM / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    // Transparent PNG ke liye white background (JPEG transparency support nahi karta)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function uploadStoreImage(file: File, _folder = 'mauli'): Promise<string> {
  try {
    const dataUrl = await compressImage(file);
    if (dataUrl) return dataUrl;
  } catch {
    // decode/compress fail → raw base64 fallback (kam se kam image to aayegi)
  }
  return rawBase64(file);
}

export interface CloudSnapshot {
  products?: unknown;
  categories?: unknown;
  banners?: unknown;
  offers?: unknown;
  launches?: unknown;
  slides?: unknown;
  categoryTiles?: unknown;
  dealTiles?: unknown;
}

/** Fetch shared store data from Firestore. Returns null when cloud missing/empty. */
export async function fetchCloudStore(): Promise<CloudSnapshot | null> {
  if (!isCloudConfigured || !db) return null;
  try {
    const snap = await getDoc(doc(db, 'stores', DOC_ID));
    if (!snap.exists()) return null;
    return snap.data() as CloudSnapshot;
  } catch (err) {
    console.warn('[cloudStore] fetch failed, local data use ho raha hai:', err);
    return null;
  }
}

/** Save one collection key to Firestore (fire-and-forget from Admin). Always mirrors to localStorage. */
export async function saveCloudKey(localKey: string, cloudField: keyof CloudSnapshot, value: unknown) {
  writeLocal(localKey, value);
  if (!isCloudConfigured || !db) return;
  try {
    await setDoc(doc(db, 'stores', DOC_ID), { [cloudField]: value }, { merge: true });
  } catch (err) {
    // Offline ya rules block — local copy bacha rehta hai, par admin ko pata chale.
    console.warn(`[cloudStore] save failed for "${cloudField}" (local copy saved):`, err);
  }
}

/** Prime localStorage from cloud on first load. Returns true if cloud data applied. */
export async function hydrateFromCloud(keys: Record<string, keyof CloudSnapshot>): Promise<boolean> {
  const cloud = await fetchCloudStore();
  if (!cloud) return false;
  let applied = false;
  for (const [localKey, field] of Object.entries(keys)) {
    const val = cloud[field as keyof CloudSnapshot];
    if (val !== undefined && val !== null) {
      const current: unknown = readLocal<unknown>(localKey, null);
      if (current === null || (Array.isArray(current) && current.length === 0)) {
        writeLocal(localKey, val);
        applied = true;
      }
    }
  }
  return applied;
}
