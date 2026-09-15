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
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=TeddyCommander&backgroundColor=ffdfbf'
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
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=FoxAgent&backgroundColor=b6e3f4'
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
    avatarUrl: 'https://api.dicebear.com/7.x/thumbs/svg?seed=LionCaptain&backgroundColor=ffd5dc'
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

// ─── 사용자 포인트 및 체크인/후기 적립 Mock 데이터 ───

export const initialPointTransactions: UserPointTransaction[] = [
  {
    id: 'tx_pt_01',
    userId: 'usr_play_01',
    userName: '김민준',
    userNickname: '택티컬고스트',
    userPhone: '010-3819-9921',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=TeddyCommander&backgroundColor=ffdfbf',
    type: 'earn',
    amount: 1000,
    reason: 'qr_checkin',
    description: '플래툰 아레나 경기점 현장 QR 체크인 적립 (1일 1회)',
    partnerId: 'fld_01',
    partnerName: '플래툰 아레나 경기점',
    partnerType: 'field',
    checkInDate: '2026-09-09 13:45',
    targetSlotTitle: '주말 1부 메인 CQB 아레나 정기전',
    createdAt: '2026-09-09 13:45'
  },
  {
    id: 'tx_pt_02',
    userId: 'usr_play_01',
    userName: '김민준',
    userNickname: '택티컬고스트',
    userPhone: '010-3819-9921',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=TeddyCommander&backgroundColor=ffdfbf',
    type: 'earn',
    amount: 500,
    reason: 'review_rating',
    description: '게임 완료 후 팀원 매너 평가 및 후기 작성 적립',
    partnerId: 'fld_01',
    partnerName: '플래툰 아레나 경기점',
    partnerType: 'field',
    reviewRating: 5,
    reviewComment: '필드 엄폐물 배치가 훌륭하고 마샬 분들의 판정이 매우 공정했습니다!',
    targetSlotTitle: '주말 1부 메인 CQB 아레나 정기전',
    createdAt: '2026-09-09 18:20'
  },
  {
    id: 'tx_pt_03',
    userId: 'usr_play_02',
    userName: '이서진',
    userNickname: '델타포스포에버',
    userPhone: '010-7712-4490',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=FoxAgent&backgroundColor=b6e3f4',
    type: 'earn',
    amount: 1000,
    reason: 'qr_checkin',
    description: '건스미스 서울본점 현장 QR 방문 체크인 적립 (1일 1회)',
    partnerId: 'shp_01',
    partnerName: '건스미스 서울본점',
    partnerType: 'shop',
    checkInDate: '2026-09-09 15:10',
    createdAt: '2026-09-09 15:10'
  },
  {
    id: 'tx_pt_04',
    userId: 'usr_play_03',
    userName: '박도현',
    userNickname: '스나이퍼정밀',
    userPhone: '010-9941-2831',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=CatSniper&backgroundColor=c0aede',
    type: 'earn',
    amount: 1000,
    reason: 'qr_checkin',
    description: '플래툰 아레나 경기점 현장 QR 체크인 적립 (1일 1회)',
    partnerId: 'fld_01',
    partnerName: '플래툰 아레나 경기점',
    partnerType: 'field',
    checkInDate: '2026-09-09 14:02',
    targetSlotTitle: '주말 1부 메인 CQB 아레나 정기전',
    createdAt: '2026-09-09 14:02'
  },
  {
    id: 'tx_pt_05',
    userId: 'usr_play_03',
    userName: '박도현',
    userNickname: '스나이퍼정밀',
    userPhone: '010-9941-2831',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=CatSniper&backgroundColor=c0aede',
    type: 'earn',
    amount: 500,
    reason: 'review_rating',
    description: '게임 종료 후 매너 플레이어 평점 작성 완료',
    partnerId: 'fld_01',
    partnerName: '플래툰 아레나 경기점',
    partnerType: 'field',
    reviewRating: 4.8,
    reviewComment: '히트 판정 양심적이고 팀워크가 좋았던 판이었습니다.',
    targetSlotTitle: '주말 1부 메인 CQB 아레나 정기전',
    createdAt: '2026-09-09 17:50'
  },
  {
    id: 'tx_pt_06',
    userId: 'usr_play_04',
    userName: '최유나',
    userNickname: '블랙바이퍼',
    userPhone: '010-4421-9988',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=BunnyLeader&backgroundColor=ffd5dc',
    type: 'earn',
    amount: 1000,
    reason: 'qr_checkin',
    description: '플래툰 아레나 경기점 현장 QR 체크인 적립 (1일 1회)',
    partnerId: 'fld_01',
    partnerName: '플래툰 아레나 경기점',
    partnerType: 'field',
    checkInDate: '2026-09-09 18:30',
    targetSlotTitle: '평일 야간 스트리트 라이트 나이트전',
    createdAt: '2026-09-09 18:30'
  },
  {
    id: 'tx_pt_07',
    userId: 'usr_play_04',
    userName: '최유나',
    userNickname: '블랙바이퍼',
    userPhone: '010-4421-9988',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=BunnyLeader&backgroundColor=ffd5dc',
    type: 'earn',
    amount: 500,
    reason: 'review_rating',
    description: '야간전 게임 매너 평가 및 경기장 피드백 작성',
    partnerId: 'fld_01',
    partnerName: '플래툰 아레나 경기점',
    partnerType: 'field',
    reviewRating: 5,
    reviewComment: '야간 조명 연출이 몰입감 넘쳤습니다!',
    targetSlotTitle: '평일 야간 스트리트 라이트 나이트전',
    createdAt: '2026-09-09 21:10'
  }
];

