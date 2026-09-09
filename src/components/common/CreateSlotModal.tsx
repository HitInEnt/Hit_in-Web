import React, { useState } from 'react';
import { X, Calendar, Clock, Users, PlusCircle } from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';
import { PartnerService } from '../../services/partnerService';
import { GameType } from '../../types';

interface CreateSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
}

const GAME_TYPES: GameType[] = [
  '주말 정기전',
  '평일 야간전',
  'CQB 스피드전',
  '밀심(Milsim) 특별전',
  '초보자 입문전',
  '팀 단독 대관'
];

export const CreateSlotModal: React.FC<CreateSlotModalProps> = ({ isOpen, onClose, initialDate }) => {
  const { user, showToast, triggerRefresh } = usePartner();

  const [date, setDate] = useState(initialDate || '2026-09-09');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('18:00');
  const [title, setTitle] = useState('');
  const [gameType, setGameType] = useState<GameType>('주말 정기전');
  const [maxPlayers, setMaxPlayers] = useState(40);
  const [pricePerPerson, setPricePerPerson] = useState(35000);
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
  }, [initialDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('게임 슬롯 제목을 입력해주세요.', 'warning');
      return;
    }

    PartnerService.addSlot({
      fieldId: user.partnerId,
      date,
      startTime,
      endTime,
      title,
      gameType,
      maxPlayers: Number(maxPlayers),
      currentPlayers: 0,
      pricePerPerson: Number(pricePerPerson),
      status: 'open',
      notes: notes.trim() ? notes : undefined
    });

    triggerRefresh();
    showToast('새로운 게임 타임슬롯이 오픈되었습니다.', 'success');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="var(--acc)" />
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--txt)' }}>
              신규 게임 타임슬롯 오픈
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--mut)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">게임 슬롯 타이틀 *</label>
              <input
                type="text"
                className="form-input"
                placeholder="예: 오후 CQB & 스피드 시나리오전 (2부)"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">게임 일자</label>
                <input
                  type="date"
                  className="form-input"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">게임 유형</label>
                <select
                  className="form-select"
                  value={gameType}
                  onChange={e => setGameType(e.target.value as GameType)}
                >
                  {GAME_TYPES.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">시작 시간</label>
                <input
                  type="time"
                  className="form-input"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">종료 시간</label>
                <input
                  type="time"
                  className="form-input"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">최대 모집 정원 (명)</label>
                <input
                  type="number"
                  className="form-input"
                  min={1}
                  max={200}
                  value={maxPlayers}
                  onChange={e => setMaxPlayers(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">1인당 참가비 (원)</label>
                <input
                  type="number"
                  className="form-input"
                  step={1000}
                  min={0}
                  value={pricePerPerson}
                  onChange={e => setPricePerPerson(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">안내 사항 및 특별 룰</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="예: 무전기 채널 5번, 연막탄 사용 불가, 브리핑 15분 전 집합"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              <PlusCircle size={15} />
              슬롯 오픈하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
