import { collection, addDoc, getDocs, query, orderBy, limit, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, isCloudConfigured } from './firebase';
import type { Order } from '../data/adminStore';

/**
 * Orders are NOT localStorage-only: har order Firestore `orders` collection me
 * jaata hai, taaki customer ke phone se place kiya order shop ke admin panel
 * (dusre device/browser) me dikhe.
 *
 * Firestore rules (deploy se pehle Console me daalo):
 *   match /orders/{id} {
 *     allow create: if true;                 // checkout anonymous hai
 *     allow read, update: if request.auth != null && request.auth.token.admin == true;
 *     allow delete: if false;
 *   }
 */
const ORDERS = 'orders';

/** Checkout se order save karo. Cloud off/fail ho to local copy rakh leta hai. */
export async function pushOrder(order: Order): Promise<'cloud' | 'local'> {
  if (!isCloudConfigured || !db) return 'local';
  try {
    await addDoc(collection(db, ORDERS), { ...order, createdAt: serverTimestamp() });
    return 'cloud';
  } catch (err) {
    console.warn('[orders] cloud save failed, local copy rakh rahe hain:', err);
    return 'local';
  }
}

/** Admin panel ke liye saare orders cloud se. Fail ho to null (caller local use kare). */
export async function fetchOrders(max = 500): Promise<Order[] | null> {
  if (!isCloudConfigured || !db) return null;
  try {
    const snap = await getDocs(query(collection(db, ORDERS), orderBy('date', 'desc'), limit(max)));
    return snap.docs.map((d) => {
      const data = d.data() as Order & { createdAt?: unknown };
      // docId alag rakho — status update/delete Firestore document id se hote hain,
      // app ka order id customer-side generate hota hai.
      return { ...data, id: data.id || d.id, docId: d.id };
    });
  } catch (err) {
    console.warn('[orders] cloud fetch failed, local orders use ho rahe hain:', err);
    return null;
  }
}

/** Order cloud se delete karo. */
export async function deleteOrder(docId: string): Promise<boolean> {
  if (!isCloudConfigured || !db) return false;
  try {
    await deleteDoc(doc(db, ORDERS, docId));
    return true;
  } catch (err) {
    console.warn('[orders] delete failed:', err);
    return false;
  }
}

/** Order ka status badlo (Shipped/Delivered/Cancelled) — cloud me. */
export async function updateOrderStatus(docId: string, status: Order['status']): Promise<boolean> {
  if (!isCloudConfigured || !db) return false;
  try {
    await updateDoc(doc(db, ORDERS, docId), { status });
    return true;
  } catch (err) {
    console.warn('[orders] status update failed:', err);
    return false;
  }
}
