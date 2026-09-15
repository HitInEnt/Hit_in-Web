import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CalendarClock, 
  QrCode, 
  Building2, 
  PackageCheck, 
  ReceiptText, 
  ShieldAlert, 
  Users2, 
  Sparkles,
  Layers,
  ShoppingBag,
  LogOut,
  LogIn,
  UserCheck,
  UserCog,
  Edit3,
  Coins,
  X
} from 'lucide-react';
import { usePartner, NavTab } from '../../context/PartnerContext';
import { PartnerRole } from '../../types';
import { ProfileEditModal } from '../common/ProfileEditModal';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
  allowedRoles: PartnerRole[];
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: '통합 대시보드',
    icon: LayoutDashboard,
    allowedRoles: ['field_owner', 'shop_owner', 'hq_admin']
  },
  {
    id: 'bookings',
    label: '타임슬롯 & 예약 관리',
    icon: CalendarClock,
    badge: 'LIVE',
    allowedRoles: ['field_owner', 'hq_admin']
  },
  {
    id: 'checkin',
    label: '실시간 현장입장',
    icon: QrCode,
    badge: 'LIVE',
    allowedRoles: ['field_owner']
  },
  {
    id: 'user_points',
    label: '사용자 & 포인트 관리',
    icon: Coins,
    badge: 'NEW',
    allowedRoles: ['field_owner', 'shop_owner', 'hq_admin']
  },
  {
    id: 'shop_inventory',
    label: '렌탈 & 소모품 재고',
    icon: PackageCheck,
    allowedRoles: ['hq_admin']
  },
  {
    id: 'field_manage',
    label: '필드 시설 및 규정',
    icon: Building2,
    allowedRoles: ['field_owner']
  },
  {
    id: 'settlement',
    label: '정산 및 매출 분석',
    icon: ReceiptText,
    allowedRoles: ['field_owner', 'shop_owner', 'hq_admin']
  },
  {
    id: 'hq_clients',
    label: '입점 파트너사 (CRM)',
    icon: Users2,
    badge: 'HQ',
    allowedRoles: ['hq_admin']
  }
];

