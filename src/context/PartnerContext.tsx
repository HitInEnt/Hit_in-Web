import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { PartnerRole, PartnerUser } from '../types';
import { initialPartnerUsers } from '../mock/mockData';

export type NavTab = 
  | 'dashboard' 
  | 'bookings' 
  | 'checkin' 
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
}

interface PartnerContextType {
  role: PartnerRole;
  user: PartnerUser;
  theme: 'dark' | 'light';
  activeTab: NavTab;
  refreshKey: number;
  toasts: ToastNotification[];
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => void;
  logout: () => void;
  setRole: (role: PartnerRole) => void;
  toggleTheme: () => void;
  setActiveTab: (tab: NavTab) => void;
  triggerRefresh: () => void;
  showToast: (message: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const PartnerContext = createContext<PartnerContextType | null>(null);

export const PartnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('hitin_partner_auth') !== 'false';
  });

  const [role, setRoleState] = useState<PartnerRole>(() => {
    return (localStorage.getItem('hitin_partner_role') as PartnerRole) || 'field_owner';
  });

  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('hitin_theme') as 'dark' | 'light') || 'dark';
  });

  const [activeTab, setActiveTabState] = useState<NavTab>('dashboard');
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Apply data-theme to HTML tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hitin_theme', theme);
  }, [theme]);

  // Sync role to localStorage
  useEffect(() => {
    localStorage.setItem('hitin_partner_role', role);
  }, [role]);

  const user = useMemo(() => {
    const defaultUser = initialPartnerUsers.find(u => u.role === role) || initialPartnerUsers[0];
    const storedUser = localStorage.getItem('hitin_custom_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.role === role) return parsed;
      } catch {}
    }
    return defaultUser;
  }, [role, refreshKey]);

  const login = useCallback((payload: LoginPayload) => {
    setIsAuthenticated(true);
    setRoleState(payload.role);
    localStorage.setItem('hitin_partner_auth', 'true');
    localStorage.setItem('hitin_partner_role', payload.role);

    if (payload.businessName) {
      const customUser: PartnerUser = {
        id: `usr_${payload.role}_${Date.now()}`,
        name: payload.name || '파트너 대표',
        email: payload.email,
        role: payload.role,
        businessName: payload.businessName,
        businessNumber: '124-86-90123',
        phone: '010-8921-4432',
        partnerId: payload.partnerId || 'fld_01',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      };
      localStorage.setItem('hitin_custom_user', JSON.stringify(customUser));
    }

    setActiveTabState('dashboard');
    setRefreshKey(prev => prev + 1);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.setItem('hitin_partner_auth', 'false');
    localStorage.removeItem('hitin_custom_user');
  }, []);

  const setRole = useCallback((newRole: PartnerRole) => {
    setRoleState(newRole);
    setActiveTabState('dashboard');
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setActiveTab = useCallback((tab: NavTab) => {
    setActiveTabState(tab);
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
        login,
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
