import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, ShieldAlert, Award, Tag, Edit3, Save } from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';
import { PartnerService } from '../../services/partnerService';
import { PlayerMannerProfile } from '../../types';

interface PlayerMannerModalProps {
  userId: string | null;
  onClose: () => void;
}

export const PlayerMannerModal: React.FC<PlayerMannerModalProps> = ({ userId, onClose }) => {
  const { showToast, triggerRefresh } = usePartner();
  const [profile, setProfile] = useState<PlayerMannerProfile | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (userId) {
      const p = PartnerService.getMannerProfile(userId);
      setProfile(p);
      setNotes(p.notes || '');
    } else {
      setProfile(null);
    }
  }, [userId]);

  if (!userId || !profile) return null;

  const handleSaveNotes = () => {
    PartnerService.updateMannerNotes(userId, notes);
    triggerRefresh();
    showToast('플레이어 관리자 메모가 저장되었습니다.', 'success');
  };

  const isSafe = profile.mannerScore >= 4.5 && profile.warningCount === 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} color="var(--lime-chip)" />
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--txt)' }}>
              플레이어 매너 & 신뢰도 프로필
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--mut)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Header Card */}
          <div style={{
            background: 'var(--card2)',
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--txt)' }}>
                  {profile.realName}
                </span>
                <span style={{ fontSize: '14px', color: 'var(--mut)' }}>
                  ({profile.nickname})
                </span>
              </div>
              <div className="mono-font" style={{ fontSize: '12px', color: 'var(--dim)', marginTop: '4px' }}>
                {profile.phone} · ID: {profile.userId}
              </div>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              background: isSafe ? 'rgba(199, 249, 78, 0.15)' : 'rgba(255, 77, 79, 0.15)',
              border: `1px solid ${isSafe ? 'var(--lime-chip)' : 'var(--danger)'}`
            }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--mut)' }}>매너 지수</div>
              <div className="mono-font" style={{
                fontSize: '22px',
                fontWeight: 900,
                color: isSafe ? 'var(--lime-text)' : 'var(--danger)'
              }}>
                ★ {profile.mannerScore.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <div style={{ background: 'var(--panel)', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--line)' }}>
              <div style={{ fontSize: '11px', color: 'var(--mut)' }}>누적 게임 참전</div>
              <div className="mono-font" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--txt)', marginTop: '2px' }}>
                {profile.totalGames}회
              </div>
            </div>
            <div style={{ background: 'var(--panel)', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--line)' }}>
              <div style={{ fontSize: '11px', color: 'var(--mut)' }}>경고/신고 횟수</div>
              <div className="mono-font" style={{ fontSize: '16px', fontWeight: 800, color: profile.warningCount > 0 ? 'var(--danger)' : 'var(--green)', marginTop: '2px' }}>
                {profile.warningCount}회
              </div>
            </div>
            <div style={{ background: 'var(--panel)', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--line)' }}>
              <div style={{ fontSize: '11px', color: 'var(--mut)' }}>노쇼 이력</div>
              <div className="mono-font" style={{ fontSize: '16px', fontWeight: 800, color: profile.noShowCount > 0 ? 'var(--warn)' : 'var(--green)', marginTop: '2px' }}>
                {profile.noShowCount}회
              </div>
            </div>
          </div>

          {/* Badges & Tags */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--dim)', marginBottom: '6px' }}>
              획득 배지 & 플레이어 태그
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {profile.badges.map((b, i) => (
                <span key={i} className="badge badge-lime" style={{ fontSize: '11px' }}>
                  {b}
                </span>
              ))}
              {profile.recentTags.map((t, i) => (
                <span key={i} className="badge badge-outline" style={{ fontSize: '11px' }}>
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Internal Field Notes */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>구장 사장님 전용 관리 메모 (비공개)</span>
              <Edit3 size={13} />
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="예: 탄속 준수 꼼꼼함, 친구 3명과 주로 방문, 뱅룰 주의..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            닫기
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleSaveNotes}>
            <Save size={14} />
            메모 저장
          </button>
        </div>
      </div>
    </div>
  );
};
