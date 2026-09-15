import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  RotateCcw,
  Activity,
  CheckCircle2,
  LogOut
} from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';
import { PartnerService } from '../../services/partnerService';

interface HeaderProps {
  onOpenQuickCheckIn?: () => void;
  onOpenAddSlot?: () => void;
  onOpenAddProduct?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenQuickCheckIn,
  onOpenAddSlot,
  onOpenAddProduct 
}) => {
  const { role, user, theme, activeTab, toggleTheme, setActiveTab, showToast, triggerRefresh, logout } = usePartner();
  const [timeStr, setTimeStr] = useState<string>('');
  const [isApiOnline, setIsApiOnline] = useState<boolean>(true);

  // Time & Server Health Check
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        month: 'short', 
        day: 'numeric', 
        weekday: 'short', 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      };
      setTimeStr(now.toLocaleDateString('ko-KR', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Check API Health
    const checkHealth = async () => {
      const online = await PartnerService.checkApiHealth();
      setIsApiOnline(online);
    };
    checkHealth();
    const healthInterval = setInterval(checkHealth, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(healthInterval);
    };
  }, []);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: '실시간 파트너 대시보드', desc: `${user.businessName} 운영 현황 및 오늘 지표` };
      case 'bookings':
        return { title: '타임슬롯 & 예약 관리', desc: '게임 슬롯 오픈/마감, 예약자 명단 및 승인 관리' };
      case 'checkin':
        return { title: '실시간 현장입장 관리', desc: '사용자 QR 등록 시 실시간 자동 카운팅 및 게이트 입장 현황' };
      case 'shop_inventory':
        return { title: '건샵 렌탈 장비 & 재고 관리', desc: '필드 연계 렌탈 총기, 보호구 및 비비탄/가스 소모품 수량' };
      case 'field_manage':
        return { title: '필드 시설 및 경기 규정', desc: '경기장 안내, 탄속 제한(FPS), 편의시설 및 사진 관리' };
      case 'settlement':
        return { title: '정산 및 매출 분석', desc: '주별/월별 입금 정산서 대사 및 HIT IN 플랫폼 수수료 공제 내역' };
      case 'hq_clients':
        return { title: '본사 고객사(파트너) 관리 (CRM)', desc: '입점 필드·건샵 계약 관리, 심사 승인 및 수수료율 설정' };
      default:
        return { title: 'HIT IN 파트너 관리자', desc: '고객사 전용 통합 운영 플랫폼' };
    }
  };

  const { title, desc } = getPageTitle();

  const handleResetData = () => {
    if (window.confirm('모든 데이터를 초기 DB Seed 상태로 복원하시겠습니까?')) {
      PartnerService.resetAllData();
      triggerRefresh();
      showToast('모든 데이터베이스와 캐시가 초기 상태로 복원되었습니다.', 'info');
    }
  };

  return (
    <header style={{
      height: '72px',
      backgroundColor: 'var(--bar)',
      borderBottom: '1px solid var(--line)',
      padding: '0 var(--space-xxl)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
      zIndex: 10
    }}>
      {/* Title & Description */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--txt)', letterSpacing: '-0.02em' }}>
            {title}
          </h1>
          {role === 'field_owner' && (
            <span className="badge badge-outline" style={{ fontSize: '11px' }}>
              🏟️ 필드 관리
            </span>
          )}
          {role === 'shop_owner' && (
            <span className="badge badge-outline" style={{ fontSize: '11px' }}>
              🔫 건샵 관리
            </span>
          )}
          {role === 'hq_admin' && (
            <span className="badge badge-lime" style={{ fontSize: '11px' }}>
              👑 HQ 슈퍼관리자
            </span>
          )}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--mut)', marginTop: '2px' }}>
          {desc}
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Backend Server Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: 'var(--radius-pill)',
          background: isApiOnline ? 'rgba(47, 203, 126, 0.12)' : 'rgba(255, 197, 61, 0.12)',
          border: `1px solid ${isApiOnline ? 'rgba(47, 203, 126, 0.3)' : 'rgba(255, 197, 61, 0.3)'}`,
          fontSize: '11px',
          fontWeight: 700,
          color: isApiOnline ? 'var(--green)' : 'var(--warn)'
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: isApiOnline ? 'var(--green)' : 'var(--warn)'
          }} className={isApiOnline ? 'pulse-active' : ''} />
          {isApiOnline ? 'API 서버 연결됨 (Port 8000)' : '오프라인 캐시 모드'}
        </div>

        {/* Live Clock */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--card2)',
          border: '1px solid var(--line)',
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--txt)'
        }}>
          <span className="mono-font">{timeStr}</span>
        </div>
        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--card2)',
            border: '1px solid var(--line)',
            color: 'var(--txt)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          {theme === 'dark' ? <Sun size={17} color="var(--warn)" /> : <Moon size={17} color="var(--acc)" />}
        </button>

        {/* Reset Data Button */}
        <button
          onClick={handleResetData}
          title="데이터 초기화"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--card2)',
            border: '1px solid var(--line)',
            color: 'var(--mut)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <RotateCcw size={15} />
        </button>

        {/* Logout Button */}
        <button
          onClick={logout}
          title="로그아웃"
          className="btn btn-secondary btn-sm"
          style={{ gap: '6px', fontSize: '12px' }}
        >
          <LogOut size={14} />
          로그아웃
        </button>
      </div>
    </header>
  );
};

