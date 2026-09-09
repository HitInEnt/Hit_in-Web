import React, { useState, useMemo } from 'react';
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
  RotateCcw
} from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';
import { PartnerService } from '../../services/partnerService';
import { BookingItem } from '../../types';

interface CheckInDeskViewProps {
  onInspectPlayer: (userId: string) => void;
}

export const CheckInDeskView: React.FC<CheckInDeskViewProps> = ({ onInspectPlayer }) => {
  const { user, showToast, triggerRefresh, refreshKey } = usePartner();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);

  const bookings = useMemo(() => {
    return PartnerService.getBookings(user.partnerId);
  }, [user.partnerId, refreshKey]);

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return bookings;
    const q = searchTerm.toLowerCase();
    return bookings.filter(b => 
      b.bookingNumber.toLowerCase().includes(q) ||
      b.bookerName.toLowerCase().includes(q) ||
      b.bookerNickname.toLowerCase().includes(q) ||
      b.bookerPhone.includes(q)
    );
  }, [bookings, searchTerm]);

  const checkedInList = useMemo(() => filtered.filter(b => b.checkInStatus === 'checked_in'), [filtered]);
  const pendingList = useMemo(() => filtered.filter(b => b.checkInStatus === 'pending'), [filtered]);

  const handleCheckIn = (bookingId: string) => {
    const updated = PartnerService.updateCheckInStatus(bookingId, 'checked_in');
    triggerRefresh();
    showToast('체크인이 완료되었습니다. (출석 확인)', 'success');
    if (selectedBooking?.id === bookingId && updated) {
      setSelectedBooking(updated);
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

  return (
    <div className="page-scrollable">
      {/* Top Header Card */}
      <div style={{
        background: 'linear-gradient(135deg, var(--hero-bg) 0%, var(--card) 100%)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-lime">LIVE GATE DESK</span>
            <span style={{ fontSize: '13px', color: 'var(--mut)' }}>현장 게이트 전용 고속 체크인</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--txt)', marginTop: '4px' }}>
            실시간 현장 입장 & 안전 확인 데스크
          </h2>
        </div>

        {/* Big Search Bar */}
        <div style={{ position: 'relative', width: '360px' }}>
          <Search size={18} color="var(--dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ width: '100%', paddingLeft: '42px', fontSize: '14px', height: '44px' }}
            placeholder="예약번호 뒷자리, 닉네임, 연락처..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {/* Main Content Grid: 2 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Left Column: Real-time Attendee Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Pending Check-in Section */}
          <div className="card-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="var(--warn)" />
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--txt)' }}>
                  체크인 대기 중인 예약 ({pendingList.length}건)
                </h3>
              </div>
              <span className="badge badge-warning">미입장</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto' }}>
              {pendingList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--mut)', fontSize: '13px' }}>
                  현재 대기 중인 미입장 예약이 없습니다.
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
                        border: `1px solid ${isSelected ? 'var(--acc)' : 'var(--line)'}`,
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
                          <span style={{ fontSize: '12px', color: 'var(--mut)' }}>
                            ({b.bookerNickname})
                          </span>
                          {b.isFirstTimer && (
                            <span className="badge badge-lime" style={{ fontSize: '10px', padding: '1px 5px' }}>
                              뉴비
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--mut)', marginTop: '4px' }}>
                          <span className="mono-font" style={{ color: 'var(--acc)', fontWeight: 700 }}>{b.bookingNumber}</span>
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
                          style={{ padding: '6px 12px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCheckIn(b.id);
                          }}
                        >
                          <CheckCircle2 size={14} /> 입장
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

            {/* Checked-in List */}
            <div className="card-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--green)" />
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--txt)' }}>
                    오늘 입장 완료 목록 ({checkedInList.length}건)
                  </h3>
                </div>
                <span className="badge badge-success">입장 완료</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                {checkedInList.map(b => (
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
                      opacity: 0.85
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
                    <span className="badge badge-success" style={{ fontSize: '11px' }}>
                      {b.checkInTime} 입장완료
                    </span>
                  </div>
                ))}
              </div>
            </div>
        </div>

        {/* Right Column: Selected Attendee Detail & Inspection */}
        <div className="card-panel" style={{ height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--txt)' }}>
              플레이어 상세 검증 정보
            </h3>
            {selectedBooking && (
              <span className="mono-font" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--acc)' }}>
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
                    {selectedBooking.bookerPhone}
                  </div>
                </div>

                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => onInspectPlayer(selectedBooking.bookerUserId)}
                >
                  매너 기록 전체보기
                </button>
              </div>

              {/* Manner & Safety Status */}
              <div style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: selectedBooking.playerMannerScore >= 4.5 ? 'rgba(199, 249, 78, 0.12)' : 'rgba(255, 77, 79, 0.12)',
                border: `1px solid ${selectedBooking.playerMannerScore >= 4.5 ? 'var(--lime-chip)' : 'var(--danger)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--mut)', fontWeight: 600 }}>매너 평가 점수</div>
                  <div className="mono-font" style={{ fontSize: '20px', fontWeight: 900, color: selectedBooking.playerMannerScore >= 4.5 ? 'var(--lime-text)' : 'var(--danger)' }}>
                    ★ {selectedBooking.playerMannerScore.toFixed(2)} / 5.0
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'var(--mut)' }}>누적 신고/사고</div>
                  <div className="mono-font" style={{ fontSize: '14px', fontWeight: 700, color: selectedBooking.playerReportCount > 0 ? 'var(--danger)' : 'var(--green)' }}>
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
                    <Package size={14} color="var(--acc)" />
                    현장 렌탈 장비 지급 체크리스트
                  </div>
                  {selectedBooking.rentalOrders.map((r, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', padding: '4px 0', borderBottom: '1px dashed var(--line)' }}>
                      <span style={{ color: 'var(--txt)' }}>• {r.productName}</span>
                      <span className="mono-font" style={{ fontWeight: 800, color: 'var(--acc)' }}>{r.quantity}개 수령</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                {selectedBooking.checkInStatus !== 'checked_in' ? (
                  <button 
                    className="btn btn-lime" 
                    style={{ flex: 1 }}
                    onClick={() => handleCheckIn(selectedBooking.id)}
                  >
                    <CheckCircle2 size={16} />
                    입장 확인 완료
                  </button>
                ) : (
                  <button className="btn btn-secondary" style={{ flex: 1 }} disabled>
                    <CheckCircle2 size={16} color="var(--green)" />
                    {selectedBooking.checkInTime} 입장완료됨
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
              <QrCode size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <div style={{ fontSize: '13px', fontWeight: 600 }}>선택된 예약자가 없습니다</div>
              <div style={{ fontSize: '11px', color: 'var(--mut)', marginTop: '4px' }}>
                좌측 목록에서 대기자를 선택하거나 검색하세요.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
