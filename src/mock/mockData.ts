import { 
  FieldInfo, 
  TimeSlot, 
  BookingItem, 
  PlayerMannerProfile, 
  RentalProduct, 
  SettlementRecord, 
  ClientPartner,
  PartnerUser
} from '../types';

export const initialPartnerUsers: PartnerUser[] = [
  {
    id: 'usr_field_01',
    name: '김태식 대표',
    email: 'field_manager@platoon.kr',
    role: 'field_owner',
    businessName: '플래툰 아레나 경기점',
    businessNumber: '124-86-90123',
    phone: '010-8921-4432',
    partnerId: 'fld_01',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_shop_01',
    name: '박성호 실장',
    email: 'contact@gunsmith.co.kr',
    role: 'shop_owner',
    businessName: '건스미스 서울본점',
    businessNumber: '211-81-55420',
    phone: '010-3329-8812',
    partnerId: 'shp_01',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_hq_admin',
    name: '최민준 총괄팀장',
    email: 'admin@hit-in.app',
    role: 'hq_admin',
    businessName: 'HIT IN 본사 운영센터',
    businessNumber: '107-88-03912',
    phone: '02-555-8910',
    partnerId: 'hq_01',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
  }
];

export const initialFields: FieldInfo[] = [
  {
    id: 'fld_01',
    name: '플래툰 아레나 경기 광주점',
    region: '경기 광주',
    address: '경기도 광주시 오포읍 태재로 142 플래툰 텍티컬 아레나',
    tel: '031-764-8890',
    coverImage: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&auto=format&fit=crop&q=80',
    capacity: 60,
    surfaceType: 'CQB 실내 3층 구조 + 1,200평 야외 숲 산악 필드',
    maxFps: 350,
    rules: [
      '0.2g BB탄 기준 최대 350 FPS 엄수 (현장 크로노그래프 전원 측정)',
      '풀페이스 마스크 또는 고글+하프 메쉬 마스크 착용 필수',
      '세이프티 존 내 탄창 결합 및 격발 절대 금지 (적발 시 즉시 퇴장)',
      '히트콜 및 매너 플레이 준수, 비신사적 언행 적발 시 영구 밴'
    ],
    amenities: ['냉난방 휴게실', '무료 크로노그래프', '샤워실/탈의실', 'HPA 고압 충전기', '전용 주차 50대', '식음료 자판기'],
    isOpenToday: true,
    linkedShopNames: ['건스미스 서울본점', '알파 택티컬 기어']
  },
  {
    id: 'fld_02',
    name: '블랙옵스 CQB 김포점',
    region: '경기 김포',
    address: '경기도 김포시 양촌읍 황금로 88-12',
    tel: '031-987-1234',
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    capacity: 40,
    surfaceType: '도심형 실내 킬하우스 & 컨테이너 미로 CQB',
    maxFps: 330,
    rules: [
      '단발(Semi-Auto) 사격 전용 필드',
      '트레이서 및 발광탄 사용 권장',
      '근거리 뱅(Bang) 룰 적용'
    ],
    amenities: ['CCTV 관람석', '전술 충전 스테이션', '개인 락커룸', '주차 30대'],
    isOpenToday: true,
    linkedShopNames: ['건스미스 서울본점']
  }
];

export const initialTimeSlots: TimeSlot[] = [
  {
    id: 'slt_01',
    fieldId: 'fld_01',
    date: '2026-09-09',
    startTime: '10:00',
    endTime: '13:00',
    title: '오전 CQB & 야외 정기전 (1부)',
    gameType: '주말 정기전',
    maxPlayers: 40,
    currentPlayers: 0,
    pricePerPerson: 35000,
    status: 'open',
    notes: '브리핑 09:40 시작'
  },
  {
    id: 'slt_02',
    fieldId: 'fld_01',
    date: '2026-09-09',
    startTime: '14:00',
    endTime: '18:00',
    title: '오후 스피드CQB + 시나리오전 (2부)',
    gameType: '밀심(Milsim) 특별전',
    maxPlayers: 50,
    currentPlayers: 0,
    pricePerPerson: 40000,
    status: 'open',
    notes: '무전기 채널 5번 통일, 연막탄 사용 가능'
  },
  {
    id: 'slt_03',
    fieldId: 'fld_01',
    date: '2026-09-09',
    startTime: '19:00',
    endTime: '22:00',
    title: '평일 퇴근길 나이트 트레이서전',
    gameType: '평일 야간전',
    maxPlayers: 30,
    currentPlayers: 0,
    pricePerPerson: 30000,
    status: 'open',
    notes: '트레이서 발광탄 장착 필수'
  }
];

// 가상 고객 예약 리스트 삭제 완료 (실제 예약 데이터만 등록/조회)
export const initialBookings: BookingItem[] = [];

// 가상 플레이어 매너 프로필 삭제 완료
export const initialMannerProfiles: Record<string, PlayerMannerProfile> = {};

export const initialRentalProducts: RentalProduct[] = [
  {
    id: 'p_01',
    shopId: 'shp_01',
    name: 'VFC HK416A5 Gen3 GBBR 풀세트',
    category: 'gbbr',
    totalStock: 15,
    rentedCount: 0,
    rentalPrice: 25000,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=600&auto=format&fit=crop&q=80',
    spec: '가스 블로우백, 가변 홉업, 탄창 2개 + 가스 1캔 포함',
    targetFields: ['fld_01', 'fld_02']
  },
  {
    id: 'p_02',
    shopId: 'shp_01',
    name: '도쿄마루이 M4A1 MWS ZET System GBB',
    category: 'gbbr',
    totalStock: 10,
    rentedCount: 0,
    rentalPrice: 30000,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1584281722572-881c3d18ba22?w=600&auto=format&fit=crop&q=80',
    spec: '최고의 작동성과 집탄성, 도트사이트 기본 세팅',
    targetFields: ['fld_01']
  },
  {
    id: 'p_03',
    shopId: 'shp_01',
    name: 'Dye i5 써멀 렌즈 풀페이스 마스크',
    category: 'protection',
    totalStock: 30,
    rentedCount: 0,
    rentalPrice: 10000,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    spec: '김서림 0% 안티포그 렌즈, 귀·턱 완벽 보호',
    targetFields: ['fld_01', 'fld_02']
  },
  {
    id: 'p_04',
    shopId: 'shp_01',
    name: 'HIT-IN 0.2g 정밀 바이오 BB탄 (4000발)',
    category: 'ammo_gas',
    totalStock: 120,
    rentedCount: 0,
    rentalPrice: 15000,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=600&auto=format&fit=crop&q=80',
    spec: '자연분해 친환경 PLA 재질, 5.95mm ± 0.01mm 정밀도',
    targetFields: ['fld_01', 'fld_02']
  }
];

export const initialSettlements: SettlementRecord[] = [];

// 가상 고객사(입점사) 리스트 삭제 완료 (실제 입점 파트너만 관리)
export const initialClientPartners: ClientPartner[] = [];
