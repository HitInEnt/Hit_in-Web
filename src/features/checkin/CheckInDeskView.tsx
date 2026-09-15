import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  QrCode, 
  Search, 
  CheckCircle2, 
  UserX, 
  Clock, 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Package, 
  Sparkles, 
  Camera, 
  RotateCcw,
  Zap,
  TrendingUp,
  Activity,
  Award,
  AlertCircle,
  Smartphone,
  Check,
  Coins
} from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';
import { PartnerService } from '../../services/partnerService';
import { BookingItem, TimeSlot } from '../../types';

interface CheckInDeskViewProps {
  onInspectPlayer: (userId: string) => void;
}

export const CheckInDeskView: React.FC<CheckInDeskViewProps> = ({ onInspectPlayer }) => {
  const { user, showToast, triggerRefresh, refreshKey } = usePartner();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [selectedSlotFilter, setSelectedSlotFilter] = useState<string>('all');
  const [qrInputCode, setQrInputCode] = useState<string>('');
  const [lastCheckedInUser, setLastCheckedInUser] = useState<{ name: string; nickname: string; time: string; count: number } | null>(null);
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);

  // Auto Polling & Storage Sync every 2.5s
  useEffect(() => {
    const handleStorageChange = () => {
      triggerRefresh();
    };
    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(() => {
      triggerRefresh();
    }, 2500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [triggerRefresh]);

  // Load Bookings & Slots
  const bookings = useMemo(() => {
    return PartnerService.getBookings(user.partnerId);
  }, [user.partnerId, refreshKey]);

  const slots = useMemo(() => {
    return PartnerService.getSlots(user.partnerId);
  }, [user.partnerId, refreshKey]);

  // Slot Filtering
  const slotFilteredBookings = useMemo(() => {
    if (selectedSlotFilter === 'all') return bookings;
    return bookings.filter(b => b.slotId === selectedSlotFilter);
  }, [bookings, selectedSlotFilter]);

  // Search Filtering
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return slotFilteredBookings;
    const q = searchTerm.toLowerCase();
    return slotFilteredBookings.filter(b => 
      b.bookingNumber.toLowerCase().includes(q) ||
      b.bookerName.toLowerCase().includes(q) ||
      b.bookerNickname.toLowerCase().includes(q) ||
      b.bookerPhone.includes(q)
    );
  }, [slotFilteredBookings, searchTerm]);

  const checkedInList = useMemo(() => filtered.filter(b => b.checkInStatus === 'checked_in'), [filtered]);
  const pendingList = useMemo(() => filtered.filter(b => b.checkInStatus === 'pending'), [filtered]);

  // Player count statistics
  const totalBookedPlayerCount = useMemo(() => {
    return slotFilteredBookings.reduce((sum, b) => sum + (b.playerCount || 1), 0);
  }, [slotFilteredBookings]);

  const checkedInPlayerCount = useMemo(() => {
    return slotFilteredBookings
      .filter(b => b.checkInStatus === 'checked_in')
      .reduce((sum, b) => sum + (b.playerCount || 1), 0);
  }, [slotFilteredBookings]);

  const pendingPlayerCount = totalBookedPlayerCount - checkedInPlayerCount;
  const admissionRate = totalBookedPlayerCount > 0 ? Math.round((checkedInPlayerCount / totalBookedPlayerCount) * 100) : 0;

  // Execute Check-In & Auto Point Grant
  const handleCheckIn = (bookingId: string) => {
    const updated = PartnerService.updateCheckInStatus(bookingId, 'checked_in');
    if (updated) {
      const nowStr = new Date().toTimeString().slice(0, 8);
      const newCount = checkedInPlayerCount + (updated.playerCount || 1);
      
      setLastCheckedInUser({
        name: updated.bookerName,
        nickname: updated.bookerNickname,
        time: nowStr,
        count: newCount
      });

      showToast(`🔔 [${updated.bookerName}]님 QR 등록 완료! 현장 입장 카운팅 (+1,000 P 적립)`, 'success');
      triggerRefresh();
      
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(updated);
      }
    }
  };

  const handleNoShow = (bookingId: string) => {
    if (window.confirm('해당 예약자를 노쇼 처리하시겠습니까?')) {
      const updated = PartnerService.updateCheckInStatus(bookingId, 'no_show');
      triggerRefresh();
      showToast('노쇼 처리되었습니다.', 'warning');
      if (selectedBooking?.id === bookingId && updated) {
        setSelectedBooking(updated);
      }
    }
  };

  // QR Barcode Reader Fast Submission
  const handleQrInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrInputCode.trim()) return;

    const query = qrInputCode.trim().toLowerCase();
    const target = pendingList.find(b => 
      b.bookingNumber.toLowerCase().includes(query) ||
      b.bookerPhone.includes(query) ||
      b.bookerName.toLowerCase().includes(query) ||
      b.id.toLowerCase().includes(query)
    );

    if (target) {
      handleCheckIn(target.id);
      setQrInputCode('');
    } else {
      showToast(`일치하는 대기 예약자(${qrInputCode})를 찾을 수 없습니다.`, 'warning');
    }
  };

  // Simulate User Mobile QR Scan
  const handleSimulateMobileQrScan = () => {
    if (pendingList.length === 0) {
      showToast('현재 체크인 대기 중인 예약자가 없습니다. 모든 예약자가 이미 입장 완료되었습니다.', 'info');
      return;
    }

    // Pick the first pending booking and simulate instant QR scan
    const nextUser = pendingList[0];
    handleCheckIn(nextUser.id);
  };

  return (
    <div className="page-scrollable">
      {/* Top Header Live Admission Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(20, 20, 20, 0.95) 100%)',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px 24px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '20px',
              backgroundColor: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              color: '#22c55e',
              fontSize: '11px',
              fontWeight: '800'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                boxShadow: '0 0 8px #22c55e'
              }} className="pulse-active" />
              LIVE 실시간 자동 카운팅 활성화
            </span>
            <span style={{ fontSize: '13px', color: 'var(--mut)' }}>
              사용자 모바일 QR 스캔 시 1초 내 즉시 입장 및 포인트 자동 반영
            </span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--txt)', marginTop: '6px', marginBottom: '4px' }}>
            실시간 현장입장 & 게이트 관제 데스크
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
            각 사용자가 현장에서 QR을 등록하면 입장 인원이 <strong>자동으로 카운팅</strong>되며, <strong>1일 1회 +1,000 P</strong>가 자동 지급됩니다.
          </p>
        </div>

        {/* Quick Simulator & QR fast input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <form onSubmit={handleQrInputSubmit} style={{ display: 'flex', gap: '6px' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <QrCode size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#22c55e' }} />
              <input
                type="text"
                className="input-field"
                placeholder="QR코드 / 예약번호 입력..."
                value={qrInputCode}
                onChange={e => setQrInputCode(e.target.value)}
                style={{ paddingLeft: '32px', height: '36px', fontSize: '12px' }}
              />
            </div>
            <button type="submit" className="btn btn-secondary" style={{ height: '36px', fontSize: '12px', padding: '0 12px' }}>
              스캔
            </button>
          </form>

          <button 
            className="btn btn-lime"
            onClick={handleSimulateMobileQrScan}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', height: '36px', padding: '0 14px' }}
          >
            <Smartphone size={16} />
            모바일 QR 입장 시뮬레이션 (+1명 자동등록)
          </button>
        </div>
      </div>

      {/* 4 Real-time Live Admission Metric Cards */}
      <div className="grid-responsive-cards" style={{ marginBottom: '20px' }}>
        {/* Card 1: Live Checked In Count */}
        <div className="card" style={{ padding: '18px', border: '1px solid rgba(34, 197, 94, 0.4)', background: 'rgba(34, 197, 94, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#22c55e' }}>실시간 입장 완료 (QR 카운트)</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(34, 197, 94, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#22c55e'
            }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '30px', fontWeight: '900', color: '#22c55e' }}>
              {checkedInPlayerCount}
            </span>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              / {totalBookedPlayerCount}명 입장 ({admissionRate}%)
            </span>
          </div>
          {/* Progress Bar */}
          <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${admissionRate}%`,
              height: '100%',
              backgroundColor: '#22c55e',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Card 2: Pending Count */}
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>현장 입장 대기 인원</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b'
            }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
            {pendingPlayerCount} <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)' }}>명</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            총 {pendingList.length}건 예약 대기 중
          </div>
        </div>

        {/* Card 3: Total Booked Capacity */}
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>오늘 전체 예약 인원</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6'
            }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
            {totalBookedPlayerCount} <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)' }}>명</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {slots.length}개 타임슬롯 전체 합계
          </div>
        </div>

        {/* Card 4: Automatic Points Awarded */}
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>QR 체크인 자동 지급 포인트</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(234, 88, 12, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}>
              <Coins size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
            +{(checkedInPlayerCount * 1000).toLocaleString()} <span style={{ fontSize: '14px', fontWeight: '500' }}>P</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            1인 1일 1회 (+1,000 P) 자동 적립 누적
          </div>
        </div>
      </div>

      {/* Live Feedback Toast Banner if recently checked in */}
      {lastCheckedInUser && (
        <div style={{
          padding: '12px 18px',
          backgroundColor: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid rgba(34, 197, 94, 0.4)',
          borderRadius: '10px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={18} color="#22c55e" />
            <span style={{ fontSize: '13px', color: '#fff' }}>
              방금 QR 입장 완료: <strong>{lastCheckedInUser.name} ({lastCheckedInUser.nickname})</strong> ({lastCheckedInUser.time})
            </span>
            <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(34, 197, 94, 0.3)', color: '#22c55e', fontWeight: '700' }}>
              +1,000 P 적립
            </span>
          </div>
          <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '700' }}>
            실시간 입장 누적: {lastCheckedInUser.count}명
          </span>
        </div>
      )}

      {/* Slot Breakdown Selector & Live Counters */}
      <div className="card" style={{ padding: '14px 18px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              타임슬롯별 현황:
            </span>
            <button
              onClick={() => setSelectedSlotFilter('all')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedSlotFilter === 'all' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: selectedSlotFilter === 'all' ? '#000' : 'var(--text-muted)'
              }}
            >
              전체 슬롯 ({checkedInPlayerCount}/{totalBookedPlayerCount}명)
            </button>
            {slots.map(s => {
              const slotBookings = bookings.filter(b => b.slotId === s.id);
              const slotCheckedIn = slotBookings.filter(b => b.checkInStatus === 'checked_in').reduce((sum, b) => sum + (b.playerCount || 1), 0);
              const slotTotal = slotBookings.reduce((sum, b) => sum + (b.playerCount || 1), 0);
              const isSelected = selectedSlotFilter === s.id;

              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSlotFilter(s.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: '1px solid var(--line)',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    color: isSelected ? '#000' : 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{s.startTime}~{s.endTime} {s.title}</span>
                  <span style={{
                    padding: '1px 5px',
                    borderRadius: '4px',
                    backgroundColor: isSelected ? 'rgba(0,0,0,0.2)' : 'rgba(34,197,94,0.15)',
                    color: isSelected ? '#000' : '#22c55e',
                    fontSize: '11px',
                    fontWeight: '700'
                  }}>
                    {slotCheckedIn}/{slotTotal}명
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="예약번호, 닉네임, 연락처 검색..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '32px', height: '36px', fontSize: '12px' }}
            />
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid-responsive-2col">
        {/* Left Column: Real-time Attendee Queue & Checked In List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Section 1: Pending Check-in Section */}
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="var(--warn)" />
                <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--txt)' }}>
                  실시간 입장 대기 명단 ({pendingList.length}건 / {pendingPlayerCount}명)
                </h3>
              </div>
              <span className="badge badge-warning">QR 미등록 (대기중)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '360px', overflowY: 'auto' }}>
              {pendingList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  <CheckCircle2 size={32} color="#22c55e" style={{ margin: '0 auto 8px auto', display: 'block', opacity: 0.6 }} />
                  현재 대기 중인 예약자가 없습니다. (모두 입장 완료됨)
                </div>
              ) : (
                pendingList.map(b => {
                  const isSelected = selectedBooking?.id === b.id;
                  const hasWarning = b.playerReportCount > 0;

                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        background: isSelected ? 'var(--card2)' : 'var(--panel)',
                        border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--line)'}`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--txt)' }}>
                            {b.bookerName}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600' }}>
                            ({b.bookerNickname})
                          </span>
                          {b.isFirstTimer && (
                            <span className="badge badge-lime" style={{ fontSize: '10px', padding: '1px 5px' }}>
                              신규
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--mut)', marginTop: '4px' }}>
                          <span className="mono-font" style={{ color: 'var(--primary)', fontWeight: 700 }}>{b.bookingNumber}</span>
                          {' · '}{b.slotTitle.slice(0, 16)}... ({b.playerCount}명)
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onInspectPlayer(b.bookerUserId);
                          }}
                          className="badge badge-outline"
                          style={{
                            cursor: 'pointer',
                            fontSize: '11px',
                            color: b.playerMannerScore >= 4.5 ? 'var(--lime-text)' : 'var(--danger)',
                            borderColor: b.playerMannerScore >= 4.5 ? 'var(--lime-chip)' : 'var(--danger)'
                          }}
                          title="매너 프로필 조회"
                        >
                          {hasWarning ? <ShieldAlert size={12} color="var(--danger)" /> : <ShieldCheck size={12} color="var(--lime-text)" />}
                          ★ {b.playerMannerScore.toFixed(2)}
                        </button>

                        <button
                          className="btn btn-lime btn-sm"
                          style={{ padding: '6px 12px', fontWeight: '700' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCheckIn(b.id);
                          }}
                        >
                          <CheckCircle2 size={14} /> 입장 (+1000P)
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Section 2: Real-time Checked-in List */}
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#22c55e" />
                <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--txt)' }}>
                  실시간 입장 완료 목록 ({checkedInList.length}건 / {checkedInPlayerCount}명)
                </h3>
              </div>
              <span className="badge badge-success" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}>
                QR 등록 완료
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
              {checkedInList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '12px' }}>
                  아직 입장 완료된 예약자가 없습니다.
                </div>
              ) : (
                checkedInList.map(b => (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBooking(b)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--panel)',
                      border: '1px solid var(--line)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      opacity: 0.9
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--txt)' }}>
                        {b.bookerName} ({b.bookerNickname}) - {b.playerCount}명
                      </span>
                      <div style={{ fontSize: '11px', color: 'var(--dim)', marginTop: '2px' }}>
                        {b.slotTitle.slice(0, 20)}...
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: '700' }}>
                        +1,000P 적립
                      </span>
                      <span className="badge badge-success" style={{ fontSize: '11px' }}>
                        {b.checkInTime || '입장완료'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Attendee Detail & Inspection */}
        <div className="card" style={{ padding: '18px', height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--txt)' }}>
              플레이어 게이트 검증 정보
            </h3>
            {selectedBooking && (
              <span className="mono-font" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                {selectedBooking.bookingNumber}
              </span>
            )}
          </div>

          {selectedBooking ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Profile Card */}
              <div style={{
                background: 'var(--card2)',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--txt)' }}>
                    {selectedBooking.bookerName} ({selectedBooking.bookerNickname})
                  </div>
                  <div className="mono-font" style={{ fontSize: '12px', color: 'var(--mut)', marginTop: '2px' }}>
                    {selectedBooking.bookerPhone} · {selectedBooking.playerCount}명 입장
                  </div>
                </div>

                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => onInspectPlayer(selectedBooking.bookerUserId)}
                >
                  매너 기록 조회
                </button>
              </div>

              {/* Manner & Safety Status */}
              <div style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: selectedBooking.playerMannerScore >= 4.5 ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255, 77, 79, 0.12)',
                border: `1px solid ${selectedBooking.playerMannerScore >= 4.5 ? 'rgba(34, 197, 94, 0.3)' : 'var(--danger)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--mut)', fontWeight: 600 }}>매너 평가 점수</div>
                  <div className="mono-font" style={{ fontSize: '20px', fontWeight: 900, color: selectedBooking.playerMannerScore >= 4.5 ? '#22c55e' : 'var(--danger)' }}>
                    ★ {selectedBooking.playerMannerScore.toFixed(2)} / 5.0
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'var(--mut)' }}>누적 신고/사고</div>
                  <div className="mono-font" style={{ fontSize: '14px', fontWeight: 700, color: selectedBooking.playerReportCount > 0 ? 'var(--danger)' : '#22c55e' }}>
                    {selectedBooking.playerReportCount}건
                  </div>
                </div>
              </div>

              {/* Rental Items Checklist */}
              {selectedBooking.rentalOrders.length > 0 && (
                <div style={{
                  background: 'var(--panel)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--line)'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--txt)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Package size={14} color="var(--primary)" />
                    현장 렌탈 장비 지급 체크리스트
                  </div>
                  {selectedBooking.rentalOrders.map((r, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', padding: '4px 0', borderBottom: '1px dashed var(--line)' }}>
                      <span style={{ color: 'var(--txt)' }}>• {r.productName}</span>
                      <span className="mono-font" style={{ fontWeight: 800, color: 'var(--primary)' }}>{r.quantity}개 수령</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                {selectedBooking.checkInStatus !== 'checked_in' ? (
                  <button 
                    className="btn btn-lime" 
                    style={{ flex: 1, fontWeight: '700', fontSize: '14px' }}
                    onClick={() => handleCheckIn(selectedBooking.id)}
                  >
                    <CheckCircle2 size={16} />
                    입장 확인 및 +1,000P 적립
                  </button>
                ) : (
                  <button className="btn btn-secondary" style={{ flex: 1 }} disabled>
                    <CheckCircle2 size={16} color="#22c55e" />
                    {selectedBooking.checkInTime} 입장완료됨 (+1,000P)
                  </button>
                )}

                <button 
                  className="btn btn-secondary" 
                  style={{ color: 'var(--danger)' }}
                  onClick={() => handleNoShow(selectedBooking.id)}
                  title="노쇼 처리"
                >
                  <UserX size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--dim)' }}>
              <QrCode size={48} style={{ opacity: 0.3, marginBottom: '12px', margin: '0 auto', display: 'block' }} />
              <div style={{ fontSize: '13px', fontWeight: 600 }}>선택된 예약자가 없습니다</div>
              <div style={{ fontSize: '11px', color: 'var(--mut)', marginTop: '4px' }}>
                좌측 목록에서 대기자를 선택하거나 QR 스캔을 진행하세요.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