export const Sidebar: React.FC = () => {
  const { role, user, activeTab, setActiveTab, setRole, logout, showToast, isMobileMenuOpen, setIsMobileMenuOpen } = usePartner();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const filteredNav = NAV_ITEMS.filter(item => item.allowedRoles.includes(role));

  const handleLogout = () => {
    logout();
    showToast('안전하게 로그아웃되었습니다.', 'info');
  };

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="sidebar-backdrop open" 
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar-container ${isMobileMenuOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div style={{
          padding: 'var(--space-xl) var(--space-lg)',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--acc) 0%, var(--accd) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(255, 90, 31, 0.4)'
            }}>
              <Sparkles size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="tactical-font" style={{ fontSize: '18px', color: 'var(--txt)', letterSpacing: '0.08em' }}>
                  HIT IN
                </span>
                <span className="badge badge-lime" style={{ fontSize: '10px', padding: '2px 6px' }}>
                  PARTNER B2B
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--mut)', marginTop: '2px' }}>
                에어소프트 고객사 관리 포털
              </div>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="mobile-sidebar-close-btn"
            aria-label="메뉴 닫기"
          >
            <X size={20} />
          </button>
        </div>

        {/* Role Switcher */}
        <div style={{ padding: 'var(--space-md) var(--space-lg)' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--dim)',
            textTransform: 'uppercase',
            marginBottom: '8px',
            letterSpacing: '0.05em'
          }}>
            현재 관리자 권한 모드
          </div>
          <div style={{
            background: 'var(--panel)',
            borderRadius: 'var(--radius-md)',
            padding: '4px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '4px',
            border: '1px solid var(--line)'
          }}>
            <button
              onClick={() => setRole('field_owner')}
              style={{
                padding: '6px 2px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                background: role === 'field_owner' ? 'var(--acc)' : 'transparent',
                color: role === 'field_owner' ? '#fff' : 'var(--mut)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <Layers size={13} />
              필드사장
            </button>
            <button
              onClick={() => setRole('shop_owner')}
              style={{
                padding: '6px 2px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                background: role === 'shop_owner' ? 'var(--acc)' : 'transparent',
                color: role === 'shop_owner' ? '#fff' : 'var(--mut)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <ShoppingBag size={13} />
              건샵사장
            </button>
            <button
              onClick={() => setRole('hq_admin')}
              style={{
                padding: '6px 2px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                background: role === 'hq_admin' ? 'var(--lime-chip)' : 'transparent',
                color: role === 'hq_admin' ? 'var(--ink-fixed)' : 'var(--mut)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <ShieldAlert size={13} />
              본사CRM
            </button>
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{
          flex: 1,
          padding: 'var(--space-sm) var(--space-md)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--dim)',
            textTransform: 'uppercase',
            padding: '8px 8px 4px',
            letterSpacing: '0.05em'
          }}>
            메뉴 네비게이션
          </div>
          {filteredNav.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: isActive ? 'var(--card2)' : 'transparent',
                  color: isActive ? 'var(--txt)' : 'var(--mut)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                  fontWeight: isActive ? 600 : 500,
                  boxShadow: isActive ? 'inset 3px 0 0 var(--acc)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={18} color={isActive ? 'var(--acc)' : 'var(--mut)'} />
                  <span style={{ fontSize: '13.5px' }}>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`badge ${item.badge === 'LIVE' ? 'badge-orange' : item.badge === 'HQ' ? 'badge-lime' : 'badge-outline'}`}
                    style={{ fontSize: '10px', padding: '2px 6px' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Auth & Account Management Section in Sidebar */}
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--dim)',
            textTransform: 'uppercase',
            padding: '16px 8px 4px',
            letterSpacing: '0.05em',
            borderTop: '1px solid var(--line)',
            marginTop: '8px'
          }}>
            계정 및 인증 관리
          </div>

          {/* Profile Edit Button */}
          <button
            onClick={() => setIsProfileModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--line)',
              background: 'var(--card)',
              color: 'var(--txt)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease',
              fontWeight: 600
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--acc)';
              (e.currentTarget as HTMLElement).style.color = 'var(--acc)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)';
              (e.currentTarget as HTMLElement).style.color = 'var(--txt)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserCog size={18} color="var(--acc)" />
              <span style={{ fontSize: '13.5px' }}>프로필 및 상호명 변경</span>
            </div>
            <Edit3 size={14} color="var(--mut)" />
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid transparent',
              background: 'transparent',
              color: 'var(--danger)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease',
              fontWeight: 600
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255, 77, 79, 0.1)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 77, 79, 0.3)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LogOut size={18} color="var(--danger)" />
              <span style={{ fontSize: '13.5px' }}>로그아웃</span>
            </div>
            <span className="badge badge-outline" style={{ fontSize: '10px', color: 'var(--danger)', borderColor: 'rgba(255,77,79,0.3)' }}>
              종료
            </span>
          </button>
        </nav>

        {/* Partner Info & Quick Edit Footer */}
        <div 
          onClick={() => setIsProfileModalOpen(true)}
          title="클릭하여 프로필 및 사업장 정보 수정"
          style={{
            padding: 'var(--space-md) var(--space-lg)',
            borderTop: '1px solid var(--line)',
            backgroundColor: 'var(--panel)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--card2)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--panel)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
            <div style={{ position: 'relative' }}>
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-pill)',
                  objectFit: 'cover',
                  border: '2px solid var(--acc)',
                  flexShrink: 0
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: 'var(--acc)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Edit3 size={8} />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--txt)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.businessName}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--mut)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--green)', display: 'inline-block' }} />
                <span>{user.name}</span>
                <span style={{ fontSize: '10px', color: 'var(--acc)', marginLeft: '2px' }}>[수정]</span>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLogout();
            }}
            title="로그아웃"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              color: 'var(--mut)',
              cursor: 'pointer',
              padding: '6px 8px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
              flexShrink: 0,
              fontSize: '11px',
              fontWeight: 600
            }}
            onMouseEnter={e => { 
              (e.currentTarget as HTMLElement).style.color = 'var(--danger)'; 
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--danger)'; 
            }}
            onMouseLeave={e => { 
              (e.currentTarget as HTMLElement).style.color = 'var(--mut)'; 
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'; 
            }}
          >
            <LogOut size={13} />
          </button>
        </div>
      </aside>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};

