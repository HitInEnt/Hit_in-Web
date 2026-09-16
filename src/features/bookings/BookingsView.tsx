import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  PlusCircle, 
  UserPlus, 
  CheckCircle2, 
  UserX, 
  ShieldCheck, 
  ShieldAlert, 
  Package, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  CalendarCheck, 
  CalendarDays
} from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';
import { PartnerService } from '../../services/partnerService';
import { TimeSlot, SlotStatus } from '../../types';

interface BookingsViewProps {
  onOpenAddSlot: (date?: string) => void;
  onOpenManualBooking: (slots: TimeSlot[]) => void;
  onInspectPlayer: (userId: string) => void;
}

const WEEKDAYS = [
  { name: '일', eng: 'SUN', isWeekend: true, color: 'var(--danger)' },
  { name: '월', eng: 'MON', isWeekend: false, color: 'var(--txt)' },
  { name: '화', eng: 'TUE', isWeekend: false, color: 'var(--txt)' },
  { name: '수', eng: 'WED', isWeekend: false, color: 'var(--txt)' },
  { name: '목', eng: 'THU', isWeekend: false, color: 'var(--txt)' },
  { name: '금', eng: 'FRI', isWeekend: false, color: 'var(--txt)' },
  { name: '토', eng: 'SAT', isWeekend: true, color: 'var(--acc)' }
];

