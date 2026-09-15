export type PartnerRole = 'field_owner' | 'shop_owner' | 'hq_admin';

export interface PartnerUser {
  id: string;
  name: string;
  email: string;
  role: PartnerRole;
  businessName: string;
  businessNumber: string;
  phone: string;
  partnerId: string;
  avatarUrl?: string;
}

export type GameType = 
  | '주말 정기전' 
  | '평일 야간전' 
  | 'CQB 스피드전' 
  | '밀심(Milsim) 특별전' 
  | '초보자 입문전' 
  | '팀 단독 대관';

export type SlotStatus = 'open' | 'closed' | 'full' | 'in_progress' | 'completed';

export interface TimeSlot {
  id: string;
  fieldId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  title: string;
  gameType: GameType;
  maxPlayers: number;
  currentPlayers: number;
  pricePerPerson: number;
  status: SlotStatus;
  notes?: string;
}

export type PaymentStatus = 'paid' | 'pending' | 'refunded' | 'cancelled';
export type CheckInStatus = 'checked_in' | 'pending' | 'no_show';

export interface RentalOrderSummary {
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
}

export interface BookingItem {
  id: string;
  bookingNumber: string;
  slotId: string;
  fieldId: string;
  date: string;
  slotTitle: string;
  startTime: string;
  endTime: string;
  bookerUserId: string;
  bookerName: string;
  bookerNickname: string;
  bookerPhone: string;
  playerCount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  checkInStatus: CheckInStatus;
  checkInTime?: string;
  playerMannerScore: number; // 0.0 ~ 5.0
  playerReportCount: number;
  isFirstTimer: boolean;
  rentalOrders: RentalOrderSummary[];
  createdAt: string;
}

export interface PlayerMannerProfile {
  userId: string;
  nickname: string;
  realName: string;
  phone: string;
  mannerScore: number;
  totalGames: number;
  warningCount: number;
  noShowCount: number;
  badges: string[];
  recentTags: string[];
  isBlacklisted: boolean;
  notes?: string;
}

export interface FieldInfo {
  id: string;
  name: string;
  region: string;
  address: string;
  tel: string;
  coverImage: string;
  capacity: number;
  surfaceType: string; // e.g. "CQB 실내 아레나 + 야외 정글"
  maxFps: number; // 0.2g BB탄 기준 FPS 제한 (예: 350 FPS)
  rules: string[];
  amenities: string[];
  isOpenToday: boolean;
  linkedShopNames: string[];
}

export type ProductCategory = 'aeg' | 'gbbr' | 'sniper' | 'gear' | 'ammo_gas' | 'protection';
export type ProductStatus = 'available' | 'rented_out' | 'maintenance' | 'out_of_stock';

export interface RentalProduct {
  id: string;
  shopId: string;
  name: string;
  category: ProductCategory;
  totalStock: number;
  rentedCount: number;
  rentalPrice: number;
  status: ProductStatus;
  imageUrl: string;
  spec: string;
  targetFields: string[]; // 연결된 필드 ID 목록
}

export type PayoutStatus = 'scheduled' | 'paid' | 'pending_invoice';

export interface SettlementRecord {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerType: 'field' | 'shop';
  period: string; // e.g. "2026년 08월 1주차" or "2026-08"
  grossSales: number;
  platformFeeRate: number; // e.g. 0.08 (8%)
  platformFeeAmount: number;
  netPayout: number;
  payoutStatus: PayoutStatus;
  payoutDate: string;
  bookingCount: number;
  taxInvoiceUrl?: string;
}

export type PointReason = 
  | 'qr_checkin' 
  | 'review_rating' 
  | 'manner_reward' 
  | 'event_bonus' 
  | 'manual_adjust';

export interface UserPointTransaction {
  id: string;
  userId: string;
  userName: string;
  userNickname: string;
  userPhone: string;
  avatarUrl?: string;
  type: 'earn' | 'use';
  amount: number; // e.g. +1000, +500
  reason: PointReason;
  description: string;
  partnerId: string;
  partnerName: string;
  partnerType: 'field' | 'shop';
  createdAt: string; // YYYY-MM-DD HH:mm
  // Additional metadata
  checkInDate?: string;
  reviewRating?: number; // 1 ~ 5
  reviewComment?: string;
  targetSlotTitle?: string;
}

export interface UserPointSummary {
  userId: string;
  userName: string;
  userNickname: string;
  phone: string;
  avatarUrl: string;
  totalPoints: number;
  qrCheckInCount: number;
  lastQrCheckInDate?: string;
  todayQrCheckedIn: boolean;
  reviewsWrittenCount: number;
  mannerScore: number;
  recentTransactions: UserPointTransaction[];
}

export type ClientStatus = 'active' | 'pending_approval' | 'suspended';

export interface ClientPartner {
  id: string;
  name: string;
  type: 'field' | 'shop';
  representative: string;
  phone: string;
  email: string;
  region: string;
  address: string;
  status: ClientStatus;
  contractDate: string;
  commissionRate: number; // e.g. 0.08
  totalRevenue: number;
  monthlyRevenue: number;
  activeSlotsCount?: number;
  rating: number;
}



