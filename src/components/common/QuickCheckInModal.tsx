import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  QrCode, 
  CheckCircle2, 
  UserX, 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  Users, 
  Package, 
  Camera,
  ScanLine
} from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';
import { PartnerService } from '../../services/partnerService';
import { BookingItem } from '../../types';

interface QuickCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInspectPlayer?: (userId: string) => void;
}

export const QuickCheckInModal: React.FC<QuickCheckInModalProps> = ({ isOpen, onClose, onInspectPlayer }) => {
  const { user, showToast, triggerRefresh } = usePartner();
  const [searchTerm, setSearchTerm] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);

  const bookings = useMemo(() => {
    return PartnerService.getBookings(user.partnerId);
  }, [user.partnerId, isOpen]);

  const filteredBookings = useMemo(() => {
    if (!searchTerm.trim()) {
      // Return today's pending bookings first
      return bookings;
    }
    const q = searchTerm.toLowerCase();
    return bookings.filter(b => 
      b.bookingNumber.toLowerCase().includes(q) ||
      b.bookerName.toLowerCase().includes(q) ||
      b.bookerNickname.toLowerCase().includes(q) ||
      b.bookerPhone.includes(q)
    );
  }, [bookings, searchTerm]);

  if (!isOpen) return null;

  const handleSelect = (b: BookingItem) => {
    setSelectedBooking(b);
  };

  const handleCheckIn = (bookingId: string) => {
    PartnerService.updateCheckInStatus(bookingId, 'checked_in');
    triggerRefresh();
    showToast('체크인이 정상 완료되었습니다.', 'success');
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({
        ...selectedBooking,
        checkInStatus: 'checked_in',
        checkInTime: new Date().toTimeString().slice(0, 5)
      });
    }
  };

  const handleNoShow = (bookingId: string) => {
    if (window.confirm('해당 예약을 노쇼(No-Show) 처리하시겠습니까? 플레이어 매너 점수에 반영됩니다.')) {
      PartnerService.updateCheckInStatus(bookingId, 'no_show');
      triggerRefresh();
      showToast('노쇼 처리되었습니다.', 'warning');
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({
          ...selectedBooking,
          checkInStatus: 'no_show'
        });
      }
    }
  };

  // Simulated QR Scan selection
  const handleSimulateScan = (booking: BookingItem) => {
    setSelectedBooking(booking);
    setIsScanning(false);
    showToast(`QR 스캔 성공: ${booking.bookingNumber}`, 'info');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '820px' }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--lime-chip)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--ink-fixed)'
            }}>
              <QrCode size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--txt)' }}>
                현장 데스크 고속 체크인
              </h2>
              <div style={{ fontSize: '12px', color: 'var(--mut)' }}>
                플레이어 앱의 예약 QR 코드를 스캔하거나 예약번호/전화번호를 검색하세요.
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--mut)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px' }}>
          {/* Left Column: Search & QR Scanner Simulator */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                style={{ width: '100%', paddingLeft: '36px', fontSize: '13px' }}
                placeholder="예약번호 뒷자리, 닉네임, 연락처 검색..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>

            {/* QR Scanner Viewport Widget */}
            <div style={{
              background: 'var(--card2)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-lg)',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '160px'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'var(--lime-chip)',
                boxShadow: '0 0 10px var(--lime-chip)',
                animation: 'slideUp 2s infinite alternate ease-in-out'
              }} />
              <Camera size={28} color="var(--dim)" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--txt)' }}>
                카메라 QR 자동 리더기 대기 중
              </div>
              <div style={{ fontSize: '11px', color: 'var(--mut)', marginTop: '2px' }}>
                테스트: 아래 목록의 항목을 클릭하여 가상 스캔
              </div>
            </div>

            {/* Quick Matching List */}
            <div style={{
              maxHeight: '220px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              paddingRight: '4px'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--dim)', textTransform: 'uppercase' }}>
                당일 예약 목록 ({filteredBookings.length}건)
              </div>
              {filteredBookings.map(b => {
                const isSelected = selectedBooking?.id === b.id;
                const isDone = b.checkInStatus === 'checked_in';
                const isNoShow = b.checkInStatus === 'no_show';

                return (
                  <div
                    key={b.id}
                    onClick={() => handleSelect(b)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--card)' : 'var(--panel)',
                      border: `1px solid ${isSelected ? 'var(--acc)' : 'var(--line)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--txt)' }}>
                          {b.bookerName}
                        </span>
                        <span style={{ fontSize: '11.5px', color: 'var(--mut)' }}>
                          ({b.bookerNickname})
                        </span>
                        {b.isFirstTimer && (
                          <span className="badge badge-lime" style={{ fontSize: '9px', padding: '1px 4px' }}>
                            뉴비
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--dim)', marginTop: '2px' }}>
                        {b.slotTitle.slice(0, 16)}... · <span className="mono-font">{b.playerCount}명</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      {isDone ? (
                        <span className="badge badge-success" style={{ fontSize: '10px' }}>
                          <CheckCircle2 size={11} /> 완료 {b.checkInTime}
                        </span>
                      ) : isNoShow ? (
                        <span className="badge badge-danger" style={{ fontSize: '10px' }}>
                          노쇼
                        </span>
                      ) : (
                        <span className="badge badge-warning" style={{ fontSize: '10px' }}>
                          대기중
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Booking Detail & Manner Verification */}
          <div style={{
            background: 'var(--panel)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            {selectedBooking ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Status Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="mono-font" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--acc)' }}>
                    {selectedBooking.bookingNumber}
                  </span>
                  {selectedBooking.checkInStatus === 'checked_in' ? (
                    <span className="badge badge-success">입장 완료</span>
                  ) : selectedBooking.checkInStatus === 'no_show' ? (
                    <span className="badge badge-danger">노쇼 처리됨</span>
                  ) : (
                    <span className="badge badge-warning">체크인 대기</span>
                  )}
                </div>

                {/* Player Profile & Manner Score Check */}
                <div style={{
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--txt)' }}>
                      {selectedBooking.bookerName} ({selectedBooking.bookerNickname})
                    </div>
                    <div className="mono-font" style={{ fontSize: '12px', color: 'var(--mut)', marginTop: '2px' }}>
                      {selectedBooking.bookerPhone}
                    </div>
                  </div>

                  {/* Manner Score Pill */}
                  <div style={{
                    textAlign: 'right',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: selectedBooking.playerMannerScore >= 4.5 ? 'rgba(199, 249, 78, 0.15)' : 'rgba(255, 77, 79, 0.15)',
                    border: `1px solid ${selectedBooking.playerMannerScore >= 4.5 ? 'var(--lime-chip)' : 'var(--danger)'}`
                  }}>
                    <div style={{ fontSize: '10px', color: 'var(--mut)', fontWeight: 600 }}>
                      플레이어 매너 점수
                    </div>
                    <div className="mono-font" style={{
                      fontSize: '17px',
                      fontWeight: 900,
                      color: selectedBooking.playerMannerScore >= 4.5 ? 'var(--lime-text)' : 'var(--danger)'
                    }}>
                      ★ {selectedBooking.playerMannerScore.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Manner Warning Notice if needed */}
                {selectedBooking.playerReportCount > 0 ? (
                  <div style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 77, 79, 0.1)',
                    border: '1px solid rgba(255, 77, 79, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '11.5px',
                    color: 'var(--danger)'
                  }}>
                    <ShieldAlert size={16} />
                    <span>누적 신고 이력 <strong>{selectedBooking.playerReportCount}회</strong> 있습니다. 현장 안전수칙 및 탄속을 재확인하세요.</span>
                  </div>
                ) : (
                  <div style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(47, 203, 126, 0.1)',
                    border: '1px solid rgba(47, 203, 126, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '11.5px',
                    color: 'var(--green)'
                  }}>
                    <ShieldCheck size={16} />
                    <span>클린 매너 플레이어입니다 (사고/신고 0건).</span>
                  </div>
                )}

                {/* Booking Info Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  fontSize: '12px'
                }}>
                  <div style={{ padding: '8px', background: 'var(--card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)' }}>
                    <div style={{ color: 'var(--mut)' }}>게임 슬롯</div>
                    <div style={{ fontWeight: 700, color: 'var(--txt)', marginTop: '2px' }}>{selectedBooking.startTime} ~ {selectedBooking.endTime}</div>
                  </div>
                  <div style={{ padding: '8px', background: 'var(--card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)' }}>
                    <div style={{ color: 'var(--mut)' }}>입장 인원</div>
                    <div style={{ fontWeight: 700, color: 'var(--txt)', marginTop: '2px' }}>총 {selectedBooking.playerCount}명 (결제완료)</div>
                  </div>
                </div>

                {/* Rental Gear List */}
                {selectedBooking.rentalOrders.length > 0 && (
                  <div style={{
                    background: 'var(--card)',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--dim)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Package size={12} /> 현장 렌탈/소모품 지급 품목
                    </div>
                    {selectedBooking.rentalOrders.map((r, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '3px 0' }}>
                        <span style={{ color: 'var(--txt)' }}>• {r.productName}</span>
                        <span className="mono-font" style={{ fontWeight: 700, color: 'var(--acc)' }}>{r.quantity}개</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--dim)',
                textAlign: 'center',
                padding: '40px 20px'
              }}>
                <QrCode size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <div style={{ fontSize: '13px', fontWeight: 600 }}>
                  선택된 예약 내역이 없습니다
                </div>
                <div style={{ fontSize: '11px', color: 'var(--mut)', marginTop: '4px' }}>
                  좌측 목록에서 플레이어를 선택하거나 번호를 검색하세요.
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {selectedBooking && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                {selectedBooking.checkInStatus !== 'checked_in' ? (
                  <button 
                    className="btn btn-lime" 
                    style={{ flex: 1 }}
                    onClick={() => handleCheckIn(selectedBooking.id)}
                  >
                    <CheckCircle2 size={16} />
                    체크인 완료 및 입장 확인
                  </button>
                ) : (
                  <button 
                    className="btn btn-secondary" 
                    style={{ flex: 1 }}
                    disabled
                  >
                    <CheckCircle2 size={16} color="var(--green)" />
                    체크인 완료됨 ({selectedBooking.checkInTime})
                  </button>
                )}

                <button 
                  className="btn btn-secondary"
                  style={{ color: 'var(--danger)', borderColor: 'rgba(255, 77, 79, 0.4)' }}
                  onClick={() => handleNoShow(selectedBooking.id)}
                  title="노쇼 처리"
                >
                  <UserX size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
