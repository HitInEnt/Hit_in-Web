import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2 } from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';
import { PartnerService } from '../../services/partnerService';
import { TimeSlot } from '../../types';

interface ManualBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  slots: TimeSlot[];
}

export const ManualBookingModal: React.FC<ManualBookingModalProps> = ({ isOpen, onClose, slots }) => {
  const { user, showToast, triggerRefresh } = usePartner();

  const [selectedSlotId, setSelectedSlotId] = useState(slots[0]?.id || '');
  const [bookerName, setBookerName] = useState('');
  const [bookerNickname, setBookerNickname] = useState('');
  const [bookerPhone, setBookerPhone] = useState('');
  const [playerCount, setPlayerCount] = useState(1);
  const [isFirstTimer, setIsFirstTimer] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending'>('paid');

  if (!isOpen) return null;

  const targetSlot = slots.find(s => s.id === selectedSlotId) || slots[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookerName.trim()) {
      showToast('예약자명을 입력해주세요.', 'warning');
      return;
    }

    if (!targetSlot) {
      showToast('유효한 게임 슬롯을 선택해주세요.', 'warning');
      return;
    }

    const totalAmount = targetSlot.pricePerPerson * playerCount;

    PartnerService.addManualBooking({
      slotId: targetSlot.id,
      fieldId: user.partnerId,
      date: targetSlot.date,
      slotTitle: targetSlot.title,
      startTime: targetSlot.startTime,
      endTime: targetSlot.endTime,
      bookerUserId: `u_manual_${Date.now()}`,
      bookerName,
      bookerNickname: bookerNickname.trim() || bookerName,
      bookerPhone: bookerPhone.trim() || '010-0000-0000',
      playerCount: Number(playerCount),
      totalAmount,
      paymentStatus,
      checkInStatus: 'pending',
      playerMannerScore: 4.85,
      playerReportCount: 0,
      isFirstTimer,
      rentalOrders: []
    });

    triggerRefresh();
    showToast(`${bookerName}님의 수동 예약이 등록되었습니다.`, 'success');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={18} color="var(--acc)" />
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--txt)' }}>
              현장 / 전화 수동 예약 등록
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--mut)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">대상 게임 슬롯 *</label>
              <select
                className="form-select"
                value={selectedSlotId}
                onChange={e => setSelectedSlotId(e.target.value)}
              >
                {slots.map(s => (
                  <option key={s.id} value={s.id}>
                    [{s.date}] {s.startTime}~{s.endTime} {s.title} ({s.currentPlayers}/{s.maxPlayers}명)
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">예약자 성함 *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="예: 홍길동"
                  value={bookerName}
                  onChange={e => setBookerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">동호회 닉네임</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="예: 팬텀소대장"
                  value={bookerNickname}
                  onChange={e => setBookerNickname(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">연락처</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="010-0000-0000"
                  value={bookerPhone}
                  onChange={e => setBookerPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">참가 인원 (명)</label>
                <input
                  type="number"
                  className="form-input"
                  min={1}
                  max={50}
                  value={playerCount}
                  onChange={e => setPlayerCount(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">현장 수납 상태</label>
                <select
                  className="form-select"
                  value={paymentStatus}
                  onChange={e => setPaymentStatus(e.target.value as 'paid' | 'pending')}
                >
                  <option value="paid">현장 결제 완료 (카드/현금)</option>
                  <option value="pending">미수금 (게임 종료 후 정산)</option>
                </select>
              </div>

              <div className="form-group" style={{ justifyContent: 'center' }}>
                <label className="form-label">초보자 여부</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', marginTop: '6px' }}>
                  <input
                    type="checkbox"
                    checked={isFirstTimer}
                    onChange={e => setIsFirstTimer(e.target.checked)}
                    style={{ accentColor: 'var(--acc)', width: '16px', height: '16px' }}
                  />
                  <span>에어소프트 첫 입문자</span>
                </label>
              </div>
            </div>

            {targetSlot && (
              <div style={{
                background: 'var(--card2)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '13px'
              }}>
                <span style={{ color: 'var(--mut)' }}>예상 수납 합계금액:</span>
                <span className="mono-font" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--acc)' }}>
                  {(targetSlot.pricePerPerson * playerCount).toLocaleString()}원
                </span>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              <UserPlus size={15} />
              수동 예약 등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
