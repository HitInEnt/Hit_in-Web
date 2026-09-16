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
  AlertCircle
} from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';

interface PrivacyPolicyViewProps {
  onBack?: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onBack }) => {
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
            <ShieldCheck size={26} color="var(--acc)" />
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: 'var(--txt)' }}>
              개인정보처리방침
            </h1>
            <span style={{ fontSize: '14px', color: 'var(--dim)', fontWeight: 500 }}>(Privacy Policy)</span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--mut)', margin: '8px 0 16px 0', lineHeight: 1.6 }}>
            HIT IN 파트너 센터(https://partner.hitin.kr)는 정보주체의 자유와 권리 보호를 위해 「개인정보 보호법」 및 관계 법령을 준수하며, 이용자의 소중한 개인정보를 안전하게 처리하고 보호하기 위한 방침을 명확히 고지합니다.
          </p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--dim)', flexWrap: 'wrap' }}>
            <span>• <strong>적용 대상:</strong> HIT IN 파트너 웹/앱 이용자 및 회원</span>
            <span>• <strong>최종 개정일:</strong> 2025년 3월 1일</span>
            <span>• <strong>시행일자:</strong> 2025년 3월 1일</span>
          </div>
        </div>

        {/* 4대 필수 항목 요약 카드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '14px',
          marginBottom: '28px'
        }}>
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderLeft: '4px solid #4285F4',
            borderRadius: 'var(--radius-md)',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '13.5px', color: 'var(--txt)', marginBottom: '6px' }}>
              <Database size={16} color="#4285F4" />
              <span>1. 수집하는 데이터</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--mut)', lineHeight: 1.5 }}>
              Google 소셜 로그인 시 이메일, 이름, 프로필 이미지 URL, 고유 계정 식별자를 수집합니다.
            </div>
          </div>

          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderLeft: '4px solid #10B981',
            borderRadius: 'var(--radius-md)',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '13.5px', color: 'var(--txt)', marginBottom: '6px' }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span>2. 수집 목적</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--mut)', lineHeight: 1.5 }}>
              파트너 식별, 로그인 세션 유지, 예약/체크인/정산 관제 및 긴급 공지 알림에만 사용합니다.
            </div>
          </div>

          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderLeft: '4px solid var(--acc)',
            borderRadius: 'var(--radius-md)',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '13.5px', color: 'var(--txt)', marginBottom: '6px' }}>
              <Lock size={16} color="var(--acc)" />
              <span>3. 데이터 공유 여부</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--mut)', lineHeight: 1.5 }}>
              제3자에게 판매하거나 무단 공유하지 않으며, Google 사용자 데이터 정책을 엄격히 준수합니다.
            </div>
          </div>

          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderLeft: '4px solid #8B5CF6',
            borderRadius: 'var(--radius-md)',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '13.5px', color: 'var(--txt)', marginBottom: '6px' }}>
              <Trash2 size={16} color="#8B5CF6" />
              <span>4. 데이터 삭제 요청</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--mut)', lineHeight: 1.5 }}>
              이메일(privacy@hit-in.app) 또는 앱 내 탈퇴 메뉴를 통해 언제든지 즉시 삭제를 요청할 수 있습니다.
            </div>
          </div>
        </div>

        {/* Full Details Content Box */}
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px'
        }}>

          {/* Section 1 */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '17px',
              fontWeight: 700,
              color: 'var(--txt)',
              borderBottom: '1px solid var(--line)',
              paddingBottom: '8px',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                background: 'var(--acc)',
                color: '#fff',
                fontSize: '11px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800
              }}>1</span>
              <span>수집하는 개인정보 항목 (Data Collected)</span>
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--mut)', lineHeight: 1.6, marginBottom: '12px' }}>
              HIT IN 파트너 센터는 서비스 제공 및 사용자 인증을 위해 필요한 최소한의 개인정보만을 수집합니다.
            </p>

            <div style={{
              background: 'rgba(66, 133, 244, 0.08)',
              border: '1px solid rgba(66, 133, 244, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              marginBottom: '16px',
              fontSize: '13px',
              lineHeight: 1.6
            }}>
              <strong style={{ color: '#60A5FA', display: 'block', marginBottom: '6px' }}>
                🔍 Google 소셜 로그인(OAuth 2.0) 시 수집하는 정보:
              </strong>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--txt)' }}>
                <li><strong>Google 계정 이메일 주소 (Email Address)</strong>: 계정 식별 및 알림 발송</li>
                <li><strong>프로필 이름 및 닉네임 (Name / Profile Name)</strong>: 파트너 담당자 표기</li>
                <li><strong>프로필 사진 URL (Profile Picture)</strong>: 서비스 내 아바타 표시</li>
                <li><strong>Google 계정 고유 식별자 (Google User ID / Sub)</strong>: OAuth 안전 인증 및 세션 연동</li>
              </ul>
            </div>

            <div style={{ overflowX: 'auto', margin: '14px 0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--panel)' }}>
                    <th style={{ padding: '10px 12px', border: '1px solid var(--line)', color: 'var(--txt)' }}>구분</th>
                    <th style={{ padding: '10px 12px', border: '1px solid var(--line)', color: 'var(--txt)' }}>수집 항목</th>
                    <th style={{ padding: '10px 12px', border: '1px solid var(--line)', color: 'var(--txt)' }}>수집 방법</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '10px 12px', border: '1px solid var(--line)', fontWeight: 600 }}>소셜 로그인 (Google / Kakao)</td>
                    <td style={{ padding: '10px 12px', border: '1px solid var(--line)', color: 'var(--mut)' }}>이메일 주소, 이름(닉네임), 프로필 이미지 URL, 고유 식별자</td>
                    <td style={{ padding: '10px 12px', border: '1px solid var(--line)', color: 'var(--mut)' }}>사용자 동의 후 OAuth API 자동 수집</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 12px', border: '1px solid var(--line)', fontWeight: 600 }}>파트너 자체 가입</td>
                    <td style={{ padding: '10px 12px', border: '1px solid var(--line)', color: 'var(--mut)' }}>사업자등록번호, 상호명, 대표자 성명, 연락처, 이메일, 비밀번호(암호화)</td>
                    <td style={{ padding: '10px 12px', border: '1px solid var(--line)', color: 'var(--mut)' }}>회원가입 양식 직접 입력</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 12px', border: '1px solid var(--line)', fontWeight: 600 }}>서비스 이용 자동 수집</td>
                    <td style={{ padding: '10px 12px', border: '1px solid var(--line)', color: 'var(--mut)' }}>접속 IP, 쿠키(Cookie), 접속 로그, 서비스 이용 기록</td>
                    <td style={{ padding: '10px 12px', border: '1px solid var(--line)', color: 'var(--mut)' }}>시스템 접속 시 자동 생성</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 2 */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '17px',
              fontWeight: 700,
              color: 'var(--txt)',
              borderBottom: '1px solid var(--line)',
              paddingBottom: '8px',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                background: 'var(--acc)',
                color: '#fff',
                fontSize: '11px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800
              }}>2</span>
              <span>개인정보 수집 및 이용 목적 (Purpose of Collection)</span>
            </h2>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13.5px', color: 'var(--mut)', lineHeight: 1.7 }}>
              <li><strong>회원 식별 및 인증:</strong> 파트너 회원 가입 의사 확인, 본인 식별, 중복 가입 방지, 부정 이용 방지</li>
              <li><strong>서비스 로그인 상태 유지:</strong> 안전한 토큰 기반 세션 관리 및 보안 유지</li>
              <li><strong>HIT IN 파트너 솔루션 제공:</strong> 경기장 타임슬롯 예약 관리, 실시간 QR 체크인, 건샵 장비/렌탈 재고 관리, 매출 정산 및 대사 업무</li>
              <li><strong>고객 지원 및 고지사항 전달:</strong> 시스템 공지, 보안 알림, 고객 문의 답변 및 분쟁 처리</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '17px',
              fontWeight: 700,
              color: 'var(--txt)',
              borderBottom: '1px solid var(--line)',
              paddingBottom: '8px',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                background: 'var(--acc)',
                color: '#fff',
                fontSize: '11px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800
              }}>3</span>
              <span>개인정보의 제3자 제공 및 데이터 공유 (Data Sharing)</span>
            </h2>
            <div style={{
              background: 'rgba(255, 90, 31, 0.08)',
              border: '1px solid rgba(255, 90, 31, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              marginBottom: '14px',
              fontSize: '13px',
              lineHeight: 1.6
            }}>
              <strong style={{ color: 'var(--acc)' }}>🔒 제3자 미제공 및 불공유 원칙:</strong><br />
              HIT IN 파트너 센터는 이용자의 사전 동의 없이 개인정보를 제3자에게 판매, 대여, 제공 또는 공유하지 않습니다.
            </div>
            <p style={{ fontSize: '13px', color: 'var(--mut)', lineHeight: 1.6, marginBottom: '10px' }}>
              단, 관계 법령에 의거하여 제출 의무가 발생하는 법정 요구가 있는 경우에 한하여 최소한의 범위 내에서만 처리됩니다.
            </p>
            <div style={{
              background: 'rgba(66, 133, 244, 0.08)',
              border: '1px solid rgba(66, 133, 244, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              fontSize: '13px',
              lineHeight: 1.6
            }}>
              <strong style={{ color: '#60A5FA' }}>📋 Google API 서비스 사용자 데이터 정책 준수 (Limited Use):</strong><br />
              당사는 Google API로부터 수집된 사용자 데이터를 Google의 제한적 사용 요건(Limited Use Requirements)에 따라 처리하며, 타사 광고 타겟팅이나 AI/머신러닝 모델 학습에 일체 활용하지 않습니다.
            </div>
          </section>

          {/* Section 4 */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '17px',
              fontWeight: 700,
              color: 'var(--txt)',
              borderBottom: '1px solid var(--line)',
              paddingBottom: '8px',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                background: 'var(--acc)',
                color: '#fff',
                fontSize: '11px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800
              }}>4</span>
              <span>데이터 삭제 요청 및 이용자 권리 행사 방법 (Data Deletion Request)</span>
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--mut)', lineHeight: 1.6, marginBottom: '12px' }}>
              이용자는 언제든지 자신의 개인정보를 열람, 수정하거나 계정 삭제 및 연동 데이터의 완전 파기를 요청할 수 있습니다.
            </p>

            <div style={{
              background: 'var(--panel)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-md)',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              fontSize: '13px'
            }}>
              <div>
                <strong style={{ color: 'var(--txt)', fontSize: '13.5px', display: 'block', marginBottom: '4px' }}>
                  방법 1. 이메일 접수 (가장 신속)
                </strong>
                <p style={{ margin: 0, color: 'var(--mut)', lineHeight: 1.6 }}>
                  개인정보 보호책임자 이메일(<strong>privacy@hit-in.app</strong> / <strong>jes0508@gmail.com</strong>)로 "데이터 삭제 요청" 메일을 발송하시면, 본인 확인 후 <strong>3영업일 이내</strong>에 데이터베이스에서 복구 불가능한 방법으로 영구 파기합니다.
                </p>
              </div>

              <div>
                <strong style={{ color: 'var(--txt)', fontSize: '13.5px', display: 'block', marginBottom: '4px' }}>
                  방법 2. 파트너 센터 앱 내 직접 탈퇴
                </strong>
                <p style={{ margin: 0, color: 'var(--mut)', lineHeight: 1.6 }}>
                  로그인 후 사이드바 하단 프로필 &gt; [내 정보 수정] &gt; [회원 탈퇴 및 데이터 삭제] 버튼을 클릭하시면 즉시 탈퇴 처리됩니다.
                </p>
              </div>

              <div>
                <strong style={{ color: 'var(--txt)', fontSize: '13.5px', display: 'block', marginBottom: '4px' }}>
                  방법 3. Google 계정 설정에서 직접 권한 취소
                </strong>
                <p style={{ margin: 0, color: 'var(--mut)', lineHeight: 1.6 }}>
                  <a 
                    href="https://myaccount.google.com/permissions" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#60A5FA', textDecoration: 'underline' }}
                  >
                    Google 계정 보안 권한 관리(myaccount.google.com/permissions) ↗
                  </a>
                  에서 HIT IN 파트너 센터의 연동 권한을 언제든 즉시 철회할 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 & Contact */}
          <section>
            <h2 style={{
              fontSize: '17px',
              fontWeight: 700,
              color: 'var(--txt)',
              borderBottom: '1px solid var(--line)',
              paddingBottom: '8px',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                background: 'var(--acc)',
                color: '#fff',
                fontSize: '11px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800
              }}>5</span>
              <span>개인정보 보호책임자 및 문의처</span>
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
              <p style={{ margin: 0 }}>• <strong>개인정보 보호책임자:</strong> 정은수 (HIT IN 운영팀)</p>
              <p style={{ margin: 0 }}>• <strong>대표 이메일:</strong> privacy@hit-in.app / jes0508@gmail.com</p>
              <p style={{ margin: 0 }}>• <strong>웹사이트:</strong> <a href="https://partner.hitin.kr" style={{ color: 'var(--acc)' }}>https://partner.hitin.kr</a></p>
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
        © 2025 HIT IN Corp. All rights reserved. | <a href="/terms.html" style={{ color: 'var(--dim)', textDecoration: 'underline' }}>이용약관</a> | <a href="/privacy.html" style={{ color: 'var(--dim)', textDecoration: 'underline' }}>개인정보처리방침</a>
      </footer>
    </div>
  );
};
