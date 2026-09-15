import { 
  FieldInfo, 
  TimeSlot, 
  BookingItem, 
  PlayerMannerProfile, 
  RentalProduct, 
  SettlementRecord, 
  ClientPartner,
  PartnerUser,
  UserPointTransaction,
  UserPointSummary
} from '../types';

// 기본 파트너 사용자 역할 정의 (가상 데이터 제거, 클린 초기 구조)
export const initialPartnerUsers: PartnerUser[] = [
  {
    id: 'usr_field_default',
    name: '필드 관리자',
    email: 'field@partner.hitin.kr',
    role: 'field_owner',
    businessName: 'HIT IN 제휴 경기장',
    businessNumber: '',
    phone: '',
    partnerId: 'fld_01',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=FieldPartner&backgroundColor=ffdfbf'
  },
  {
    id: 'usr_shop_default',
    name: '건샵 관리자',
    email: 'shop@partner.hitin.kr',
    role: 'shop_owner',
    businessName: 'HIT IN 제휴 건샵',
    businessNumber: '',
    phone: '',
    partnerId: 'shp_01',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ShopPartner&backgroundColor=b6e3f4'
  },
  {
    id: 'usr_hq_default',
    name: '본사 총괄 관리자',
    email: 'admin@hit-in.app',
    role: 'hq_admin',
    businessName: 'HIT IN 본사 운영센터',
    businessNumber: '',
    phone: '',
    partnerId: 'hq_01',
    avatarUrl: 'https://api.dicebear.com/7.x/thumbs/svg?seed=HqPartner&backgroundColor=ffd5dc'
  }
];

// 가상 경기장 데이터 삭제 완료 (신규 등록 및 실제 DB 연동 데이터만 사용)
export const initialFields: FieldInfo[] = [];

// 가상 타임슬롯 데이터 삭제 완료
export const initialTimeSlots: TimeSlot[] = [];

// 가상 고객 예약 리스트 삭제 완료 (실제 예약 데이터만 등록/조회)
export const initialBookings: BookingItem[] = [];

// 가상 플레이어 매너 프로필 삭제 완료
export const initialMannerProfiles: Record<string, PlayerMannerProfile> = {};

// 가상 건샵 렌탈 상품 삭제 완료
export const initialRentalProducts: RentalProduct[] = [];

// 가상 정산 내역 삭제 완료
export const initialSettlements: SettlementRecord[] = [];

// 가상 고객사(입점사) 리스트 삭제 완료
export const initialClientPartners: ClientPartner[] = [];

// 가상 회원 포인트 적립 및 거래 내역 삭제 완료
export const initialPointTransactions: UserPointTransaction[] = [];

// 가상 회원 목록 및 포인트 요약 삭제 완료
export const initialUserPointSummaries: UserPointSummary[] = [];
