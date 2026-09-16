import React from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Mail, 
  Trash2, 
  Share2, 
  Database, 
  Lock, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sun,
  Moon
} from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';

interface PrivacyPolicyViewProps {
  onBack?: () => void;
  onNavigateTerms?: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onBack, onNavigateTerms }) => {
  const { theme, toggleTheme } = usePartner();

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      if (typeof window !== 'undefined' && window.history.length > 1) {
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
            {onNavigateTerms && (
              <button
                onClick={onNavigateTerms}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--mut)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                이용약관 ↗
              </button>
            )}
            <button
              onClick={toggleTheme}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--line)',
                color: 'var(--txt)',
                padding: '6px 10px',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {theme === 'dark' ? <Sun size={14} color="#FBBF24" /> : <Moon size={14} color="#60A5FA" />}
              <span>{theme === 'dark' ? '라이트' : '다크'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '960px', margin: '32px auto 0', padding: '0 20px' }}>
        
        {/* Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 90, 31, 0.12) 0%, rgba(96, 165, 250, 0.12) 100%)',
          border: '1px solid var(--line)',
          borderLeft: '4px solid var(--acc)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ShieldCheck size={24} color="var(--acc)" />
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--acc)', letterSpacing: '0.05em' }}>
              LEGAL &amp; PRIVACY POLICY
            </span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px 0' }}>
            HIT IN 개인정보처리방침
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--mut)', lineHeight: 1.6, margin: 0 }}>
            HitInEnt(이하 “회사”)는 「개인정보 보호법」 등 관련 법령을 준수하며, 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리하기 위하여 다음과 같이 개인정보처리방침을 수립·공개합니다.
          </p>
          <div style={{ fontSize: '12.5px', color: 'var(--dim)', marginTop: '8px' }}>
            적용 대상: HIT IN 서비스 및 <code style={{ color: 'var(--txt)' }}>https://partner.hitin.kr</code>에서 제공되는 관련 서비스
          </div>
        </div>

        {/* Google OAuth 4 Essential Points Summary */}
        <div style={{
          background: 'rgba(96, 165, 250, 0.08)',
          border: '1px solid rgba(96, 165, 250, 0.25)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <CheckCircle2 size={18} color="#60A5FA" />
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#60A5FA', margin: 0 }}>
              Google OAuth 2.0 사용자 데이터 정책 필수 요약 고지
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'var(--card)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--txt)', marginBottom: '4px' }}>1. 수집하는 데이터</div>
              <div style={{ fontSize: '11.5px', color: 'var(--mut)', lineHeight: 1.5 }}>Google 이메일, 이름, 프로필 사진, 고유 식별자 (비밀번호 미수집)</div>
            </div>
            <div style={{ background: 'var(--card)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--txt)', marginBottom: '4px' }}>2. 수집 및 이용 목적</div>
              <div style={{ fontSize: '11.5px', color: 'var(--mut)', lineHeight: 1.5 }}>파트너 회원 식별, 로그인 유지, 예약/체크인 및 정산 관리</div>
            </div>
            <div style={{ background: 'var(--card)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--txt)', marginBottom: '4px' }}>3. 제3자 미공유 원칙</div>
              <div style={{ fontSize: '11.5px', color: 'var(--mut)', lineHeight: 1.5 }}>제3자 미제공 (Google API Limited Use 정책 준수)</div>
            </div>
            <div style={{ background: 'var(--card)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--txt)', marginBottom: '4px' }}>4. 데이터 삭제 요청</div>
              <div style={{ fontSize: '11.5px', color: 'var(--mut)', lineHeight: 1.5 }}>이메일(hitinent@gmail.com) 요청 시 즉시 영구 파기</div>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="card" style={{ padding: '32px 36px', lineHeight: 1.75, fontSize: '14px', color: 'var(--mut)' }}>
          
          {/* 제1조 */}
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--txt)', margin: '0 0 12px 0', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
            제1조 개인정보의 처리 목적
          </h2>
          <p style={{ marginTop: 0 }}>
            회사는 다음 목적을 위하여 개인정보를 처리합니다. 수집한 개인정보는 아래 목적 이외의 용도로 이용하지 않으며, 이용 목적이 변경되는 경우 관련 법령에 따라 별도의 동의를 받는 등 필요한 조치를 취합니다.
          </p>

          <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#38bdf8', margin: '14px 0 6px 0' }}>1. 회원 가입 및 로그인</h3>
          <ul style={{ paddingLeft: '20px', margin: '0 0 14px 0' }}>
            <li>회원 식별 및 본인 확인</li>
            <li>Google 등 소셜 로그인 제공</li>
            <li>중복 가입 방지</li>
            <li>회원 계정 관리</li>
            <li>부정 이용 방지</li>
          </ul>

          <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#38bdf8', margin: '14px 0 6px 0' }}>2. HIT IN 서비스 제공</h3>
          <ul style={{ paddingLeft: '20px', margin: '0 0 14px 0' }}>
            <li>제휴업체 및 파트너 서비스 제공</li>
            <li>예약 및 이용 내역 관리</li>
            <li>서비스 이용 기록 관리</li>
            <li>회원 문의 및 고객지원</li>
            <li>공지사항 및 서비스 관련 안내</li>
          </ul>

          <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#38bdf8', margin: '14px 0 6px 0' }}>3. 서비스 운영 및 보안</h3>
          <ul style={{ paddingLeft: '20px', margin: '0 0 14px 0' }}>
            <li>비정상적인 접근 및 부정 이용 방지</li>
            <li>서비스 장애 분석 및 보안 강화</li>
            <li>법령 및 이용약관 위반 행위 대응</li>
          </ul>

          {/* 제2조 */}
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--txt)', margin: '28px 0 12px 0', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
            제2조 수집하는 개인정보 항목 및 수집 방법
          </h2>
          <p style={{ marginTop: 0 }}>회사는 서비스 제공을 위하여 필요한 범위 내에서 개인정보를 수집합니다.</p>

          <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#38bdf8', margin: '14px 0 6px 0' }}>1. Google 로그인을 통해 수집하는 정보</h3>
          <p style={{ margin: '0 0 8px 0' }}>이용자가 <strong>“Google로 로그인”</strong> 기능을 이용하는 경우 Google OAuth 인증을 통해 다음 정보를 제공받을 수 있습니다.</p>
          <ul style={{ paddingLeft: '20px', margin: '0 0 10px 0' }}>
            <li>Google 계정 이메일 주소</li>
            <li>이름</li>
            <li>프로필 사진</li>
            <li>Google 계정 사용자 식별정보</li>
            <li>로그인 인증에 필요한 OAuth 인증정보</li>
          </ul>
          <p style={{ margin: '0 0 14px 0' }}>
            Google OAuth 인증정보는 Google 로그인 및 사용자 정보 확인을 위한 목적으로만 사용되며, <strong>회사는 Google 계정의 비밀번호를 수집하거나 저장하지 않습니다.</strong>
          </p>

          <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#38bdf8', margin: '14px 0 6px 0' }}>2. 서비스 이용 과정에서 생성될 수 있는 정보</h3>
          <ul style={{ paddingLeft: '20px', margin: '0 0 14px 0' }}>
            <li>로그인 기록, 서비스 이용 기록, 접속 일시, IP 주소, 브라우저 및 기기 정보, 오류 및 보안 관련 기록</li>
          </ul>

          <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#38bdf8', margin: '14px 0 6px 0' }}>3. 수집 방법</h3>
          <ul style={{ paddingLeft: '20px', margin: '0 0 14px 0' }}>
            <li>회원가입 및 서비스 이용 과정에서 이용자가 직접 입력</li>
            <li>Google OAuth 로그인 과정에서 이용자가 정보 제공에 동의한 경우</li>
            <li>서비스 이용 과정에서 자동 생성 및 고객센터 문의 시 직접 제공</li>
          </ul>

          {/* 제3조 */}
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--txt)', margin: '28px 0 12px 0', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
            제3조 Google 사용자 데이터의 이용
          </h2>
          <p style={{ marginTop: 0 }}>회사는 Google 로그인으로 제공받은 사용자 데이터를 다음 목적으로만 이용합니다.</p>
          <ul style={{ paddingLeft: '20px', margin: '0 0 12px 0' }}>
            <li><strong>Google 이메일 주소:</strong> 회원 식별, 로그인 계정 확인, 중복 가입 방지, 서비스 계정과 Google 계정 연결</li>
            <li><strong>이름:</strong> 회원 식별, 서비스 내 사용자 정보 표시</li>
            <li><strong>프로필 사진:</strong> 회원 프로필 표시 등 서비스 이용 편의 제공</li>
            <li><strong>Google 사용자 식별정보:</strong> 동일 Google 계정 여부 확인, 계정 연결 및 로그인 유지</li>
          </ul>
          <p style={{ margin: 0 }}>
            회사는 Google 사용자 데이터를 본 개인정보처리방침에 명시된 목적을 벗어나 사용하지 않으며, Google API 서비스 사용자 데이터 정책(Limited Use Requirements)을 철저히 준수합니다.
          </p>

          {/* 제4조 */}
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--txt)', margin: '28px 0 12px 0', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
            제4조 Google 사용자 데이터의 저장 및 보관
          </h2>
          <p style={{ marginTop: 0 }}>
            회사는 Google 로그인을 통해 제공받은 개인정보 중 서비스 운영에 필요한 정보(이메일, 이름, 프로필, 연결 식별정보)만 저장하며, Google 계정 비밀번호는 저장하지 않습니다.
          </p>
          <p style={{ margin: 0 }}>
            OAuth Access Token 등 인증정보는 Google API 인증 및 로그인 처리 목적으로만 사용하며, 인증 처리 후 안전하게 폐기합니다.
          </p>

          {/* 제5조 */}
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--txt)', margin: '28px 0 12px 0', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
            제5조 개인정보의 처리 및 보유기간
          </h2>
          <p style={{ marginTop: 0 }}>
            회사는 개인정보의 처리 목적이 달성되면 해당 개인정보를 지체 없이 파기합니다.
          </p>
          <ul style={{ paddingLeft: '20px', margin: '0 0 12px 0' }}>
            <li><strong>회원정보 및 Google 연동정보:</strong> 회원 탈퇴 또는 Google 계정 연동 해제 시까지</li>
            <li><strong>고객 문의 기록:</strong> 관련 업무 처리 완료 후 필요한 기간</li>
            <li><strong>법령상 의무 보관 정보:</strong> 전자상거래법 등 관련 법령에서 정한 보존 기간 동안 보관</li>
          </ul>

          {/* 제6조 */}
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--txt)', margin: '28px 0 12px 0', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
            제6조 개인정보의 파기 절차 및 방법
          </h2>
          <p style={{ marginTop: 0 }}>
            회사는 개인정보 보유기간이 경과하거나 처리 목적이 달성된 경우 지체 없이 파기합니다. 전자적 파일 형태의 정보는 복구 또는 재생이 불가능한 기술적 방법을 사용하여 영구 삭제합니다.
          </p>

          {/* 제7조 */}
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--txt)', margin: '28px 0 12px 0', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
            제7조 Google 데이터 및 계정 삭제 요청
          </h2>
          <p style={{ marginTop: 0 }}>
            이용자는 언제든지 Google 계정 연동 또는 Google 로그인을 통해 수집된 개인정보의 삭제를 요청할 수 있습니다.
          </p>
          <div style={{ background: 'var(--panel)', padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', margin: '12px 0' }}>
            <p style={{ margin: 0, color: 'var(--txt)' }}>
              📧 <strong>데이터 삭제 요청 전용 이메일:</strong> <code style={{ color: 'var(--acc)', fontSize: '14px' }}>hitinent@gmail.com</code>
            </p>
          </div>
          <p style={{ margin: '8px 0 0 0' }}>
            삭제 요청 시 가입 이메일 및 Google 연동 이메일을 함께 전달해주시면 본인 확인 후 즉시 파기 처리됩니다. 또한 Google 계정 보안 설정에서도 서비스 연결 권한을 직접 해제하실 수 있습니다.
          </p>

          {/* 제8조 */}
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--txt)', margin: '28px 0 12px 0', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
            제8조 개인정보의 제3자 제공
          </h2>
          <p style={{ margin: 0 }}>
            회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 이용자가 사전에 동의한 경우 또는 법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 요구가 있는 경우는 예외로 합니다.
          </p>

          {/* 제9조 */}
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--txt)', margin: '28px 0 12px 0', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
            제9조 개인정보 처리업무의 위탁
          </h2>
          <p style={{ marginTop: 0 }}>
            회사는 서비스 운영 과정에서 필요한 경우 개인정보 처리업무의 일부를 다음과 같이 외부 전문업체에 위탁하여 운영하고 있습니다.
          </p>
          <ul style={{ paddingLeft: '20px', margin: '0 0 12px 0' }}>
            <li><strong>클라우드 인프라 및 서버 호스팅:</strong> 스마일서브 (iwinV) - 서비스 시스템 운영 및 데이터베이스 보관</li>
            <li><strong>소셜 로그인 인증:</strong> Google LLC (Google OAuth 2.0), (주)카카오 (Kakao Login)</li>
          </ul>

          {/* 제10조 */}
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--txt)', margin: '28px 0 12px 0', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
            제10조 정보주체의 권리·의무 및 행사방법
          </h2>
          <p style={{ margin: 0 }}>
            이용자는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구, 회원 탈퇴 및 Google 계정 연동 해제 권리를 행사할 수 있으며, 서비스 내 마이페이지 기능 또는 대표 이메일(<code>hitinent@gmail.com</code>)을 통해 요청하시면 지체 없이 조치합니다.
          </p>

          {/* 제11조 */}
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--txt)', margin: '28px 0 12px 0', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
            제11조 개인정보의 안전성 확보조치
          </h2>
          <p style={{ margin: 0 }}>
            회사는 개인정보의 분실·도난·유출·변조·훼손을 방지하기 위하여 개인정보 접근권한 최소화, 중요정보 암호화, 방화벽 통제, 정기적 보안 패치 및 전송 구간 HTTPS(SSL/TLS) 암호화 통신을 철저히 적용하고 있습니다.
          </p>

          {/* 제12조 */}
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--txt)', margin: '28px 0 12px 0', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
            제12조 자동으로 수집되는 정보
          </h2>
          <p style={{ margin: 0 }}>
            서비스 안정성 및 보안 모니터링을 위해 IP 주소, 접속 일시, 서비스 이용 기록, 기기/브라우저 정보 및 오류 로그가 자동으로 수집될 수 있습니다.
          </p>

          {/* 제13조 */}
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--txt)', margin: '28px 0 12px 0', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
            제13조 개인정보 보호책임자 및 문의처
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
            margin: '14px 0'
          }}>
            <div style={{ background: 'var(--panel)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
              <div style={{ fontSize: '11px', color: 'var(--dim)', marginBottom: '2px' }}>개인정보처리자 (회사명)</div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--txt)' }}>HitInEnt</div>
            </div>
            <div style={{ background: 'var(--panel)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
              <div style={{ fontSize: '11px', color: 'var(--dim)', marginBottom: '2px' }}>서비스명</div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--txt)' }}>HIT IN (파트너 센터)</div>
            </div>
            <div style={{ background: 'var(--panel)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
              <div style={{ fontSize: '11px', color: 'var(--dim)', marginBottom: '2px' }}>개인정보 보호책임자 / 담당부서</div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--txt)' }}>Hitin파트너관리부</div>
            </div>
            <div style={{ background: 'var(--panel)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
              <div style={{ fontSize: '11px', color: 'var(--dim)', marginBottom: '2px' }}>대표 및 삭제요청 이메일</div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--acc)' }}>hitinent@gmail.com</div>
            </div>
          </div>

          {/* 제14조 */}
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--txt)', margin: '28px 0 12px 0', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
            제14조 권익침해 구제방법
          </h2>
          <ul style={{ paddingLeft: '20px', margin: '0 0 12px 0' }}>
            <li>개인정보침해신고센터: (국번없이) 118 (privacy.kisa.or.kr)</li>
            <li>개인정보분쟁조정위원회: 1833-6972 (www.kopico.go.kr)</li>
            <li>대검찰청 사이버수사과: (국번없이) 1301 (www.spo.go.kr)</li>
            <li>경찰청 사이버수사국: (국번없이) 182 (ecrm.police.go.kr)</li>
          </ul>

          {/* 제15조 */}
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--txt)', margin: '28px 0 12px 0', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
            제15조 개인정보처리방침의 변경
          </h2>
          <div style={{ padding: '12px 16px', background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', fontSize: '12.5px' }}>
            <div>• <strong>공고일자:</strong> 2026년 9월 16일</div>
            <div style={{ marginTop: '4px' }}>• <strong>시행일자:</strong> 2026년 9월 16일</div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer style={{
        marginTop: '60px',
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--dim)'
      }}>
        <p>© 2026 HitInEnt. All rights reserved.</p>
        <p style={{ marginTop: '4px' }}>
          <a 
            href="/terms" 
            onClick={(e) => {
              if (onNavigateTerms) {
                e.preventDefault();
                onNavigateTerms();
              }
            }}
            style={{ color: 'var(--mut)', textDecoration: 'underline', cursor: 'pointer' }}
          >
            서비스 이용약관
          </a> • <a href="/privacy" style={{ color: 'var(--acc)', fontWeight: 700, textDecoration: 'underline' }}>개인정보처리방침</a> • 대표 웹사이트: <a href="https://partner.hitin.kr" style={{ color: 'var(--dim)' }}>partner.hitin.kr</a>
        </p>
      </footer>
    </div>
  );
};
