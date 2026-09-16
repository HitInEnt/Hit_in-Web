import { 
  TimeSlot, 
  BookingItem, 
  PlayerMannerProfile, 
  RentalProduct, 
  SettlementRecord, 
  ClientPartner, 
  ClientStatus,
  PartnerRole,
  FieldInfo,
  CheckInStatus,
  UserPointTransaction,
  UserPointSummary,
  PointReason
} from '../types';
import { 
  initialTimeSlots, 
  initialBookings, 
  initialMannerProfiles, 
  initialRentalProducts, 
  initialSettlements, 
  initialClientPartners,
  initialFields,
  initialPointTransactions,
  initialUserPointSummaries
} from '../mock/mockData';

const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_API_BASE_URL || 
  import.meta.env.NEXT_PUBLIC_API_URL || 
  'https://api.hitin.kr/api/v1';

const STORAGE_KEYS = {
  SLOTS: 'hitin_partner_slots_v5',
  BOOKINGS: 'hitin_partner_bookings_v5',
  PROFILES: 'hitin_partner_profiles_v5',
  PRODUCTS: 'hitin_partner_products_v5',
  SETTLEMENTS: 'hitin_partner_settlements_v5',
  CLIENTS: 'hitin_partner_clients_v5',
  FIELDS: 'hitin_partner_fields_v5',
  USER_POINTS: 'hitin_user_points_v5',
  POINT_TRANSACTIONS: 'hitin_point_transactions_v5'
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

    // If checked-in, automatically award daily QR check-in points (+1,000 P with 1-per-day enforcement)
    if (status === 'checked_in') {
      const b = bookings[idx];
      this.recordQrCheckInPoints(
        b.bookerUserId,
        b.bookerName,
        b.bookerNickname,
        b.bookerPhone,
        b.fieldId,
        '필드 경기장',
        'field',
        b.slotTitle
      );
    }

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

  // --- Client Partners (HQ Partner Management) ---
  static getClients(): ClientPartner[] {
    return getStorage<ClientPartner[]>(STORAGE_KEYS.CLIENTS, initialClientPartners);
  }

  static addClient(client: Omit<ClientPartner, 'id' | 'contractDate' | 'totalRevenue' | 'monthlyRevenue' | 'rating'>): ClientPartner {
    const clients = this.getClients();
    const prefix = client.type === 'field' ? 'fld' : client.type === 'shop' ? 'shp' : 'hq';
    const created: ClientPartner = {
      ...client,
      id: `${prefix}_${Date.now().toString().slice(-4)}`,
      contractDate: new Date().toISOString().slice(0, 10),
      totalRevenue: 0,
      monthlyRevenue: 0,
      rating: 5.0
    };
    const updated = [created, ...clients];
    setStorage(STORAGE_KEYS.CLIENTS, updated);

    fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created)
    }).catch(err => console.warn('[API] Sync add client error:', err));

    return created;
  }

  static updateClient(id: string, updates: Partial<ClientPartner>): ClientPartner | null {
    const clients = this.getClients();
    const idx = clients.findIndex(c => c.id === id);
    if (idx === -1) return null;
    clients[idx] = { ...clients[idx], ...updates };
    setStorage(STORAGE_KEYS.CLIENTS, clients);

    // Sync to API
    fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch(err => console.warn('[API] Sync update client error:', err));

    return clients[idx];
  }

  static getClientByEmail(email: string): ClientPartner | undefined {
    if (!email) return undefined;
    const clients = this.getClients();
    return clients.find(c => c.email && c.email.toLowerCase() === email.toLowerCase());
  }

  static checkUserApproval(email: string, role?: PartnerRole): 'active' | 'pending_approval' | 'suspended' {
    // 1. HQ Super Admin master email is always active
    if (email && email.toLowerCase() === 'hitinent@gmail.com') {
      return 'active';
    }

    // 2. Check client record
    const client = this.getClientByEmail(email);
    if (client) {
      return client.status;
    }

    // 3. Default for all other new registrations is pending_approval
    return 'pending_approval';
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

    // Also update any saved user profile matching this client's email or ID
    const targetEmail = clients[idx].email;
    if (targetEmail) {
      const emailKey = `hitin_custom_user_email_${targetEmail.toLowerCase()}`;
      const savedUserStr = localStorage.getItem(emailKey);
      if (savedUserStr) {
        try {
          const userObj = JSON.parse(savedUserStr);
          userObj.status = status;
          localStorage.setItem(emailKey, JSON.stringify(userObj));
        } catch {}
      }
      // Update role-specific caches if matching
      ['field_owner', 'shop_owner', 'hq_admin'].forEach(r => {
        const rKey = `hitin_custom_user_${r}`;
        const rStr = localStorage.getItem(rKey);
        if (rStr) {
          try {
            const rObj = JSON.parse(rStr);
            if (rObj.email && rObj.email.toLowerCase() === targetEmail.toLowerCase()) {
              rObj.status = status;
              localStorage.setItem(rKey, JSON.stringify(rObj));
            }
          } catch {}
        }
      });
    }

    // Update general active custom user if it matches
    const generalStored = localStorage.getItem('hitin_custom_user');
    if (generalStored) {
      try {
        const userObj = JSON.parse(generalStored);
        if ((userObj.email && userObj.email.toLowerCase() === targetEmail?.toLowerCase()) || userObj.partnerId === id) {
          userObj.status = status;
          localStorage.setItem('hitin_custom_user', JSON.stringify(userObj));
        }
      } catch {}
    }

    // Sync to API
    fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, commissionRate })
    }).catch(err => console.warn('[API] Sync client status error:', err));

    return clients[idx];
  }

  static deleteClient(id: string): boolean {
    const clients = this.getClients();
    const filtered = clients.filter(c => c.id !== id);
    if (filtered.length === clients.length) return false;
    setStorage(STORAGE_KEYS.CLIENTS, filtered);

    fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'DELETE'
    }).catch(err => console.warn('[API] Sync delete client error:', err));

    return true;
  }

  static syncUserToClient(user: { id: string; name: string; businessName: string; role: 'field_owner' | 'shop_owner' | 'hq_admin'; email: string; phone: string; businessNumber?: string; partnerId?: string; status?: 'active' | 'pending_approval' | 'suspended'; roles?: PartnerRole[] }): void {
    if (user.role === 'hq_admin') return; // Do not register HQ admin as merchant client
    const clients = this.getClients();
    const type = (user.roles && user.roles.includes('field_owner')) ? 'field' : (user.role === 'field_owner' ? 'field' : 'shop');
    const partnerId = user.partnerId || user.id;
    const initialStatus = user.status || 'pending_approval';
    const effectiveRoles = user.roles && user.roles.length > 0 ? user.roles : [user.role];

    const existingIdx = clients.findIndex(c => c.id === partnerId || (user.email && c.email && c.email.toLowerCase() === user.email.toLowerCase()));
    if (existingIdx !== -1) {
      clients[existingIdx] = {
        ...clients[existingIdx],
        name: user.businessName || clients[existingIdx].name,
        type: (effectiveRoles.includes('field_owner')) ? 'field' : clients[existingIdx].type,
        roles: effectiveRoles,
        representative: user.name || clients[existingIdx].representative,
        phone: user.phone || clients[existingIdx].phone,
        email: user.email || clients[existingIdx].email,
        businessNumber: user.businessNumber || clients[existingIdx].businessNumber,
        status: user.status || clients[existingIdx].status || 'pending_approval'
      };
      setStorage(STORAGE_KEYS.CLIENTS, clients);
    } else {
      const newClient: ClientPartner = {
        id: partnerId,
        name: user.businessName || `${user.name} 파트너`,
        type,
        roles: effectiveRoles,
        representative: user.name,
        phone: user.phone || '',
        email: user.email,
        businessNumber: user.businessNumber || '',
        region: '경기/수도권',
        address: '',
        status: initialStatus,
        contractDate: new Date().toISOString().slice(0, 10),
        commissionRate: 0.08,
        totalRevenue: 0,
        monthlyRevenue: 0,
        rating: 5.0
      };
      setStorage(STORAGE_KEYS.CLIENTS, [newClient, ...clients]);
    }
  }

  // --- Field Info ---
  static getFields(): FieldInfo[] {
    return getStorage<FieldInfo[]>(STORAGE_KEYS.FIELDS, initialFields);
  }

  static updateField(id: string, updates: Partial<FieldInfo>): FieldInfo | null {
    const fields = this.getFields();
    const idx = fields.findIndex(f => f.id === id);
    if (idx === -1) {
      const created: FieldInfo = {
        id,
        name: updates.name || 'HIT IN 제휴 경기장',
        address: updates.address || '',
        tel: updates.tel || '',
        capacity: updates.capacity || 60,
        surfaceType: updates.surfaceType || 'CQB',
        maxFps: updates.maxFps || 350,
        rules: updates.rules || [],
        amenities: updates.amenities || [],
        coverImage: updates.coverImage || '',
        operatingHours: updates.operatingHours || {},
        ...updates
      };
      setStorage(STORAGE_KEYS.FIELDS, [created, ...fields]);
      return created;
    }
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

  // --- User & Point Management ---
  static getUserPointSummaries(): UserPointSummary[] {
    return getStorage<UserPointSummary[]>(STORAGE_KEYS.USER_POINTS, initialUserPointSummaries);
  }

  static getUserPointTransactions(partnerId?: string): UserPointTransaction[] {
    const txs = getStorage<UserPointTransaction[]>(STORAGE_KEYS.POINT_TRANSACTIONS, initialPointTransactions);
    if (!partnerId) return txs;
    return txs.filter(t => t.partnerId === partnerId);
  }

  static recordQrCheckInPoints(
    userId: string,
    userName: string,
    userNickname: string,
    userPhone: string,
    partnerId: string,
    partnerName: string,
    partnerType: 'field' | 'shop',
    slotTitle?: string
  ): { success: boolean; pointsAwarded: number; message: string; transaction?: UserPointTransaction } {
    const todayStr = new Date().toISOString().slice(0, 10);
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const allTxs = this.getUserPointTransactions();

    // 1일 1회 체크인 포인트 적립 여부 검증
    const alreadyEarnedToday = allTxs.some(
      t => t.userId === userId && t.reason === 'qr_checkin' && t.createdAt.startsWith(todayStr)
    );

    if (alreadyEarnedToday) {
      return {
        success: false,
        pointsAwarded: 0,
        message: '오늘 이미 1회 QR 체크인 포인트(+1,000 P)를 적립받은 사용자입니다.'
      };
    }

    const pointsToAward = 1000;
    const newTx: UserPointTransaction = {
      id: `tx_pt_${Date.now()}`,
      userId,
      userName,
      userNickname,
      userPhone,
      type: 'earn',
      amount: pointsToAward,
      reason: 'qr_checkin',
      description: `${partnerName} 현장 QR 체크인 완료 (1일 1회)`,
      partnerId,
      partnerName,
      partnerType,
      checkInDate: nowStr,
      targetSlotTitle: slotTitle,
      createdAt: nowStr
    };

    // Save transaction
    const updatedTxs = [newTx, ...allTxs];
    setStorage(STORAGE_KEYS.POINT_TRANSACTIONS, updatedTxs);

    // Update User Point Summary
    const summaries = this.getUserPointSummaries();
    const sIdx = summaries.findIndex(s => s.userId === userId);
    if (sIdx !== -1) {
      summaries[sIdx] = {
        ...summaries[sIdx],
        totalPoints: summaries[sIdx].totalPoints + pointsToAward,
        qrCheckInCount: summaries[sIdx].qrCheckInCount + 1,
        lastQrCheckInDate: nowStr,
        todayQrCheckedIn: true,
        recentTransactions: [newTx, ...summaries[sIdx].recentTransactions.slice(0, 5)]
      };
    } else {
      summaries.unshift({
        userId,
        userName,
        userNickname,
        phone: userPhone,
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=TeddyCommander&backgroundColor=ffdfbf',
        totalPoints: pointsToAward,
        qrCheckInCount: 1,
        lastQrCheckInDate: nowStr,
        todayQrCheckedIn: true,
        reviewsWrittenCount: 0,
        mannerScore: 5.0,
        recentTransactions: [newTx]
      });
    }
    setStorage(STORAGE_KEYS.USER_POINTS, summaries);

    return {
      success: true,
      pointsAwarded: pointsToAward,
      message: `QR 체크인 성공! ${userName}님에게 1,000 P가 적립되었습니다.`,
      transaction: newTx
    };
  }

  static recordReviewRatingPoints(
    userId: string,
    rating: number,
    comment: string,
    partnerId: string,
    partnerName: string,
    slotTitle?: string
  ): { success: boolean; pointsAwarded: number; message: string; transaction: UserPointTransaction } {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const allTxs = this.getUserPointTransactions();
    const summaries = this.getUserPointSummaries();
    const userSummary = summaries.find(s => s.userId === userId) || initialUserPointSummaries[0];

    const pointsToAward = 500;
    const newTx: UserPointTransaction = {
      id: `tx_pt_${Date.now()}`,
      userId: userSummary.userId,
      userName: userSummary.userName,
      userNickname: userSummary.userNickname,
      userPhone: userSummary.phone,
      type: 'earn',
      amount: pointsToAward,
      reason: 'review_rating',
      description: '게임 후기 및 플레이어 상호 매너 평가 작성 완료',
      partnerId,
      partnerName,
      partnerType: 'field',
      reviewRating: rating,
      reviewComment: comment,
      targetSlotTitle: slotTitle,
      createdAt: nowStr
    };

    setStorage(STORAGE_KEYS.POINT_TRANSACTIONS, [newTx, ...allTxs]);

    // Update Summary
    const sIdx = summaries.findIndex(s => s.userId === userId);
    if (sIdx !== -1) {
      summaries[sIdx] = {
        ...summaries[sIdx],
        totalPoints: summaries[sIdx].totalPoints + pointsToAward,
        reviewsWrittenCount: summaries[sIdx].reviewsWrittenCount + 1,
        recentTransactions: [newTx, ...summaries[sIdx].recentTransactions.slice(0, 5)]
      };
      setStorage(STORAGE_KEYS.USER_POINTS, summaries);
    }

    return {
      success: true,
      pointsAwarded: pointsToAward,
      message: `게임 후기 및 매너 평점 적립 완료 (+${pointsToAward} P)`,
      transaction: newTx
    };
  }

  static grantManualPoints(
    userId: string,
    amount: number,
    reasonText: string,
    partnerId: string,
    partnerName: string
  ): UserPointTransaction {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const allTxs = this.getUserPointTransactions();
    const summaries = this.getUserPointSummaries();
    const userSummary = summaries.find(s => s.userId === userId) || initialUserPointSummaries[0];

    const newTx: UserPointTransaction = {
      id: `tx_pt_${Date.now()}`,
      userId: userSummary.userId,
      userName: userSummary.userName,
      userNickname: userSummary.userNickname,
      userPhone: userSummary.phone,
      type: amount >= 0 ? 'earn' : 'use',
      amount,
      reason: 'manual_adjust',
      description: reasonText || '관리자 수동 포인트 지급/조정',
      partnerId,
      partnerName,
      partnerType: 'field',
      createdAt: nowStr
    };

    setStorage(STORAGE_KEYS.POINT_TRANSACTIONS, [newTx, ...allTxs]);

    const sIdx = summaries.findIndex(s => s.userId === userId);
    if (sIdx !== -1) {
      summaries[sIdx] = {
        ...summaries[sIdx],
        totalPoints: Math.max(0, summaries[sIdx].totalPoints + amount),
        recentTransactions: [newTx, ...summaries[sIdx].recentTransactions.slice(0, 5)]
      };
      setStorage(STORAGE_KEYS.USER_POINTS, summaries);
    }

    return newTx;
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
    localStorage.removeItem(STORAGE_KEYS.USER_POINTS);
    localStorage.removeItem(STORAGE_KEYS.POINT_TRANSACTIONS);

    // Also tell backend to reset
    fetch(`${API_BASE_URL}/system/reset`, { method: 'POST' }).catch(() => {});
  }
}

