import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, storage, isCloudConfigured } from './firebase';

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

/** Upload image file. Firebase Storage when configured, else base64 data-URL (local only). */
export async function uploadStoreImage(file: File, folder = 'mauli'): Promise<string> {
  if (isCloudConfigured && storage) {
    const clean = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${folder}/${Date.now()}-${clean}`;
    const snap = await uploadBytes(ref(storage, path), file, {
      contentType: file.type,
    });
    return getDownloadURL(snap.ref);
  }
  // Fallback: inline base64 (works without Firebase, stays on this browser)
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error('File read failed'));
    r.readAsDataURL(file);
  });
}

export interface CloudSnapshot {
  products?: unknown;
  categories?: unknown;
  banners?: unknown;
  offers?: unknown;
  launches?: unknown;
  slides?: unknown;
}

/** Fetch shared store data from Firestore. Returns null when cloud missing/empty. */
export async function fetchCloudStore(): Promise<CloudSnapshot | null> {
  if (!isCloudConfigured || !db) return null;
  try {
    const snap = await getDoc(doc(db, 'stores', DOC_ID));
    if (!snap.exists()) return null;
    return snap.data() as CloudSnapshot;
  } catch {
    return null;
  }
}

/** Save one collection key to Firestore (fire-and-forget from Admin). Always mirrors to localStorage. */
export async function saveCloudKey(localKey: string, cloudField: keyof CloudSnapshot, value: unknown) {
  writeLocal(localKey, value);
  if (!isCloudConfigured || !db) return;
  try {
    await setDoc(doc(db, 'stores', DOC_ID), { [cloudField]: value }, { merge: true });
  } catch {
    /* offline — local copy still works */
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
      const current = readLocal(localKey, null);
      if (current === null || (Array.isArray(current) && current.length === 0)) {
        writeLocal(localKey, val);
        applied = true;
      }
    }
  }
  return applied;
}
