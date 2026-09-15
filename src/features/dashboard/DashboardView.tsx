import React, { useMemo } from 'react';
import { 
  Users, 
  CalendarCheck2, 
  DollarSign, 
  TrendingUp, 
  QrCode, 
  PlusCircle, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight, 
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Coins
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { usePartner } from '../../context/PartnerContext';
import { PartnerService } from '../../services/partnerService';
import { TimeSlot, BookingItem } from '../../types';

interface DashboardViewProps {
  onOpenQuickCheckIn: () => void;
  onOpenAddSlot: () => void;
  onOpenAddProduct: () => void;
  onInspectPlayer: (userId: string) => void;
}

const HOURLY_TRAFFIC_DATA = [
  { time: '09:00', players: 12, capacity: 60 },
  { time: '10:00', players: 38, capacity: 60 },
  { time: '11:00', players: 40, capacity: 60 },
  { time: '12:00', players: 36, capacity: 60 },
  { time: '13:00', players: 20, capacity: 60 },
  { time: '14:00', players: 50, capacity: 60 },
  { time: '15:00', players: 50, capacity: 60 },
  { time: '16:00', players: 48, capacity: 60 },
  { time: '17:00', players: 45, capacity: 60 },
  { time: '18:00', players: 22, capacity: 60 },
  { time: '19:00', players: 18, capacity: 60 },
  { time: '20:00', players: 28, capacity: 60 }
];

const WEEKLY_REVENUE_DATA = [
  { day: '월 (09.03)', sales: 980000 },
  { day: '화 (09.04)', sales: 1240000 },
  { day: '수 (09.05)', sales: 1850000 },
  { day: '목 (09.06)', sales: 1420000 },
  { day: '금 (09.07)', sales: 3200000 },
  { day: '토 (09.08)', sales: 6800000 },
  { day: '일 (09.09)', sales: 7450000 }
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenQuickCheckIn,
  onOpenAddSlot,
  onOpenAddProduct,
  onInspectPlayer
}) => {
  const { role, user, setActiveTab, showToast } = usePartner();

  const slots = useMemo(() => PartnerService.getSlots(role === 'field_owner' ? user.partnerId : undefined), [user.partnerId, role]);
  const bookings = useMemo(() => PartnerService.getBookings(role === 'field_owner' ? user.partnerId : undefined), [user.partnerId, role]);
  const products = useMemo(() => PartnerService.getProducts(role === 'shop_owner' ? user.partnerId : undefined), [user.partnerId, role]);
  const clients = useMemo(() => PartnerService.getClients(), []);

  // Compute stats
  const totalBookedPlayersToday = bookings.reduce((sum, b) => sum + b.playerCount, 0);
  const checkedInCount = bookings.filter(b => b.checkInStatus === 'checked_in').length;
  const pendingCount = bookings.filter(b => b.checkInStatus === 'pending').length;
  const todayRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const estimatedPayout = Math.round(todayRevenue * 0.92);

  return (
    <div className="page-scrollable">
      {/* Top Banner / Greeting */}
      <div className="flex-responsive-banner" style={{
        background: 'linear-gradient(135deg, var(--hero-bg) 0%, var(--card) 100%)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-xl)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-lime">정상 영업 중</span>
            <span style={{ fontSize: '13px', color: 'var(--mut)' }}>
              2026년 9월 9일 (수) 실시간 운영 현황
            </span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--txt)', marginTop: '6px' }}>
            {user.businessName} 관제 센터
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--mut)', marginTop: '4px' }}>
            오늘 총 <strong style={{ color: 'var(--acc)' }}>{totalBookedPlayersToday}명</strong>의 플레이어가 예약되어 있으며, 
            체크인 완료율은 <strong style={{ color: 'var(--green)' }}>{bookings.length > 0 ? Math.round((checkedInCount / bookings.length) * 100) : 0}%</strong>입니다.
          </p>
        </div>

        {/* Quick Action Group (HQ Admin Only) */}
        {role === 'hq_admin' && (
          <div style={{ display: 'flex', gap: '10px', zIndex: 1, flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={() => setActiveTab('user_points')}>
              <Coins size={16} />
              전체 포인트 현황
            </button>
            <button className="btn btn-lime" onClick={() => setActiveTab('hq_clients')}>
              <Sparkles size={16} />
              입점 심사 대기 ({clients.filter(c => c.status === 'pending_approval').length}건)
            </button>
          </div>
        )}
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid-responsive-cards">
        {/* Card 1: Today Players / Bookings */}
        <div className="card-panel card-panel-accent">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--mut)' }}>오늘 입장 예약 인원</span>
            <Users size={20} color="var(--acc)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
            <span className="mono-font" style={{ fontSize: '28px', fontWeight: 900, color: 'var(--txt)' }}>
              {totalBookedPlayersToday}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--mut)' }}>/ 120명 수용</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '12px', color: 'var(--green)' }}>
            <TrendingUp size={14} />
            <span>지난주 대비 +18.4% 점유율 상승</span>
          </div>
        </div>

        {/* Card 2: Check-in Progress */}
        <div className="card-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--mut)' }}>현장 체크인 현황</span>
            <CalendarCheck2 size={20} color="var(--green)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
            <span className="mono-font" style={{ fontSize: '28px', fontWeight: 900, color: 'var(--green)' }}>
              {checkedInCount}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--mut)' }}>건 완료 ({pendingCount}건 대기)</span>
          </div>
          <div style={{ marginTop: '8px', height: '6px', background: 'var(--card2)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${bookings.length > 0 ? (checkedInCount / bookings.length) * 100 : 0}%`, 
                height: '100%', 
                backgroundColor: 'var(--green)',
                borderRadius: 'var(--radius-pill)'
              }} 
            />
          </div>
        </div>

        {/* Card 3: Today Gross Revenue */}
        <div className="card-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--mut)' }}>당일 발생 매출 합계</span>
            <DollarSign size={20} color="var(--warn)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
            <span className="mono-font" style={{ fontSize: '24px', fontWeight: 900, color: 'var(--txt)' }}>
              {todayRevenue.toLocaleString()}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--mut)' }}>원</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--mut)', marginTop: '8px' }}>
            예상 순정산액(8% 공제): <strong style={{ color: 'var(--txt)' }}>{estimatedPayout.toLocaleString()}원</strong>
          </div>
        </div>

        {/* Card 4: Manner / Safety Rating */}
        <div className="card-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--mut)' }}>구장 매너 지수 및 평점</span>
            <ShieldCheck size={20} color="var(--lime-text)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
            <span className="mono-font" style={{ fontSize: '28px', fontWeight: 900, color: 'var(--lime-text)' }}>
              4.92
            </span>
            <span style={{ fontSize: '13px', color: 'var(--mut)' }}>/ 5.0 (클린 필드 1등급)</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--mut)', marginTop: '8px' }}>
            현장 노쇼율: <strong style={{ color: 'var(--green)' }}>0.8% (극소)</strong>
          </div>
        </div>
      </div>

      {/* Middle Section: Live Slots & Charts Grid */}
      <div className="grid-responsive-2col">
        {/* Left: Hourly Traffic & Slot Occupancy Chart */}
        <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--txt)' }}>
                시간대별 실시간 플레이어 수용 및 점유율
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--mut)' }}>
                09:00 ~ 21:00 타임슬롯별 게임 참가자 트래픽 추이
              </div>
            </div>
            <span className="badge badge-outline">실시간 업데이트</span>
          </div>

          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_TRAFFIC_DATA}>
                <defs>
                  <linearGradient id="playerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--acc)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--acc)" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                <XAxis dataKey="time" stroke="var(--dim)" fontSize={11} />
                <YAxis stroke="var(--dim)" fontSize={11} domain={[0, 60]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderColor: 'var(--line)', 
                    borderRadius: '8px',
                    color: 'var(--txt)'
                  }} 
                />
                <Area type="monotone" dataKey="players" stroke="var(--acc)" strokeWidth={2} fillOpacity={1} fill="url(#playerGrad)" name="참가 인원(명)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Weekly Revenue Trend */}
        <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--txt)' }}>
                주간 일별 매출 추이
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--mut)' }}>
                이번 주 누적 매출: 22,940,000원
              </div>
            </div>
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => setActiveTab('settlement')}
              style={{ fontSize: '12px', padding: '4px 8px' }}
            >
              정산 상세 <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                <XAxis dataKey="day" stroke="var(--dim)" fontSize={10} tickFormatter={v => v.slice(0, 1)} />
                <YAxis stroke="var(--dim)" fontSize={10} tickFormatter={v => `${(v / 10000).toFixed(0)}만`} />
                <Tooltip 
                  formatter={(v: any) => [`${Number(v).toLocaleString()}원`, '매출']}
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderColor: 'var(--line)', 
                    borderRadius: '8px',
                    color: 'var(--txt)'
                  }} 
                />
                <Bar dataKey="sales" fill="var(--lime-chip)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section: Today's Slots & Fast Attendee Queue */}
      <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--txt)' }}>
              오늘 게임 타임슬롯 진행 상황
            </h3>
            <div style={{ fontSize: '12px', color: 'var(--mut)' }}>
              각 슬롯별 예약 정원 충족률 및 현장 체크인 바로가기
            </div>
          </div>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('bookings')}
          >
            슬롯 전체 보기 <ArrowUpRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
          {slots.slice(0, 3).map(slot => {
            const ratio = Math.round((slot.currentPlayers / slot.maxPlayers) * 100);
            const isFull = slot.status === 'full' || ratio >= 100;
            const isInProgress = slot.status === 'in_progress';

            return (
              <div 
                key={slot.id}
                style={{
                  background: 'var(--panel)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  borderLeft: isInProgress ? '4px solid var(--green)' : isFull ? '4px solid var(--danger)' : '4px solid var(--acc)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge badge-outline" style={{ fontSize: '10px', marginBottom: '4px' }}>
                      {slot.gameType}
                    </span>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--txt)' }}>
                      {slot.title}
                    </h4>
                  </div>
                  <span className={`badge ${isInProgress ? 'badge-success' : isFull ? 'badge-danger' : 'badge-orange'}`} style={{ fontSize: '11px' }}>
                    {isInProgress ? '게임 진행중' : isFull ? '예약 마감' : '모집중'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--mut)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} />
                    <span className="mono-font">{slot.startTime} ~ {slot.endTime}</span>
                  </div>
                  <div>•</div>
                  <div>
                    1인 <span className="mono-font" style={{ fontWeight: 700, color: 'var(--txt)' }}>{slot.pricePerPerson.toLocaleString()}원</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--mut)' }}>예약 충원률 ({ratio}%)</span>
                    <span className="mono-font" style={{ fontWeight: 700, color: isFull ? 'var(--danger)' : 'var(--txt)' }}>
                      {slot.currentPlayers} / {slot.maxPlayers}명
                    </span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--card2)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${Math.min(100, ratio)}%`, 
                        height: '100%', 
                        backgroundColor: isFull ? 'var(--danger)' : 'var(--acc)' 
                      }} 
                    />
                  </div>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveTab('checkin')}
                  style={{ width: '100%', marginTop: '4px' }}
                >
                  <QrCode size={14} />
                  이 슬롯 체크인 데스크 열기
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
