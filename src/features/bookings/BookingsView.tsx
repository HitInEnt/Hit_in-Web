import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  PlusCircle, 
  UserPlus, 
  CheckCircle2, 
  UserX, 
  AlertCircle, 
  ShieldCheck, 
  ShieldAlert, 
  Package, 
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';
import { PartnerService } from '../../services/partnerService';
import { TimeSlot, BookingItem, SlotStatus } from '../../types';

interface BookingsViewProps {
  onOpenAddSlot: () => void;
  onOpenManualBooking: (slots: TimeSlot[]) => void;
  onInspectPlayer: (userId: string) => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  onOpenAddSlot,
  onOpenManualBooking,
  onInspectPlayer
}) => {
  const { user, showToast, triggerRefresh, refreshKey } = usePartner();

  const [selectedDate, setSelectedDate] = useState('2026-09-09');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('slt_01');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const slots = useMemo(() => {
    return PartnerService.getSlots(user.partnerId);
  }, [user.partnerId, refreshKey]);

  const bookings = useMemo(() => {
    return PartnerService.getBookings(user.partnerId);
  }, [user.partnerId, refreshKey]);

  // Filter slots for selected date
  const filteredSlots = useMemo(() => {
    return slots.filter(s => s.date === selectedDate);
  }, [slots, selectedDate]);

  const activeSlot = useMemo(() => {
    return slots.find(s => s.id === selectedSlotId) || filteredSlots[0] || slots[0];
  }, [slots, selectedSlotId, filteredSlots]);

  // Bookings for active slot
  const slotBookings = useMemo(() => {
    if (!activeSlot) return [];
    let list = bookings.filter(b => b.slotId === activeSlot.id);
    if (statusFilter !== 'all') {
      list = list.filter(b => b.checkInStatus === statusFilter);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(b => 
        b.bookerName.toLowerCase().includes(q) ||
        b.bookerNickname.toLowerCase().includes(q) ||
        b.bookingNumber.toLowerCase().includes(q) ||
        b.bookerPhone.includes(q)
      );
    }
    return list;
  }, [bookings, activeSlot, statusFilter, searchTerm]);

  const handleUpdateSlotStatus = (slotId: string, status: SlotStatus) => {
    PartnerService.updateSlot(slotId, { status });
    triggerRefresh();
    showToast(`슬롯 상태가 '${status}'(으)로 변경되었습니다.`, 'info');
  };

  const handleCheckIn = (bookingId: string) => {
    PartnerService.updateCheckInStatus(bookingId, 'checked_in');
    triggerRefresh();
    showToast('체크인이 완료되었습니다.', 'success');
  };

  const handleNoShow = (bookingId: string) => {
    if (window.confirm('해당 예약자를 노쇼 처리하시겠습니까?')) {
      PartnerService.updateCheckInStatus(bookingId, 'no_show');
      triggerRefresh();
      showToast('노쇼 처리되었습니다.', 'warning');
    }
  };

  return (
    <div className="page-scrollable">
      {/* Top Controls & Action Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: 'var(--card)',
        padding: '16px 20px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--line)'
      }}>
        {/* Date Selector Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="var(--acc)" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--txt)' }}>일자 선택:</span>
          <button
            className={`btn btn-sm ${selectedDate === '2026-09-09' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedDate('2026-09-09')}
          >
            오늘 (09.09 수)
          </button>
          <button
            className={`btn btn-sm ${selectedDate === '2026-09-10' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedDate('2026-09-10')}
          >
            내일 (09.10 목)
          </button>
          <input
            type="date"
            className="form-input"
            style={{ padding: '4px 10px', fontSize: '12px' }}
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Action CTAs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => onOpenManualBooking(slots)}
          >
            <UserPlus size={15} />
            현장/전화 수동 예약
          </button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={onOpenAddSlot}
          >
            <PlusCircle size={15} />
            신규 슬롯 오픈
          </button>
        </div>
      </div>

      {/* Slots Carousel/Grid for the Day */}
      <div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--dim)', textTransform: 'uppercase', marginBottom: '10px' }}>
          선택 일자({selectedDate}) 게임 타임슬롯 ({filteredSlots.length}개)
        </div>
        
        {filteredSlots.length === 0 ? (
          <div className="card-panel" style={{ textAlign: 'center', padding: '30px' }}>
            <div style={{ color: 'var(--mut)', fontSize: '14px' }}>해당 일자에 등록된 게임 슬롯이 없습니다.</div>
            <button className="btn btn-primary btn-sm" onClick={onOpenAddSlot} style={{ marginTop: '12px' }}>
              <PlusCircle size={14} /> 지금 슬롯 등록하기
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {filteredSlots.map(slot => {
              const isSelected = activeSlot?.id === slot.id;
              const ratio = Math.round((slot.currentPlayers / slot.maxPlayers) * 100);

              return (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlotId(slot.id)}
                  style={{
                    background: isSelected ? 'var(--card)' : 'var(--panel)',
                    border: `1px solid ${isSelected ? 'var(--acc)' : 'var(--line)'}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 0 0 2px rgba(255, 90, 31, 0.3)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className="badge badge-outline" style={{ fontSize: '10px' }}>
                      {slot.gameType}
                    </span>
                    <select
                      value={slot.status}
                      onChange={e => {
                        e.stopPropagation();
                        handleUpdateSlotStatus(slot.id, e.target.value as SlotStatus);
                      }}
                      className="form-select"
                      style={{ padding: '2px 6px', fontSize: '11px', height: '24px' }}
                      onClick={e => e.stopPropagation()}
                    >
                      <option value="open">모집중 (Open)</option>
                      <option value="full">마감 (Full)</option>
                      <option value="in_progress">진행중</option>
                      <option value="closed">비활성 (Closed)</option>
                      <option value="completed">종료 (Done)</option>
                    </select>
                  </div>

                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--txt)', marginTop: '8px' }}>
                    {slot.title}
                  </h4>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--mut)', marginTop: '6px' }}>
                    <Clock size={13} />
                    <span className="mono-font">{slot.startTime} ~ {slot.endTime}</span>
                    <span>•</span>
                    <span className="mono-font">{slot.pricePerPerson.toLocaleString()}원/인</span>
                  </div>

                  {/* Progress Meter */}
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--mut)' }}>예약 인원</span>
                      <span className="mono-font" style={{ fontWeight: 700, color: ratio >= 90 ? 'var(--danger)' : 'var(--txt)' }}>
                        {slot.currentPlayers} / {slot.maxPlayers}명 ({ratio}%)
                      </span>
                    </div>
                    <div style={{ height: '5px', background: 'var(--card2)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, ratio)}%`, height: '100%', backgroundColor: isSelected ? 'var(--acc)' : 'var(--lime-chip)' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detailed Reservation List for Selected Slot */}
      {activeSlot && (
        <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Table Header Filter & Search */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--txt)' }}>
                  [{activeSlot.startTime}~{activeSlot.endTime}] {activeSlot.title} 예약 명단
                </h3>
                <span className="badge badge-lime">
                  총 {slotBookings.reduce((s, b) => s + b.playerCount, 0)}명 참가
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--mut)', marginTop: '2px' }}>
                {activeSlot.notes || '특이사항 없음'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Search Bar */}
              <div style={{ position: 'relative' }}>
                <Search size={14} color="var(--dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '30px', fontSize: '12px', width: '180px' }}
                  placeholder="예약자, 전화번호..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <select
                className="form-select"
                style={{ fontSize: '12px', padding: '6px 10px' }}
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="all">전체 상태</option>
                <option value="pending">체크인 대기</option>
                <option value="checked_in">체크인 완료</option>
                <option value="no_show">노쇼</option>
              </select>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="table-container">
            <table className="tactical-table">
              <thead>
                <tr>
                  <th>예약번호</th>
                  <th>예약자 (닉네임)</th>
                  <th>연락처</th>
                  <th>인원</th>
                  <th>결제 금액</th>
                  <th>매너 지수</th>
                  <th>렌탈/소모품</th>
                  <th>체크인 상태</th>
                  <th>관리 작업</th>
                </tr>
              </thead>
              <tbody>
                {slotBookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: 'var(--mut)' }}>
                      해당 조건에 맞는 예약 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  slotBookings.map(b => {
                    const isCheckedIn = b.checkInStatus === 'checked_in';
                    const isNoShow = b.checkInStatus === 'no_show';
                    const hasWarning = b.playerReportCount > 0;

                    return (
                      <tr key={b.id}>
                        <td>
                          <span className="mono-font" style={{ fontWeight: 700, color: 'var(--acc)', fontSize: '12px' }}>
                            {b.bookingNumber}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 700, color: 'var(--txt)' }}>{b.bookerName}</span>
                            <span style={{ fontSize: '12px', color: 'var(--mut)' }}>({b.bookerNickname})</span>
                            {b.isFirstTimer && (
                              <span className="badge badge-lime" style={{ fontSize: '9px', padding: '1px 5px' }}>
                                뉴비
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="mono-font" style={{ fontSize: '12px', color: 'var(--mut)' }}>
                            {b.bookerPhone}
                          </span>
                        </td>
                        <td>
                          <span className="mono-font" style={{ fontWeight: 800 }}>{b.playerCount}명</span>
                        </td>
                        <td>
                          <span className="mono-font" style={{ fontWeight: 700, color: 'var(--txt)' }}>
                            {b.totalAmount.toLocaleString()}원
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => onInspectPlayer(b.bookerUserId)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: 0
                            }}
                            title="플레이어 매너 프로필 조회"
                          >
                            <span className="badge badge-outline" style={{
                              fontSize: '11px',
                              color: b.playerMannerScore >= 4.5 ? 'var(--lime-text)' : 'var(--danger)',
                              borderColor: b.playerMannerScore >= 4.5 ? 'var(--lime-chip)' : 'var(--danger)'
                            }}>
                              {hasWarning ? <ShieldAlert size={12} color="var(--danger)" /> : <ShieldCheck size={12} color="var(--lime-text)" />}
                              ★ {b.playerMannerScore.toFixed(2)}
                            </span>
                          </button>
                        </td>
                        <td>
                          {b.rentalOrders.length > 0 ? (
                            <span className="badge badge-outline" style={{ fontSize: '11px' }}>
                              <Package size={11} /> {b.rentalOrders.length}종류 ({b.rentalOrders.reduce((s, r) => s + r.quantity, 0)}개)
                            </span>
                          ) : (
                            <span style={{ fontSize: '12px', color: 'var(--dim)' }}>개인장비</span>
                          )}
                        </td>
                        <td>
                          {isCheckedIn ? (
                            <span className="badge badge-success">
                              <CheckCircle2 size={12} /> {b.checkInTime} 완료
                            </span>
                          ) : isNoShow ? (
                            <span className="badge badge-danger">노쇼</span>
                          ) : (
                            <span className="badge badge-warning">대기중</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {!isCheckedIn && !isNoShow && (
                              <button
                                className="btn btn-lime btn-sm"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                onClick={() => handleCheckIn(b.id)}
                              >
                                체크인
                              </button>
                            )}
                            {!isNoShow && (
                              <button
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--danger)' }}
                                onClick={() => handleNoShow(b.id)}
                              >
                                <UserX size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