export const BookingsView: React.FC<BookingsViewProps> = ({
  onOpenAddSlot,
  onOpenManualBooking,
  onInspectPlayer
}) => {
  const { user, role, showToast, triggerRefresh, refreshKey } = usePartner();

  // Current calendar year & month view (default: September 2026)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9); // 1-12
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-09');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('slt_01');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const effectivePartnerId = role === 'hq_admin' ? undefined : user.partnerId;

  const slots = useMemo(() => {
    return PartnerService.getSlots(effectivePartnerId);
  }, [effectivePartnerId, refreshKey]);

  const bookings = useMemo(() => {
    return PartnerService.getBookings(effectivePartnerId);
  }, [effectivePartnerId, refreshKey]);

  // Slots for the currently selected date
  const selectedDateSlots = useMemo(() => {
    return slots.filter(s => s.date === selectedDate);
  }, [slots, selectedDate]);

  // Active slot for detailed booker table inspection
  const activeSlot = useMemo(() => {
    return selectedDateSlots.find(s => s.id === selectedSlotId) || selectedDateSlots[0] || null;
  }, [selectedDateSlots, selectedSlotId]);

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

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear(prev => prev - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear(prev => prev + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleGoToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(9);
    setSelectedDate('2026-09-09');
    const daySlots = slots.filter(s => s.date === '2026-09-09');
    if (daySlots.length > 0) {
      setSelectedSlotId(daySlots[0].id);
    }
  };

  const handleSelectDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    const daySlots = slots.filter(s => s.date === dateStr);
    if (daySlots.length > 0) {
      setSelectedSlotId(daySlots[0].id);
    }
  };

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

  // Build 7x5 or 7x6 Calendar Grid
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0 = Sun
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth - 1, 0).getDate();

    const days = [];

    // 1. Previous month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
      const dateStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum,
        isCurrentMonth: false,
        isToday: dateStr === '2026-09-09',
        dayOfWeek: new Date(prevYear, prevMonth - 1, dayNum).getDay()
      });
    }

    // 2. Current month days
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum,
        isCurrentMonth: true,
        isToday: dateStr === '2026-09-09',
        dayOfWeek: new Date(currentYear, currentMonth - 1, dayNum).getDay()
      });
    }

    // 3. Next month padding days to complete grid
    const remaining = 35 - days.length >= 0 ? 35 - days.length : 42 - days.length;
    for (let dayNum = 1; dayNum <= remaining; dayNum++) {
      const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
      const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
      const dateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum,
        isCurrentMonth: false,
        isToday: dateStr === '2026-09-09',
        dayOfWeek: new Date(nextYear, nextMonth - 1, dayNum).getDay()
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Formatted date string for header
  const formattedSelectedDate = useMemo(() => {
    try {
      const [y, m, d] = selectedDate.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
      const dayOfWeek = dayNames[dateObj.getDay()];
      return `${y}년 ${m}월 ${d}일 (${dayOfWeek}요일)`;
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  return (
    <div className="page-scrollable" style={{ gap: '20px' }}>
      {/* 1. Header Banner & Quick Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        background: 'linear-gradient(135deg, var(--card) 0%, var(--card2) 100%)',
        padding: '20px 24px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--line)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-lime">TACTICAL CALENDAR</span>
            <span style={{ fontSize: '13px', color: 'var(--mut)' }}>구장 타임슬롯 & 참가자 예약 통합 관제</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--txt)', marginTop: '4px' }}>
            타임슬롯 & 예약 캘린더
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--mut)', marginTop: '2px' }}>
            캘린더에서 원하는 날짜를 클릭하면 해당 일자의 상세 게임 슬롯과 예약자 명단이 하단에 즉시 표시됩니다.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => onOpenManualBooking(selectedDateSlots.length > 0 ? selectedDateSlots : slots)}
          >
            <UserPlus size={15} />
            현장/전화 수동 예약
          </button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => onOpenAddSlot(selectedDate)}
          >
            <PlusCircle size={15} />
            신규 슬롯 오픈
          </button>
        </div>
      </div>

      {/* 2. Interactive Monthly Calendar Grid */}
      <div className="card-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Navigation Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          borderBottom: '1px solid var(--line)',
          paddingBottom: '16px'
        }}>
          {/* Month / Year Title with Prev/Next Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={handlePrevMonth}
                className="btn btn-secondary btn-sm"
                style={{ width: '32px', height: '32px', padding: 0, justifyContent: 'center' }}
                title="이전 달"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNextMonth}
                className="btn btn-secondary btn-sm"
                style={{ width: '32px', height: '32px', padding: 0, justifyContent: 'center' }}
                title="다음 달"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span className="tactical-font" style={{ fontSize: '22px', fontWeight: 900, color: 'var(--txt)', letterSpacing: '0.04em' }}>
                {currentYear}년 {currentMonth}월
              </span>
              <span style={{ fontSize: '12px', color: 'var(--mut)' }}>
                (총 {slots.filter(s => s.date.startsWith(`${currentYear}-${String(currentMonth).padStart(2, '0')}`)).length}개 슬롯 개설됨)
              </span>
            </div>
          </div>

          {/* Quick Jump & Active Date Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleGoToday}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              <CalendarCheck size={14} color="var(--green)" />
              오늘로 이동 (09.09)
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--panel)',
              border: '1px solid var(--acc)',
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--txt)'
            }}>
              <CalendarDays size={14} color="var(--acc)" />
              <span>선택된 일자: </span>
              <span className="mono-font" style={{ color: 'var(--acc)' }}>{selectedDate}</span>
            </div>
          </div>
        </div>

        {/* Weekday Names */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '6px',
          textAlign: 'center'
        }}>
          {WEEKDAYS.map((w, idx) => (
            <div
              key={idx}
              style={{
                padding: '8px 4px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--panel)',
                fontSize: '12px',
                fontWeight: 800,
                color: w.color,
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}
            >
              <span>{w.name}</span>
              <span style={{ fontSize: '9.5px', color: 'var(--dim)' }}>{w.eng}</span>
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '6px'
        }}>
          {calendarDays.map((cell, idx) => {
            const isSelected = cell.dateStr === selectedDate;
            const daySlots = slots.filter(s => s.date === cell.dateStr);
            const totalPlayers = daySlots.reduce((sum, s) => sum + s.currentPlayers, 0);
            const maxCapacity = daySlots.reduce((sum, s) => sum + s.maxPlayers, 0);
            const hasSlots = daySlots.length > 0;

            let numColor = cell.isCurrentMonth ? 'var(--txt)' : 'var(--dim)';
            if (cell.isCurrentMonth) {
              if (cell.dayOfWeek === 0) numColor = 'var(--danger)'; // Sun
              if (cell.dayOfWeek === 6) numColor = 'var(--acc)'; // Sat
            }

            return (
              <div
                key={idx}
                onClick={() => handleSelectDate(cell.dateStr)}
                style={{
                  minHeight: '105px',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 10px',
                  background: isSelected 
                    ? 'var(--card2)' 
                    : cell.isCurrentMonth ? 'var(--panel)' : 'rgba(255, 255, 255, 0.01)',
                  border: isSelected 
                    ? '2px solid var(--acc)' 
                    : cell.isToday ? '1px solid var(--green)' : '1px solid var(--line)',
                  boxShadow: isSelected ? '0 0 16px rgba(255, 90, 31, 0.3)' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                  opacity: cell.isCurrentMonth ? 1 : 0.45,
                  position: 'relative'
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--acc)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.borderColor = cell.isToday ? 'var(--green)' : 'var(--line)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }
                }}
              >
                {/* Top Row: Date Number and Badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="mono-font" style={{
                    fontSize: '14px',
                    fontWeight: isSelected || cell.isToday ? 900 : 700,
                    color: isSelected ? 'var(--acc)' : numColor
                  }}>
                    {cell.dayNum}
                  </span>

                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {cell.isToday && (
                      <span className="badge badge-lime" style={{ fontSize: '9px', padding: '1px 5px' }}>
                        오늘
                      </span>
                    )}
                    {isSelected && (
                      <span className="badge badge-orange" style={{ fontSize: '9px', padding: '1px 5px' }}>
                        선택됨
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle: Slot Badges & Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', margin: '4px 0' }}>
                  {hasSlots ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="badge badge-lime" style={{ fontSize: '10px', padding: '1px 5px', fontWeight: 800 }}>
                          {daySlots.length}개 슬롯
                        </span>
                        <span className="mono-font" style={{ fontSize: '10px', color: 'var(--mut)', fontWeight: 600 }}>
                          {totalPlayers}/{maxCapacity}명
                        </span>
                      </div>

                      {/* Mini Slot Chips */}
                      {daySlots.slice(0, 2).map((s, sIdx) => {
                        const isFull = s.status === 'full';
                        const inProgress = s.status === 'in_progress';
                        return (
                          <div 
                            key={sIdx}
                            style={{
                              fontSize: '10px',
                              padding: '2px 5px',
                              borderRadius: 'var(--radius-sm)',
                              background: 'var(--card)',
                              border: '1px solid var(--line)',
                              color: 'var(--txt)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span style={{
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              backgroundColor: inProgress ? 'var(--green)' : isFull ? 'var(--danger)' : 'var(--acc)',
                              flexShrink: 0
                            }} />
                            <span className="mono-font" style={{ fontWeight: 700, color: 'var(--dim)' }}>{s.startTime.slice(0, 5)}</span>
                            <span>{s.title.slice(0, 10)}</span>
                          </div>
                        );
                      })}
                      {daySlots.length > 2 && (
                        <div style={{ fontSize: '9px', color: 'var(--mut)', textAlign: 'right' }}>
                          +{daySlots.length - 2}개 더보기
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ fontSize: '10.5px', color: 'var(--dim)', padding: '4px 0' }}>
                      일정 없음
                    </div>
                  )}
                </div>

                {/* Bottom Indicator */}
                <div style={{ height: '3px', background: isSelected ? 'var(--acc)' : hasSlots ? 'var(--lime-chip)' : 'transparent', borderRadius: '2px' }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Detailed Time Slots & Bookings on Selected Date */}
      <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Detail Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          borderBottom: '1px solid var(--line)',
          paddingBottom: '14px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--txt)' }}>
                📅 {formattedSelectedDate} 타임슬롯 상세 내역
              </h3>
              <span className="badge badge-lime">
                {selectedDateSlots.length}개 슬롯 개설됨
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--mut)', marginTop: '2px' }}>
              해당 일자의 슬롯 카드를 클릭하여 예약 명단 조회 및 현장 관리를 진행하세요.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => onOpenAddSlot(selectedDate)}
            >
              <PlusCircle size={14} />
              이 날짜({selectedDate})에 슬롯 추가
            </button>
          </div>
        </div>

        {/* If NO Slots on Selected Date */}
        {selectedDateSlots.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '48px 24px',
            background: 'var(--panel)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--line)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <CalendarIcon size={44} color="var(--dim)" style={{ opacity: 0.6 }} />
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--txt)' }}>
                선택하신 {formattedSelectedDate}에 개설된 게임 타임슬롯이 없습니다.
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--mut)', marginTop: '4px' }}>
                새로운 타임슬롯을 등록하여 플레이어 참가 예약을 받아보세요.
              </div>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onOpenAddSlot(selectedDate)}
              style={{ marginTop: '4px' }}
            >
              <PlusCircle size={15} />
              {selectedDate} 게임 슬롯 오픈하기
            </button>
          </div>
        ) : (
          /* Slots Grid for Selected Date */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--dim)', textTransform: 'uppercase', marginBottom: '8px' }}>
                개설된 타임슬롯 목록 (카드를 클릭하면 하단에 예약자 명단이 표시됩니다)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {selectedDateSlots.map(slot => {
                  const isSelected = activeSlot?.id === slot.id;
                  const ratio = slot.maxPlayers > 0 ? Math.round((slot.currentPlayers / slot.maxPlayers) * 100) : 0;
                  const isFull = slot.status === 'full' || ratio >= 100;
                  const isInProgress = slot.status === 'in_progress';

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
                        boxShadow: isSelected ? '0 0 0 2px rgba(255, 90, 31, 0.35)' : 'none',
                        transition: 'all 0.15s ease',
                        position: 'relative'
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

                      <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--txt)', marginTop: '8px' }}>
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
                          <span style={{ color: 'var(--mut)' }}>예약 충원률</span>
                          <span className="mono-font" style={{ fontWeight: 700, color: ratio >= 90 ? 'var(--danger)' : 'var(--txt)' }}>
                            {slot.currentPlayers} / {slot.maxPlayers}명 ({ratio}%)
                          </span>
                        </div>
                        <div style={{ height: '5px', background: 'var(--card2)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(100, ratio)}%`, height: '100%', backgroundColor: isSelected ? 'var(--acc)' : 'var(--lime-chip)' }} />
                        </div>
                      </div>

                      {isSelected && (
                        <div style={{
                          marginTop: '10px',
                          fontSize: '11px',
                          color: 'var(--acc)',
                          fontWeight: 700,
                          textAlign: 'center',
                          padding: '3px',
                          background: 'rgba(255, 90, 31, 0.1)',
                          borderRadius: 'var(--radius-sm)'
                        }}>
                          ✓ 현재 선택된 슬롯 (하단 명단 조회)
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Active Slot Reservation Attendee Table */}
            {activeSlot && (
              <div style={{
                background: 'var(--panel)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                border: '1px solid var(--line)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                {/* Table Header Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '15.5px', fontWeight: 800, color: 'var(--txt)' }}>
                        [{activeSlot.startTime} ~ {activeSlot.endTime}] {activeSlot.title} 예약 명단
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

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onOpenManualBooking([activeSlot])}
                      style={{ fontSize: '11.5px', padding: '6px 10px' }}
                    >
                      <UserPlus size={13} />
                      수동 예약
                    </button>
                  </div>
                </div>

                {/* Table */}
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
                          <td colSpan={9} style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--mut)' }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--txt)' }}>
                              해당 타임슬롯에 등록된 예약 내역이 없습니다.
                            </div>
                            <div style={{ fontSize: '11.5px', color: 'var(--mut)', marginTop: '4px' }}>
                              플레이어가 웹에서 예약하거나 우측 상단 '수동 예약'으로 직접 접수할 수 있습니다.
                            </div>
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
        )}
      </div>
    </div>
  );
};