export const initialUserPointSummaries: UserPointSummary[] = [
  {
    userId: 'usr_play_01',
    userName: '김민준',
    userNickname: '택티컬고스트',
    phone: '010-3819-9921',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=TeddyCommander&backgroundColor=ffdfbf',
    totalPoints: 8500,
    qrCheckInCount: 6,
    lastQrCheckInDate: '2026-09-09 13:45',
    todayQrCheckedIn: true,
    reviewsWrittenCount: 5,
    mannerScore: 4.9,
    recentTransactions: [initialPointTransactions[0], initialPointTransactions[1]]
  },
  {
    userId: 'usr_play_02',
    userName: '이서진',
    userNickname: '델타포스포에버',
    phone: '010-7712-4490',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=FoxAgent&backgroundColor=b6e3f4',
    totalPoints: 4200,
    qrCheckInCount: 3,
    lastQrCheckInDate: '2026-09-09 15:10',
    todayQrCheckedIn: true,
    reviewsWrittenCount: 2,
    mannerScore: 4.8,
    recentTransactions: [initialPointTransactions[2]]
  },
  {
    userId: 'usr_play_03',
    userName: '박도현',
    userNickname: '스나이퍼정밀',
    phone: '010-9941-2831',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=CatSniper&backgroundColor=c0aede',
    totalPoints: 6500,
    qrCheckInCount: 4,
    lastQrCheckInDate: '2026-09-09 14:02',
    todayQrCheckedIn: true,
    reviewsWrittenCount: 4,
    mannerScore: 4.7,
    recentTransactions: [initialPointTransactions[3], initialPointTransactions[4]]
  },
  {
    userId: 'usr_play_04',
    userName: '최유나',
    userNickname: '블랙바이퍼',
    phone: '010-4421-9988',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=BunnyLeader&backgroundColor=ffd5dc',
    totalPoints: 12000,
    qrCheckInCount: 9,
    lastQrCheckInDate: '2026-09-09 18:30',
    todayQrCheckedIn: true,
    reviewsWrittenCount: 8,
    mannerScore: 5.0,
    recentTransactions: [initialPointTransactions[5], initialPointTransactions[6]]
  },
  {
    userId: 'usr_play_05',
    userName: '한상우',
    userNickname: '레인저캡틴',
    phone: '010-6623-1192',
    avatarUrl: 'https://api.dicebear.com/7.x/thumbs/svg?seed=ShibaGunner&backgroundColor=ffdfbf',
    totalPoints: 3500,
    qrCheckInCount: 2,
    lastQrCheckInDate: '2026-09-08 11:20',
    todayQrCheckedIn: false,
    reviewsWrittenCount: 3,
    mannerScore: 4.6,
    recentTransactions: []
  }
];

