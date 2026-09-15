import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { PartnerRole, PartnerUser } from '../types';
import { initialPartnerUsers } from '../mock/mockData';
import { PartnerService } from '../services/partnerService';


export type NavTab = 
  | 'dashboard' 
  | 'bookings' 
  | 'checkin' 
  | 'user_points' 
  | 'field_manage' 
  | 'shop_inventory' 
  | 'settlement' 
  | 'hq_clients';


interface ToastNotification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  message: string;
}

interface LoginPayload {
  email: string;
  role: PartnerRole;
  businessName?: string;
  name?: string;
  partnerId?: string;
  avatarUrl?: string;
  provider?: 'email' | 'google' | 'kakao' | 'pass';
}

interface PartnerContextType {
  role: PartnerRole;
  user: PartnerUser;
  theme: 'dark' | 'light';
  activeTab: NavTab;
  refreshKey: number;
  toasts: ToastNotification[];
  isAuthenticated: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  login: (payload: LoginPayload) => void;
  updateProfile: (updated: Partial<PartnerUser>) => void;
  logout: () => void;
  setRole: (role: PartnerRole) => void;
  toggleTheme: () => void;
  setActiveTab: (tab: NavTab) => void;
  triggerRefresh: () => void;
  showToast: (message: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const PartnerContext = createContext<PartnerContextType | null>(null);

const getUserForRole = (r: PartnerRole): PartnerUser => {
  const defaultUser = initialPartnerUsers.find(u => u.role === r) || initialPartnerUsers[0];
  const roleSpecific = localStorage.getItem(`hitin_custom_user_${r}`);
  if (roleSpecific) {
    try {
      const parsed = JSON.parse(roleSpecific);
      if (parsed.avatarUrl && parsed.avatarUrl.includes('images.unsplash.com/photo-')) {
        parsed.avatarUrl = defaultUser.avatarUrl;
      }
      return parsed;
    } catch {}
  }
  const generalStored = localStorage.getItem('hitin_custom_user');
  if (generalStored) {
    try {
      const parsed = JSON.parse(generalStored);
      if (parsed.avatarUrl && parsed.avatarUrl.includes('images.unsplash.com/photo-')) {
        parsed.avatarUrl = defaultUser.avatarUrl;
      }
      if (parsed.role === r) return parsed;
    } catch {}
  }
  return defaultUser;
};

export const PartnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('hitin_partner_auth') !== 'false';
  });

  const [role, setRoleState] = useState<PartnerRole>(() => {
    return (localStorage.getItem('hitin_partner_role') as PartnerRole) || 'field_owner';
  });

  const [user, setUser] = useState<PartnerUser>(() => getUserForRole(role));

  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('hitin_theme') as 'dark' | 'light') || 'dark';
  });

  const [activeTab, setActiveTabState] = useState<NavTab>('dashboard');
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const setActiveTab = useCallback((tab: NavTab) => {
    setActiveTabState(tab);
    setIsMobileMenuOpen(false); // Auto close mobile drawer on selection
  }, []);

  // Apply data-theme to HTML tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hitin_theme', theme);
  }, [theme]);

  // Sync role to localStorage
  useEffect(() => {
    localStorage.setItem('hitin_partner_role', role);
  }, [role]);

  const login = useCallback((payload: LoginPayload) => {
    setIsAuthenticated(true);
    setRoleState(payload.role);
    localStorage.setItem('hitin_partner_auth', 'true');
    localStorage.setItem('hitin_partner_role', payload.role);

    const defaultForRole = initialPartnerUsers.find(u => u.role === payload.role) || initialPartnerUsers[0];
    const customUser: PartnerUser = {
      id: `usr_${payload.role}_${Date.now()}`,
      name: payload.name || defaultForRole.name,
      email: payload.email,
      role: payload.role,
      businessName: payload.businessName || defaultForRole.businessName,
      businessNumber: '124-86-90123',
      phone: '010-8921-4432',
      partnerId: payload.partnerId || defaultForRole.partnerId,
      avatarUrl: payload.avatarUrl || defaultForRole.avatarUrl
    };

    localStorage.setItem(`hitin_custom_user_${payload.role}`, JSON.stringify(customUser));
    localStorage.setItem('hitin_custom_user', JSON.stringify(customUser));
    setUser(customUser);

    setActiveTabState('dashboard');
    setRefreshKey(prev => prev + 1);
  }, []);

  const updateProfile = useCallback((updated: Partial<PartnerUser>) => {
    setUser(prev => {
      const nextUser: PartnerUser = {
        ...prev,
        ...updated
      };
      localStorage.setItem(`hitin_custom_user_${nextUser.role}`, JSON.stringify(nextUser));
      localStorage.setItem('hitin_custom_user', JSON.stringify(nextUser));

      // Update field info if business name changed
      if (updated.businessName && nextUser.partnerId) {
        PartnerService.updateField(nextUser.partnerId, { name: updated.businessName });
      }

      return nextUser;
    });

    setRefreshKey(prev => prev + 1);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.setItem('hitin_partner_auth', 'false');
    localStorage.removeItem('hitin_custom_user');
  }, []);

  const setRole = useCallback((newRole: PartnerRole) => {
    setRoleState(newRole);
    setUser(getUserForRole(newRole));
    localStorage.setItem('hitin_partner_role', newRole);
    setActiveTabState('dashboard');
    setRefreshKey(prev => prev + 1);
  }, []);


  const toggleTheme = useCallback(() => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'warning' | 'info' | 'error' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <PartnerContext.Provider
      value={{
        role,
        user,
        theme,
        activeTab,
        refreshKey,
        toasts,
        isAuthenticated,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        toggleMobileMenu,
        login,
        updateProfile,
        logout,
        setRole,
        toggleTheme,
        setActiveTab,
        triggerRefresh,
        showToast,
        removeToast
      }}
    >
      {children}
    </PartnerContext.Provider>
  );
};

export const usePartner = () => {
  const ctx = useContext(PartnerContext);
  if (!ctx) {
    throw new Error('usePartner must be used within PartnerProvider');
  }
  return ctx;
};
