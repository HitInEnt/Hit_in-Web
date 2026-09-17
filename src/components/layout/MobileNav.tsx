import React from 'react';
import { 
  LayoutDashboard, 
  CalendarClock, 
  QrCode, 
  Coins, 
  Menu
} from 'lucide-react';
import { usePartner, NavTab } from '../../context/PartnerContext';

export const MobileNav: React.FC = () => {
  const { user, activeTab, setActiveTab, toggleMobileMenu, isMobileMenuOpen, showToast } = usePartner();

  const isPending = user.status === 'pending_approval';

  const navButtons: { id: NavTab; label: string; icon: React.ElementType; badge?: string }[] = [
    {
      id: 'dashboard',
      label: '대시보드',
      icon: LayoutDashboard
    },
    {
      id: 'bookings',
      label: '타임슬롯',
      icon: CalendarClock,
      badge: 'LIVE'
    },
    {
      id: 'checkin',
      label: '현장입장',
      icon: QrCode,
      badge: 'QR'
    },
    {
      id: 'user_points',
      label: '포인트',
      icon: Coins
    }
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navButtons.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        const isLocked = isPending && item.id !== 'mypage';

        return (
          <button
            key={item.id}
            onClick={() => {
              if (isLocked) {
                showToast('⏳ 본사(HIT IN HQ) 승인 대기 중입니다. 가맹 승인 완료 후 이용 가능합니다.', 'warning');
              }
              setActiveTab(item.id);
            }}
            className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
            aria-label={item.label}
          >
            <div className="mobile-nav-icon-wrapper">
              <Icon size={20} />
              {isLocked ? (
                <span className="mobile-nav-badge" style={{ background: '#ff9500', fontSize: '7.5px' }}>🔒</span>
              ) : (
                item.badge && (
                  <span className="mobile-nav-badge">{item.badge}</span>
                )
              )}
            </div>
            <span className="mobile-nav-label">{item.label}</span>
          </button>
        );
      })}

      {/* Drawer Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className={`mobile-nav-btn ${isMobileMenuOpen ? 'active' : ''}`}
        aria-label="전체 메뉴"
      >
        <div className="mobile-nav-icon-wrapper">
          <Menu size={20} />
        </div>
        <span className="mobile-nav-label">전체메뉴</span>
      </button>
    </nav>
  );
};