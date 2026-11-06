/**
 * Amazon/Flipkart-jaisa address book.
 * - Ek se zyada address save (Home/Work/Other), default select hota hai
 * - Pincode se city/state auto-fill (India Post API)
 */

export type AddressTag = 'Home' | 'Work' | 'Other';

export interface Address {
  id: string;
  name: string;
  phone: string;
  pincode: string;
  addressLine: string;
  landmark: string;
  city: string;
  state: string;
  type: AddressTag;
  isDefault: boolean;
}

export const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh',
  'Dadra & Nagar Haveli and Daman & Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh',
  'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const KEY = 'mm_addresses';
const LEGACY_KEY = 'mm_address';

const uid = () => `addr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const norm = (a: Partial<Address> & { address?: string }): Address => ({
  id: a.id || uid(),
  name: (a.name || '').trim(),
  phone: (a.phone || '').trim(),
  pincode: (a.pincode || '').trim(),
  addressLine: (a.addressLine || a.address || '').trim(),
  landmark: (a.landmark || '').trim(),
  city: (a.city || '').trim(),
  state: a.state || 'Maharashtra',
  type: a.type || 'Home',
  isDefault: a.isDefault ?? false,
});

/** Purana single-address format bhi padh lo — purane customer ka data na jaye. */
export function loadAddresses(): Address[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Address[];
      if (Array.isArray(parsed) && parsed.length) return parsed.map(norm);
    }
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const one = norm({ ...(JSON.parse(legacy) as Partial<Address>), isDefault: true });
      saveAddresses([one]);
      return [one];
    }
  } catch { /* noop */ }
  return [];
}

export function saveAddresses(list: Address[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch { /* noop */ }
}

export function upsertAddress(list: Address[], addr: Address): Address[] {
  const clean = norm(addr);
  let next = list.some((a) => a.id === clean.id)
    ? list.map((a) => (a.id === clean.id ? clean : a))
    : [...list, clean];
  // Sirf ek default.
  if (clean.isDefault) next = next.map((a) => ({ ...a, isDefault: a.id === clean.id }));
  else if (!next.some((a) => a.isDefault)) next = next.map((a) => ({ ...a, isDefault: a.id === clean.id }));
  return next;
}

export function deleteAddress(list: Address[], id: string): Address[] {
  const next = list.filter((a) => a.id !== id);
  if (next.length && !next.some((a) => a.isDefault)) return next.map((a, i) => ({ ...a, isDefault: i === 0 }));
  return next;
}

export const defaultAddress = (list: Address[]): Address | null =>
  list.find((a) => a.isDefault) || list[0] || null;

export const emptyAddress = (): Address => ({
  id: uid(), name: '', phone: '', pincode: '', addressLine: '', landmark: '',
  city: '', state: 'Maharashtra', type: 'Home', isDefault: false,
});

export interface AddressErrors { [k: string]: string }

export function validateAddress(a: Address): AddressErrors {
  const e: AddressErrors = {};
  if (a.name.trim().length < 3) e.name = 'Poora naam likho (min 3 characters)';
  if (!/^[6-9]\d{9}$/.test(a.phone.trim())) e.phone = '10-digit mobile number (6-9 se shuru)';
  if (!/^[1-9][0-9]{5}$/.test(a.pincode.trim())) e.pincode = '6-digit pincode';
  if (a.addressLine.trim().length < 10) e.addressLine = 'House no, building, street, area (min 10 characters)';
  if (a.city.trim().length < 2) e.city = 'City likho';
  if (!STATES.includes(a.state)) e.state = 'State chuno';
  return e;
}

/** Pincode → city/state (India Post API; CORS fail ho to null). */
export async function lookupPincode(pincode: string): Promise<{ city: string; state: string } | null> {
  if (!/^[1-9][0-9]{5}$/.test(pincode)) return null;
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = (await res.json()) as Array<{
      Status?: string;
      PostOffice?: Array<{ District?: string; State?: string }>;
    }>;
    const po = data?.[0]?.PostOffice?.[0];
    if (data?.[0]?.Status !== 'Success' || !po?.District || !po?.State) return null;
    const state = STATES.find((s) => s.toLowerCase() === po.State!.toLowerCase()) || po.State;
    return { city: po.District, state };
  } catch {
    return null;
  }
}
