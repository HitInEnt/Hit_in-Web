import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  RefreshCw, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';
import { PartnerService } from '../../services/partnerService';

export const PendingApprovalBanner: React.FC = () => {
  const { user, role, updateProfile, setActiveTab, showToast, triggerRefresh } = usePartner();
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckStatus = () => {
    setIsChecking(true);
    setTimeout(() => {
      const currentStatus = PartnerService.checkUserApproval(user.email, role);
      if (currentStatus === 'active') {
        updateProfile({ status: 'active' });
        showToast('🎉 축하합니다! 본사(HQ)의 가맹 입점 승인이 완료되어 모든 관리 기능이 활성화되었습니다!', 'success');
        triggerRefresh();
      } else if (currentStatus === 'suspended') {
        showToast('현재 계정이 본사에 의해 보류/정지 상태입니다. 고객지원팀에 문의해주세요.', 'warning');
      } else {
        showToast('현재 본사 관리자의 심사가 진행 중입니다. 승인 완료 시 즉시 반영됩니다.', 'info');
      }
      setIsChecking(false);
    }, 600);
  };

  const getRoleNames = () => {
    const roles = user.roles && user.roles.length > 0 ? user.roles : [user.role];
    return roles.map(r => {
      if (r === 'field_owner') return '🏟️ 경기장 필드';
      if (r === 'shop_owner') return '🔫 건샵/렌탈';
      return '👑 본사 관리';
    }).join(' + ');
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255, 149, 0, 0.12) 0%, rgba(19, 27, 46, 0.95) 100%)',
      border: '1px solid rgba(255, 149, 0, 0.35)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 24px',
      margin: '16px var(--space-xxl) 0 var(--space-xxl)',
      flexShrink: 0,
      boxShadow: 'var(--shadow-md)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top Accent Line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #ff9500 0%, #ff5a1f 100%)'
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '18px' }}>
        <div style={{ display: 'flex', gap: '16px', maxWidth: '750px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255, 149, 0, 0.18)',
            border: '1px solid rgba(255, 149, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: '#ff9500'
          }}>
            <Clock size={24} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-orange" style={{ fontWeight: 800, fontSize: '11px', padding: '3px 8px' }}>
                ⏳ 입점 심사 및 승인 대기 중 (PENDING APPROVAL)
              </span>
              <span style={{ fontSize: '12px', color: 'var(--dim)' }}>
                신청 일자: {new Date().toLocaleDateString('ko-KR')}
              </span>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--txt)', margin: '8px 0 6px 0' }}>
              본사(HIT IN HQ) 관리자의 가맹 입점 승인을 기다리는 중입니다
            </h3>

            <p style={{ fontSize: '13px', color: 'var(--mut)', lineHeight: 1.6, margin: 0 }}>
              새로 가입하신 파트너 정보가 본사 관리자에게 전달되었습니다.<br />
              본사 승인이 완료되면 <strong>경기장 타임슬롯 오픈, QR 현장체크인, 건샵 장비 렌탈 및 매출 정산</strong> 등 모든 운영 기능이 자동으로 활성화됩니다.
            </p>

            {/* Submitted Info Pill */}
            <div style={{
              display: 'flex',
              gap: '14px',
              flexWrap: 'wrap',
              marginTop: '14px',
              padding: '10px 14px',
              background: 'var(--panel)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--line)',
              fontSize: '12px'
            }}>
              <div>
                <span style={{ color: 'var(--dim)' }}>상호명: </span>
                <strong style={{ color: 'var(--txt)' }}>{user.businessName || '미등록 (정보 수정 가능)'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--dim)' }}>대표자: </span>
                <strong style={{ color: 'var(--txt)' }}>{user.name || '미등록'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--dim)' }}>신청 계정: </span>
                <strong style={{ color: 'var(--acc)' }}>{user.email}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--dim)' }}>신청 분야: </span>
                <strong style={{ color: '#38bdf8' }}>{getRoleNames()}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '200px' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCheckStatus}
            disabled={isChecking}
            style={{
              fontWeight: 800,
              padding: '10px 16px',
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <RefreshCw size={15} className={isChecking ? 'spin' : ''} />
            <span>{isChecking ? '확인 중...' : '본사 승인 상태 확인하기'}</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setActiveTab('mypage')}
            style={{
              fontSize: '12px',
              padding: '8px 14px',
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Building2 size={14} />
            <span>신청 정보 수정 (마이페이지)</span>
            <ChevronRight size={13} />
          </button>

          <div style={{ fontSize: '11px', color: 'var(--dim)', textAlign: 'center', marginTop: '2px' }}>
            입점 승인 문의: <a href="mailto:hitinent@gmail.com" style={{ color: 'var(--acc)', fontWeight: 600 }}>hitinent@gmail.com</a>
          </div>
        </div>
      </div>
    </div>
  );
};
