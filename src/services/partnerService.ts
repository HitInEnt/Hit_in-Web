import { 
  TimeSlot, 
  BookingItem, 
  PlayerMannerProfile, 
  RentalProduct, 
  SettlementRecord, 
  ClientPartner, 
  FieldInfo,
  CheckInStatus
} from '../types';
import { 
  initialTimeSlots, 
  initialBookings, 
  initialMannerProfiles, 
  initialRentalProducts, 
  initialSettlements, 
  initialClientPartners,
  initialFields 
} from '../mock/mockData';

const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 
  import.meta.env.NEXT_PUBLIC_API_URL || 
  import.meta.env.VITE_API_URL || 
  'http://49.247.131.154/api/v1';

const STORAGE_KEYS = {
  SLOTS: 'hitin_partner_slots_v1',
  BOOKINGS: 'hitin_partner_bookings_v1',
  PROFILES: 'hitin_partner_profiles_v1',
  PRODUCTS: 'hitin_partner_products_v1',
  SETTLEMENTS: 'hitin_partner_settlements_v1',
  CLIENTS: 'hitin_partner_clients_v1',
  FIELDS: 'hitin_partner_fields_v1'
};

function getStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

export class PartnerService {
  private static isOnline: boolean = true;

  // Health check
  static async checkApiHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
      const data = await res.json();
      this.isOnline = data.status === 'ok';
      return this.isOnline;
    } catch {
      this.isOnline = false;
      return false;
    }
  }

  // --- Slots ---
  static async fetchSlotsFromServer(fieldId?: string, date?: string): Promise<TimeSlot[]> {
    try {
      const params = new URLSearchParams();
      if (fieldId) params.append('fieldId', fieldId);
      if (date) params.append('date', date);
      const res = await fetch(`${API_BASE_URL}/slots?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setStorage(STORAGE_KEYS.SLOTS, json.data);
          return json.data;
        }
      }
    } catch (e) {
      console.warn('[API] Fetch slots failed, using local cache:', e);
    }
    return this.getSlots(fieldId);
  }

  static getSlots(fieldId?: string): TimeSlot[] {
    const slots = getStorage<TimeSlot[]>(STORAGE_KEYS.SLOTS, initialTimeSlots);
    if (!fieldId) return slots;
    return slots.filter(s => s.fieldId === fieldId);
  }

  static addSlot(newSlot: Omit<TimeSlot, 'id'>): TimeSlot {
    const slots = this.getSlots();
    const created: TimeSlot = {
      ...newSlot,
      id: `slt_${Date.now()}`
    };
    const updated = [created, ...slots];
    setStorage(STORAGE_KEYS.SLOTS, updated);

    // Sync to API in background
    fetch(`${API_BASE_URL}/slots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSlot)
    }).catch(err => console.warn('[API] Sync slot error:', err));

    return created;
  }

  static updateSlot(id: string, updates: Partial<TimeSlot>): TimeSlot | null {
    const slots = this.getSlots();
    const idx = slots.findIndex(s => s.id === id);
    if (idx === -1) return null;
    slots[idx] = { ...slots[idx], ...updates };
    setStorage(STORAGE_KEYS.SLOTS, slots);

    // Sync to API in background
    fetch(`${API_BASE_URL}/slots/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch(err => console.warn('[API] Update slot error:', err));

    return slots[idx];
  }

  // --- Bookings ---
  static async fetchBookingsFromServer(fieldId?: string, slotId?: string): Promise<BookingItem[]> {
    try {
      const params = new URLSearchParams();
      if (fieldId) params.append('fieldId', fieldId);
      if (slotId) params.append('slotId', slotId);
      const res = await fetch(`${API_BASE_URL}/bookings?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setStorage(STORAGE_KEYS.BOOKINGS, json.data);
          return json.data;
        }
      }
    } catch (e) {
      console.warn('[API] Fetch bookings failed, using local cache:', e);
    }
    return this.getBookings(fieldId);
  }

  static getBookings(fieldId?: string): BookingItem[] {
    const bookings = getStorage<BookingItem[]>(STORAGE_KEYS.BOOKINGS, initialBookings);
    if (!fieldId) return bookings;
    return bookings.filter(b => b.fieldId === fieldId);
  }

  static updateCheckInStatus(bookingId: string, status: CheckInStatus): BookingItem | null {
    const bookings = this.getBookings();
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx === -1) return null;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    bookings[idx] = {
      ...bookings[idx],
      checkInStatus: status,
      checkInTime: status === 'checked_in' ? timeStr : undefined
    };
    setStorage(STORAGE_KEYS.BOOKINGS, bookings);

    // Sync to API in background
    fetch(`${API_BASE_URL}/bookings/${bookingId}/checkin`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(err => console.warn('[API] Sync check-in error:', err));

    return bookings[idx];
  }

  static addManualBooking(booking: Omit<BookingItem, 'id' | 'bookingNumber' | 'createdAt'>): BookingItem {
    const bookings = this.getBookings();
    const created: BookingItem = {
      ...booking,
      id: `bk_${Date.now()}`,
      bookingNumber: `HIT-MANUAL-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    const updated = [created, ...bookings];
    setStorage(STORAGE_KEYS.BOOKINGS, updated);

    // Update slot current players in local cache
    const slots = this.getSlots();
    const sIdx = slots.findIndex(s => s.id === booking.slotId);
    if (sIdx !== -1) {
      slots[sIdx].currentPlayers = Math.min(slots[sIdx].maxPlayers, slots[sIdx].currentPlayers + booking.playerCount);
      setStorage(STORAGE_KEYS.SLOTS, slots);
    }

    // Sync to API in background
    fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    }).catch(err => console.warn('[API] Sync manual booking error:', err));

    return created;
  }

  // --- Manner Profile ---
  static getMannerProfile(userId: string): PlayerMannerProfile {
    const profiles = getStorage<Record<string, PlayerMannerProfile>>(STORAGE_KEYS.PROFILES, initialMannerProfiles);
    if (profiles[userId]) return profiles[userId];

    return {
      userId,
      nickname: '일반플레이어',
      realName: '미등록',
      phone: '010-0000-0000',
      mannerScore: 4.8,
      totalGames: 10,
      warningCount: 0,
      noShowCount: 0,
      badges: ['🎖️ 정기전 참가자'],
      recentTags: ['매너 우수'],
      isBlacklisted: false
    };
  }

  static updateMannerNotes(userId: string, notes: string): void {
    const profiles = getStorage<Record<string, PlayerMannerProfile>>(STORAGE_KEYS.PROFILES, initialMannerProfiles);
    if (profiles[userId]) {
      profiles[userId].notes = notes;
      setStorage(STORAGE_KEYS.PROFILES, profiles);
    }

    // Sync to API
    fetch(`${API_BASE_URL}/players/${userId}/notes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    }).catch(err => console.warn('[API] Sync player notes error:', err));
  }

  // --- Rental Products (Gunshop) ---
  static getProducts(shopId?: string): RentalProduct[] {
    const products = getStorage<RentalProduct[]>(STORAGE_KEYS.PRODUCTS, initialRentalProducts);
    if (!shopId) return products;
    return products.filter(p => p.shopId === shopId);
  }

  static addProduct(product: Omit<RentalProduct, 'id'>): RentalProduct {
    const products = this.getProducts();
    const created: RentalProduct = {
      ...product,
      id: `p_${Date.now()}`
    };
    const updated = [created, ...products];
    setStorage(STORAGE_KEYS.PRODUCTS, updated);

    // Sync to API
    fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    }).catch(err => console.warn('[API] Sync product error:', err));

    return created;
  }

  static updateProduct(id: string, updates: Partial<RentalProduct>): RentalProduct | null {
    const products = this.getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    products[idx] = { ...products[idx], ...updates };
    setStorage(STORAGE_KEYS.PRODUCTS, products);

    // Sync to API
    fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch(err => console.warn('[API] Sync product update error:', err));

    return products[idx];
  }

  // --- Settlements ---
  static getSettlements(partnerId?: string): SettlementRecord[] {
    const settlements = getStorage<SettlementRecord[]>(STORAGE_KEYS.SETTLEMENTS, initialSettlements);
    if (!partnerId) return settlements;
    return settlements.filter(s => s.partnerId === partnerId);
  }

  // --- Client Partners (HQ CRM) ---
  static getClients(): ClientPartner[] {
    return getStorage<ClientPartner[]>(STORAGE_KEYS.CLIENTS, initialClientPartners);
  }

  static updateClientStatus(id: string, status: ClientPartner['status'], commissionRate?: number): ClientPartner | null {
    const clients = this.getClients();
    const idx = clients.findIndex(c => c.id === id);
    if (idx === -1) return null;
    clients[idx].status = status;
    if (commissionRate !== undefined) {
      clients[idx].commissionRate = commissionRate;
    }
    setStorage(STORAGE_KEYS.CLIENTS, clients);

    // Sync to API
    fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, commissionRate })
    }).catch(err => console.warn('[API] Sync client status error:', err));

    return clients[idx];
  }

  // --- Field Info ---
  static getFields(): FieldInfo[] {
    return getStorage<FieldInfo[]>(STORAGE_KEYS.FIELDS, initialFields);
  }

  static updateField(id: string, updates: Partial<FieldInfo>): FieldInfo | null {
    const fields = this.getFields();
    const idx = fields.findIndex(f => f.id === id);
    if (idx === -1) return null;
    fields[idx] = { ...fields[idx], ...updates };
    setStorage(STORAGE_KEYS.FIELDS, fields);

    // Sync to API
    fetch(`${API_BASE_URL}/fields/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch(err => console.warn('[API] Sync field info error:', err));

    return fields[idx];
  }

  // Reset to initial mock
  static resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.SLOTS);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.PROFILES);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.SETTLEMENTS);
    localStorage.removeItem(STORAGE_KEYS.CLIENTS);
    localStorage.removeItem(STORAGE_KEYS.FIELDS);

    // Also tell backend to reset
    fetch(`${API_BASE_URL}/system/reset`, { method: 'POST' }).catch(() => {});
  }
}
