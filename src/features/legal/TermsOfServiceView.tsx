import React from 'react';
import { 
  FileText, 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Building2, 
  Layers, 
  ExternalLink,
  Scale
} from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';

interface TermsOfServiceViewProps {
  onBack?: () => void;
  onNavigatePrivacy?: () => void;
}

export const TermsOfServiceView: React.FC<TermsOfServiceViewProps> = ({ onBack, onNavigatePrivacy }) => {
  const { theme, toggleTheme } = usePartner();

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/';
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg)',
      color: 'var(--txt)',
      paddingBottom: '80px',
      fontFamily: 'Pretendard, -apple-system, sans-serif'
    }}>
      {/* Sticky Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--panel)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--line)',
        padding: '14px 24px'
      }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handleGoBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                color: 'var(--txt)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={15} />
              <span>돌아가기</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                background: 'var(--acc)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 800,
                padding: '2px 7px',
                borderRadius: '4px'
              }}>
                HIT IN
              </span>
              <span style={{ fontSize: '15px', fontWeight: 800 }}>파트너 센터</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {onNavigatePrivacy && (
              <button
                onClick={onNavigatePrivacy}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--mut)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                개인정보처리방침 보기 →
              </button>
            )}
            <button
              onClick={toggleTheme}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--line)',
                color: 'var(--txt)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {theme === 'dark' ? '☀️ 라이트 모드' : '🌙 다크 모드'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{
        maxWidth: '960px',
        margin: '32px auto 0',
        padding: '0 20px'
      }}>
        {/* Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 90, 31, 0.12) 0%, rgba(66, 133, 244, 0.12) 100%)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Scale size={26} color="var(--acc)" />
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: 'var(--txt)' }}>
              서비스 이용약관
            </h1>
            <span style={{ fontSize: '14px', color: 'var(--dim)', fontWeight: 500 }}>(Application Terms of Service)</span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--mut)', margin: '8px 0 16px 0', lineHeight: 1.6 }}>
            HIT IN 파트너 센터(https://partner.hitin.kr) 웹 및 애플리케이션 서비스를 이용함에 있어 회사와 파트너 회원 간의 권리, 의무 및 책임사항, 서비스 이용 조건 및 절차를 규정합니다.
          </p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--dim)', flexWrap: 'wrap' }}>
            <span>• <strong>적용 대상:</strong> HIT IN 파트너 웹/앱 이용 사업자 및 회원</span>
            <span>• <strong>최종 개정일:</strong> 2025년 3월 1일</span>
            <span>• <strong>시행일자:</strong> 2025년 3월 1일</span>
          </div>
        </div>

        {/* Content Box */}
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px'
        }}>

          {/* Section 1 */}
          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '16.5px', fontWeight: 700, color: 'var(--txt)', borderBottom: '1px solid var(--line)', paddingBottom: '8px', marginBottom: '12px' }}>
              제1조 (목적)
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--mut)', lineHeight: 1.7, margin: 0 }}>
              본 약관은 HIT IN(이하 "회사")이 운영하는 HIT IN 파트너 센터(partner.hitin.kr)에서 제공하는 경기장/아레나 예약 관리, 실시간 QR 체크인, 건샵 용품 재고 관리, 매출 정산 및 플랫폼 관제 시스템의 공정하고 투명한 이용에 관한 제반 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          {/* Section 2 */}
          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '16.5px', fontWeight: 700, color: 'var(--txt)', borderBottom: '1px solid var(--line)', paddingBottom: '8px', marginBottom: '12px' }}>
              제2조 (용어의 정의)
            </h2>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13.5px', color: 'var(--mut)', lineHeight: 1.7 }}>
              <li><strong>"서비스":</strong> 회사가 파트너 회원에게 제공하는 웹 및 애플리케이션의 모든 운영 솔루션과 관리 도구</li>
              <li><strong>"파트너 회원":</strong> 본 약관에 동의하고 Google 소셜 연동 또는 회원가입을 통해 계정을 생성하여 서비스를 이용하는 필드/아레나, 건샵/용품점 운영자 및 본사 관리자</li>
              <li><strong>"Google OAuth 연동":</strong> Google 계정 인증 시스템을 통하여 간편하고 안전하게 로그인 및 회원 식별을 수행하는 소셜 인증 방식</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '16.5px', fontWeight: 700, color: 'var(--txt)', borderBottom: '1px solid var(--line)', paddingBottom: '8px', marginBottom: '12px' }}>
              제3조 (약관의 효력 및 개정)
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--mut)', lineHeight: 1.7, margin: '0 0 8px 0' }}>
              1. 회사는 본 약관의 내용을 파트너 회원이 쉽게 알 수 있도록 서비스 초기 화면 또는 연결 화면(https://partner.hitin.kr/terms)에 게시합니다.
            </p>
            <p style={{ fontSize: '13.5px', color: 'var(--mut)', lineHeight: 1.7, margin: 0 }}>
              2. 회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있으며, 개정 시 적용일자 7일 전(중요한 변경의 경우 30일 전)부터 웹사이트를 통해 공지합니다.
            </p>
          </section>

          {/* Section 4 */}
          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '16.5px', fontWeight: 700, color: 'var(--txt)', borderBottom: '1px solid var(--line)', paddingBottom: '8px', marginBottom: '12px' }}>
              제4조 (이용계약 체결 및 Google OAuth 연동)
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--mut)', lineHeight: 1.7, margin: '0 0 10px 0' }}>
              1. 이용계약은 파트너 회원이 되고자 하는 자가 본 약관 및 개인정보처리방침에 동의한 후 Google 소셜 로그인 또는 자체 가입 절차를 거쳐 완료됩니다.
            </p>
            <div style={{
              background: 'rgba(66, 133, 244, 0.08)',
              border: '1px solid rgba(66, 133, 244, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              fontSize: '13px',
              color: 'var(--txt)',
              lineHeight: 1.6
            }}>
              <strong>🔐 Google OAuth 데이터 보안 정책:</strong><br />
              Google 로그인 시 수집되는 정보는 인증 및 회원 식별용으로만 제한적으로 사용되며, Google API 서비스 사용자 데이터 정책(Limited Use Requirements)을 철저히 준수합니다.
            </div>
          </section>

          {/* Section 5 */}
          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '16.5px', fontWeight: 700, color: 'var(--txt)', borderBottom: '1px solid var(--line)', paddingBottom: '8px', marginBottom: '12px' }}>
              제5조 (서비스의 내용)
            </h2>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13.5px', color: 'var(--mut)', lineHeight: 1.7 }}>
              <li>타임슬롯 & 정기전 게임 예약 등록 및 실시간 관제</li>
              <li>현장 QR 체크인 스캐너 및 입장객 상태 확인</li>
              <li>건샵 밀리터리 장비 및 렌탈 용품 재고 관리</li>
              <li>매출 통계 분석 및 정산 대사 명세서 제공</li>
              <li>다중 운영 분야 권한 설정 및 프로필/데이터 관리</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '16.5px', fontWeight: 700, color: 'var(--txt)', borderBottom: '1px solid var(--line)', paddingBottom: '8px', marginBottom: '12px' }}>
              제6조 (개인정보보호 및 데이터 파기)
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--mut)', lineHeight: 1.7, margin: 0 }}>
              회사는 개인정보 보호법 등 관계 법령이 정하는 바에 따라 파트너 회원의 개인정보를 보호하며, 구체적인 수집 항목, 목적, 공유 여부 및 삭제 요청 절차는 회사의 <a 
                href="/privacy" 
                onClick={(e) => {
                  if (onNavigatePrivacy) {
                    e.preventDefault();
                    onNavigatePrivacy();
                  }
                }}
                style={{ color: 'var(--acc)', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}
              >개인정보처리방침</a>에 따릅니다.
            </p>
          </section>

          {/* Section 7 */}
          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '16.5px', fontWeight: 700, color: 'var(--txt)', borderBottom: '1px solid var(--line)', paddingBottom: '8px', marginBottom: '12px' }}>
              제7조 (계약 해지 및 회원 탈퇴)
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--mut)', lineHeight: 1.7, margin: 0 }}>
              파트너 회원은 서비스 내 [내 정보 수정] &gt; [회원 탈퇴 및 데이터 삭제] 또는 고객지원 이메일(support@hit-in.app / privacy@hit-in.app)을 통해 언제든지 이용계약 해지 및 데이터 영구 파기를 요청할 수 있습니다.
            </p>
          </section>

          {/* Section 8 & Contact */}
          <section>
            <h2 style={{ fontSize: '16.5px', fontWeight: 700, color: 'var(--txt)', borderBottom: '1px solid var(--line)', paddingBottom: '8px', marginBottom: '12px' }}>
              제8조 (고객지원 및 문의처)
            </h2>
            <div style={{
              background: 'var(--panel)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              fontSize: '13px',
              color: 'var(--mut)',
              lineHeight: 1.7
            }}>
              <p style={{ margin: 0 }}>• <strong>서비스명:</strong> HIT IN 파트너 센터 (https://partner.hitin.kr)</p>
              <p style={{ margin: 0 }}>• <strong>운영사:</strong> HitInEnt</p>
              <p style={{ margin: 0 }}>• <strong>고객지원 이메일:</strong> hitinent@gmail.com</p>
              <p style={{ margin: 0 }}>• <strong>공식 웹사이트:</strong> <a href="https://partner.hitin.kr" style={{ color: 'var(--acc)' }}>https://partner.hitin.kr</a></p>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '32px 20px',
        fontSize: '12px',
        color: 'var(--dim)',
        borderTop: '1px solid var(--line)',
        marginTop: '60px'
      }}>
        © 2026 HitInEnt. All rights reserved. | <a href="/terms" style={{ color: 'var(--dim)', textDecoration: 'underline' }}>이용약관</a> | <a 
          href="/privacy" 
          onClick={(e) => {
            if (onNavigatePrivacy) {
              e.preventDefault();
              onNavigatePrivacy();
            }
          }}
          style={{ color: 'var(--dim)', textDecoration: 'underline', cursor: 'pointer' }}
        >개인정보처리방침</a>
      </footer>
    </div>
  );
};
