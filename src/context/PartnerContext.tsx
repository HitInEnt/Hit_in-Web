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
  | 'hq_clients'
  | 'mypage';


interface ToastNotification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  message: string;
}

interface LoginPayload {
  email: string;
  role: PartnerRole;
  roles?: PartnerRole[];
  businessName?: string;
  businessNumber?: string;
  phone?: string;
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
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
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

const getUserForRole = (r: PartnerRole, specificEmail?: string): PartnerUser => {
  const defaultUser = initialPartnerUsers.find(u => u.role === r) || initialPartnerUsers[0];

  // 1. Check if email-specific saved profile exists
  if (specificEmail) {
    const emailStored = localStorage.getItem(`hitin_custom_user_email_${specificEmail}`);
    if (emailStored) {
      try {
        const parsed = JSON.parse(emailStored);
        if (parsed.role === r) return parsed;
      } catch {}
    }
  }

  // 2. Check general active custom user
  const generalStored = localStorage.getItem('hitin_custom_user');
  if (generalStored) {
    try {
      const parsed = JSON.parse(generalStored);
      if (parsed.role === r) return parsed;
    } catch {}
  }

  // 3. Check role-specific custom user
  const roleSpecific = localStorage.getItem(`hitin_custom_user_${r}`);
  if (roleSpecific) {
    try {
      const parsed = JSON.parse(roleSpecific);
      return parsed;
    } catch {}
  }

  return defaultUser;
};

export const PartnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('hitin_partner_auth') === 'true';
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
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

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

    // 1. Look up any previously edited profile for this email or role
    let existingProfile: PartnerUser | null = null;
    if (payload.email) {
      const byEmail = localStorage.getItem(`hitin_custom_user_email_${payload.email}`);
      if (byEmail) {
        try { existingProfile = JSON.parse(byEmail); } catch {}
      }
    }
    if (!existingProfile) {
      const byRole = localStorage.getItem(`hitin_custom_user_${payload.role}`);
      if (byRole) {
        try { existingProfile = JSON.parse(byRole); } catch {}
      }
    }

    const defaultForRole = initialPartnerUsers.find(u => u.role === payload.role) || initialPartnerUsers[0];
    const userEmail = payload.email || existingProfile?.email || defaultForRole.email;
    const approvalStatus = existingProfile?.status || PartnerService.checkUserApproval(userEmail, payload.role);

    const effectiveRoles = payload.roles && payload.roles.length > 0 
      ? payload.roles 
      : (existingProfile?.roles && existingProfile.roles.length > 0 ? existingProfile.roles : [payload.role]);

    const customUser: PartnerUser = {
      id: existingProfile?.id || `usr_${payload.role}_${Date.now()}`,
      name: payload.name || existingProfile?.name || defaultForRole.name,
      email: userEmail,
      role: payload.role,
      roles: effectiveRoles,
      businessName: payload.businessName !== undefined ? payload.businessName : (existingProfile?.businessName || defaultForRole.businessName),
      businessNumber: payload.businessNumber !== undefined ? payload.businessNumber : (existingProfile?.businessNumber || defaultForRole.businessNumber),
      phone: payload.phone !== undefined ? payload.phone : (existingProfile?.phone || defaultForRole.phone),
      partnerId: payload.partnerId || existingProfile?.partnerId || defaultForRole.partnerId,
      avatarUrl: payload.avatarUrl || existingProfile?.avatarUrl || defaultForRole.avatarUrl,
      status: approvalStatus
    };

    localStorage.setItem(`hitin_custom_user_${payload.role}`, JSON.stringify(customUser));
    if (customUser.email) {
      localStorage.setItem(`hitin_custom_user_email_${customUser.email}`, JSON.stringify(customUser));
    }
    localStorage.setItem('hitin_custom_user', JSON.stringify(customUser));
    setUser(customUser);
    PartnerService.syncUserToClient(customUser);

    setActiveTabState('dashboard');
    setRefreshKey(prev => prev + 1);
  }, []);

  const updateProfile = useCallback((updated: Partial<PartnerUser>) => {
    setUser(prev => {
      const isHqUser = prev.role === 'hq_admin' || (prev.roles && prev.roles.includes('hq_admin'));
      const sanitizedRoles = isHqUser
        ? (updated.roles || prev.roles || [updated.role || prev.role])
        : (updated.roles || prev.roles || [updated.role || prev.role]).filter(r => r !== 'hq_admin');

      const nextUser: PartnerUser = {
        ...prev,
        ...updated,
        roles: sanitizedRoles.length > 0 ? sanitizedRoles : [updated.role || prev.role],
        status: updated.status || prev.status || 'pending_approval'
      };
      // Persist across all relevant keys so edits remain permanent
      localStorage.setItem(`hitin_custom_user_${nextUser.role}`, JSON.stringify(nextUser));
      if (nextUser.email) {
        localStorage.setItem(`hitin_custom_user_email_${nextUser.email}`, JSON.stringify(nextUser));
      }
      localStorage.setItem(`hitin_custom_user_id_${nextUser.id}`, JSON.stringify(nextUser));
      localStorage.setItem('hitin_custom_user', JSON.stringify(nextUser));

      // Update field info if business name changed
      if (updated.businessName && nextUser.partnerId) {
        PartnerService.updateField(nextUser.partnerId, { name: updated.businessName });
      }

      PartnerService.syncUserToClient(nextUser);

      return nextUser;
    });

    setRefreshKey(prev => prev + 1);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.setItem('hitin_partner_auth', 'false');
    // Keep custom profile data intact in hitin_custom_user_* so user edits are preserved!
  }, []);

  const setRole = useCallback((newRole: PartnerRole) => {
    // Prevent non-HQ accounts from switching to hq_admin
    const currentUser = user;
    const isHq = currentUser.role === 'hq_admin' || (currentUser.roles && currentUser.roles.includes('hq_admin'));
    if (newRole === 'hq_admin' && !isHq) {
      return;
    }

    setRoleState(newRole);
    setUser(prev => {
      const next = getUserForRole(newRole, prev.email);
      return {
        ...next,
        status: prev.status || next.status || 'active'
      };
    });
    localStorage.setItem('hitin_partner_role', newRole);
    setActiveTabState('dashboard');
    setRefreshKey(prev => prev + 1);
  }, [user]);

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
        isProfileModalOpen,
        setIsProfileModalOpen,
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
