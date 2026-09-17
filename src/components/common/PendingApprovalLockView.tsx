import React, { useState } from 'react';
import { 
  Lock, 
  Clock, 
  CheckCircle2, 
  RefreshCw, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  ShieldAlert, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';
import { PartnerService } from '../../services/partnerService';

export const PendingApprovalLockView: React.FC = () => {
  const { user, role, updateProfile, setActiveTab, showToast, triggerRefresh } = usePartner();
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckStatus = () => {
    setIsChecking(true);
    setTimeout(() => {
      const currentStatus = PartnerService.checkUserApproval(user.email, role);
      if (currentStatus === 'active') {
        updateProfile({ status: 'active' });
        showToast('🎉 축하합니다! 메인 관리자(jes0508@gmail.com)의 가맹 입점 승인이 완료되었습니다. 모든 운영 기능이 활성화되었습니다!', 'success');
        triggerRefresh();
      } else if (currentStatus === 'suspended') {
        showToast('현재 계정이 본사에 의해 보류/정지 상태입니다. 관리자(jes0508@gmail.com)에게 문의해주세요.', 'warning');
      } else {
        showToast('현재 메인 관리자(jes0508@gmail.com)의 승인 심사가 진행 중입니다. 승인 완료 시 자동으로 모든 기능이 개방됩니다.', 'info');
      }
      setIsChecking(false);
    }, 700);
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
    <div className="page-scrollable animate-fade-in" style={{ paddingBottom: '80px' }}>
      {/* Hero Lock Header Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 90, 31, 0.12) 0%, rgba(19, 27, 46, 0.95) 100%)',
        border: '1px solid rgba(255, 149, 0, 0.35)',
        borderRadius: 'var(--radius-xl)',
        padding: '36px 32px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Glow Orb */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 149, 0, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255, 149, 0, 0.25) 0%, rgba(255, 90, 31, 0.15) 100%)',
          border: '2px solid rgba(255, 149, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 18px auto',
          color: '#ff9500',
          boxShadow: '0 0 24px rgba(255, 149, 0, 0.3)'
        }}>
          <Lock size={36} />
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(255, 149, 0, 0.15)', border: '1px solid rgba(255, 149, 0, 0.4)', borderRadius: 'var(--radius-pill)', color: '#ff9500', fontSize: '12px', fontWeight: 800, marginBottom: '12px' }}>
          <Clock size={13} />
          <span>가맹 승인 대기 중 (PENDING APPROVAL)</span>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--txt)', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
          메인 관리자의 가맹 입점 승인 후 이용 가능합니다
        </h2>

        <p style={{ fontSize: '14.5px', color: 'var(--mut)', maxWidth: '640px', margin: '0 auto 24px auto', lineHeight: 1.65 }}>
          HIT IN 파트너 포털에 가입해 주셔서 감사합니다.<br />
          신규 파트너 회원은 <strong>메인 관리자(<span style={{ color: 'var(--acc)', fontWeight: 700 }}>jes0508@gmail.com</span>)의 서류 검토 및 승인</strong>이 완료된 후 타임슬롯 오픈, 실시간 현장 입장 체크인, 장비 렌탈 재고 관리, 정산 등 모든 운영 기능이 개방됩니다.
        </p>

        {/* CTA Button Group */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCheckStatus}
            disabled={isChecking}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(255, 90, 31, 0.35)'
            }}
          >
            <RefreshCw size={16} className={isChecking ? 'spin' : ''} />
            <span>{isChecking ? '승인 여부 확인 중...' : '🔄 실시간 본사 승인 상태 확인'}</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setActiveTab('mypage')}
            style={{
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Building2 size={16} />
            <span>신청 정보 및 사업장 수정 (마이페이지)</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* 3-Step Approval Timeline */}
      <div style={{
        marginTop: '24px',
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--txt)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="var(--acc)" />
          <span>입점 승인 절차 진행 현황</span>
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          {/* Step 1 */}
          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(47, 203, 126, 0.08)',
            border: '1px solid rgba(47, 203, 126, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <CheckCircle2 size={18} color="var(--green)" />
              <strong style={{ fontSize: '13px', color: 'var(--green)' }}>1단계. 가맹 신청 접수</strong>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--mut)', lineHeight: 1.5 }}>
              파트너 계정 가입 및 기본 정보 입력이 성공적으로 접수되었습니다.
            </p>
          </div>

          {/* Step 2 */}
          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 149, 0, 0.1)',
            border: '1px solid rgba(255, 149, 0, 0.4)',
            boxShadow: '0 0 12px rgba(255, 149, 0, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Clock size={18} color="#ff9500" />
              <strong style={{ fontSize: '13px', color: '#ff9500' }}>2단계. 메인 관리자 심사 (진행 중)</strong>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--mut)', lineHeight: 1.5 }}>
              메인 관리자(<strong>jes0508@gmail.com</strong>)가 사업자 정보 및 운영 분야를 확인 중입니다.
            </p>
          </div>

          {/* Step 3 */}
          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--panel)',
            border: '1px solid var(--line)',
            opacity: 0.75
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Lock size={18} color="var(--dim)" />
              <strong style={{ fontSize: '13px', color: 'var(--dim)' }}>3단계. 입점 승인 및 운영 개시</strong>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--dim)', lineHeight: 1.5 }}>
              승인 완료 즉시 모든 타임슬롯 예약, QR 입장, 건샵 재고 및 정산 기능이 자동 개방됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* Submitted Information Card */}
      <div style={{
        marginTop: '24px',
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--txt)', margin: 0 }}>
              제출된 파트너 가맹 신청 정보
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--mut)' }}>
              잘못 입력된 정보가 있다면 마이페이지에서 언제든지 수정할 수 있습니다.
            </span>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('mypage')}
            style={{ fontSize: '12px', gap: '6px' }}
          >
            <Building2 size={13} />
            <span>정보 수정하기</span>
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          fontSize: '13px'
        }}>
          <div style={{ padding: '12px 14px', background: 'var(--card2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            <span style={{ color: 'var(--dim)', fontSize: '11.5px', display: 'block', marginBottom: '4px' }}>사업장 상호명</span>
            <strong style={{ color: 'var(--txt)' }}>{user.businessName || '미등록 (마이페이지에서 입력 가능)'}</strong>
          </div>

          <div style={{ padding: '12px 14px', background: 'var(--card2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            <span style={{ color: 'var(--dim)', fontSize: '11.5px', display: 'block', marginBottom: '4px' }}>대표자 성명</span>
            <strong style={{ color: 'var(--txt)' }}>{user.name || '미등록'}</strong>
          </div>

          <div style={{ padding: '12px 14px', background: 'var(--card2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            <span style={{ color: 'var(--dim)', fontSize: '11.5px', display: 'block', marginBottom: '4px' }}>신청 계정 이메일</span>
            <strong style={{ color: 'var(--acc)' }}>{user.email}</strong>
          </div>

          <div style={{ padding: '12px 14px', background: 'var(--card2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            <span style={{ color: 'var(--dim)', fontSize: '11.5px', display: 'block', marginBottom: '4px' }}>대표 연락처</span>
            <strong style={{ color: 'var(--txt)' }}>{user.phone || '미등록'}</strong>
          </div>

          <div style={{ padding: '12px 14px', background: 'var(--card2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            <span style={{ color: 'var(--dim)', fontSize: '11.5px', display: 'block', marginBottom: '4px' }}>사업자 등록번호</span>
            <strong style={{ color: 'var(--txt)' }}>{user.businessNumber || '미등록'}</strong>
          </div>

          <div style={{ padding: '12px 14px', background: 'var(--card2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            <span style={{ color: 'var(--dim)', fontSize: '11.5px', display: 'block', marginBottom: '4px' }}>신청 운영 분야</span>
            <strong style={{ color: '#38bdf8' }}>{getRoleNames()}</strong>
          </div>
        </div>
      </div>

      {/* Locked Features Preview */}
      <div style={{
        marginTop: '24px',
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--txt)', margin: '0 0 6px 0' }}>
          🔒 승인 후 이용 가능한 파트너 기능 안내
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--mut)', margin: '0 0 16px 0' }}>
          메인 관리자의 승인이 완료되면 다음 기능들을 즉시 제한 없이 사용할 수 있습니다.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px'
        }}>
          {[
            { title: '통합 대시보드', desc: '일별/월별 매출, 오늘 입장 인원 및 예약 가동률 실시간 통계' },
            { title: '타임슬롯 & 예약 관리', desc: '경기 타임테이블 오픈, 유저 예약 승인/취소 및 수동 예약 등록' },
            { title: '실시간 현장 QR 입장', desc: '유저 QR 스캔으로 원터치 입장 체크인 및 카운트 집계' },
            { title: '사용자 포인트 & 매너평가', desc: '체크인 1,000P 지급, 상대팀 매너 평점 관리 및 수동 포인트' },
            { title: '건샵 장비 & 렌탈 재고', desc: '에어소프트 총기 렌탈, BB탄/가스 소모품 재고 및 현장 결제 연동' },
            { title: '필드 시설 및 FPS 규정', desc: '경기장 안내, 탄속 규정, 편의시설 및 사진 갤러리 관리' },
            { title: '정산 및 매출 분석', desc: '주별/월별 입금 정산 내역 및 플랫폼 수수료 명세서' }
          ].map((item, idx) => (
            <div key={idx} style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--panel)',
              border: '1px solid var(--line)',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start'
            }}>
              <div style={{ color: '#ff9500', marginTop: '2px' }}>
                <Lock size={15} />
              </div>
              <div>
                <strong style={{ fontSize: '12.5px', color: 'var(--txt)', display: 'block' }}>{item.title}</strong>
                <span style={{ fontSize: '11px', color: 'var(--dim)', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Support Info Box */}
      <div style={{
        marginTop: '24px',
        padding: '16px 20px',
        background: 'var(--panel)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--line)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Mail size={18} color="var(--acc)" />
          <span style={{ fontSize: '13px', color: 'var(--txt)' }}>
            입점 심사 빠른 승인 또는 문의 사항: <strong>jes0508@gmail.com</strong>
          </span>
        </div>
        <a 
          href="mailto:jes0508@gmail.com?subject=[HIT IN 파트너 입점 승인 요청]&body=상호명: ${encodeURIComponent(user.businessName)}%0D%0A대표자: ${encodeURIComponent(user.name)}%0D%0A이메일: ${encodeURIComponent(user.email)}"
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '12px', gap: '6px' }}
        >
          <ExternalLink size={12} />
          <span>관리자에게 이메일 문의하기</span>
        </a>
      </div>
    </div>
  );
};