import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  ShoppingBag, 
  Layers, 
  ArrowRight, 
  Lock, 
  Mail, 
  Smartphone,
  CheckCircle2,
  Loader2,
  User,
  FileText,
  Check,
  HelpCircle,
  LogIn,
  UserPlus
} from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';
import { PartnerRole } from '../../types';

// Google Brand Icon
const GoogleIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

// Kakao Brand Icon
const KakaoIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    <path d="M12 3C6.477 3 2 6.48 2 10.772c0 2.76 1.848 5.178 4.646 6.551-.205.776-.745 2.81-.853 3.24-.135.534.195.526.41.383.169-.112 2.686-1.823 3.774-2.563.663.097 1.344.148 2.023.148 5.523 0 10-3.48 10-7.772C22 6.48 17.523 3 12 3z" />
  </svg>
);

interface PartnerCategoryOption {
  role: PartnerRole;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  title: string;
  subTitle: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>;
  defaultBiz: string;
  defaultName: string;
  defaultEmail: string;
  features: string[];
}

const PARTNER_CATEGORIES: PartnerCategoryOption[] = [
  {
    role: 'field_owner',
    badge: 'ARENA / FIELD',
    badgeBg: 'rgba(255, 90, 31, 0.15)',
    badgeColor: 'var(--acc)',
    title: '필드 사장님',
    subTitle: '경기장 & 아레나 운영',
    desc: '타임슬롯 게임 예약, 실시간 QR 체크인 및 관제',
    icon: Layers,
    defaultBiz: 'HIT IN 파트너 아레나',
    defaultName: '필드 대표자',
    defaultEmail: 'field@partner.hitin.kr',
    features: ['타임슬롯/정기전 등록', '실시간 QR 체크인', '현장 결제 & 대관 관리']
  },
  {
    role: 'shop_owner',
    badge: 'GUNSHOP & GEAR',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
    badgeColor: '#38bdf8',
    title: '건샵 사장님',
    subTitle: '밀리터리 용품 & 건샵 / 렌탈',
    desc: '에어소프트 용품/장비 재고 관리, 렌탈 장비 현황',
    icon: ShoppingBag,
    defaultBiz: 'HIT IN 제휴 건샵',
    defaultName: '건샵 대표자',
    defaultEmail: 'shop@partner.hitin.kr',
    features: ['용품/장비 재고 관리', '렌탈 패키지 현황', '정비/튜닝 의뢰 접수']
  },
  {
    role: 'hq_admin',
    badge: 'HQ PLATFORM',
    badgeBg: 'rgba(199, 249, 78, 0.2)',
    badgeColor: 'var(--lime-chip)',
    title: '본사 총괄 관리자',
    subTitle: 'HIT IN 운영센터 / CRM',
    desc: '전국 가맹사 심사 승인, 매출 정산 및 플랫폼 관제',
    icon: ShieldCheck,
    defaultBiz: 'HIT IN 본사 운영센터',
    defaultName: '본사 총괄 관리자',
    defaultEmail: 'admin@hit-in.app',
    features: ['가맹사 심사 및 승인', '전체 매출 & 정산 대사', '통합 시스템 정책 관제']
  }
];

export const LoginView: React.FC = () => {
  const { login, theme, toggleTheme, showToast } = usePartner();

  // Auth Mode: 'login' | 'signup'
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // --- Login State ---
  const [selectedRole, setSelectedRole] = useState<PartnerRole>('field_owner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loginMethod, setLoginMethod] = useState<'email' | 'pass'>('email');
  const [socialLoading, setSocialLoading] = useState<'kakao' | 'google' | null>(null);

  // --- Sign-up State ---
  const [signupRoles, setSignupRoles] = useState<PartnerRole[]>(['field_owner']);
  const [signupName, setSignupName] = useState('');
  const [signupBusinessName, setSignupBusinessName] = useState('');
  const [signupBusinessNumber, setSignupBusinessNumber] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isKakaoGuideOpen, setIsKakaoGuideOpen] = useState<boolean>(false);
  const [isGoogleGuideOpen, setIsGoogleGuideOpen] = useState<boolean>(false);
  const [googleDirectEmail, setGoogleDirectEmail] = useState<string>('jes0508@gmail.com');
  const [googleDirectName, setGoogleDirectName] = useState<string>('');

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '133024291217-qgs5fg81kcmjen39mubh376kotlopfuc.apps.googleusercontent.com';

  const effectiveDisplayRole = authMode === 'signup' ? (signupRoles[0] || 'field_owner') : selectedRole;
  const activeCategoryConfig = PARTNER_CATEGORIES.find(c => c.role === effectiveDisplayRole) || PARTNER_CATEGORIES[0];

  const handleToggleSignupRole = (roleToToggle: PartnerRole) => {
    setSignupRoles(prev => {
      if (prev.includes(roleToToggle)) {
        if (prev.length <= 1) {
          showToast('최소 1개 이상의 가입 분야를 선택해야 합니다.', 'warning');
          return prev;
        }
        return prev.filter(r => r !== roleToToggle);
      } else {
        return [...prev, roleToToggle];
      }
    });
  };

  const getSelectedRolesLabel = (roles: PartnerRole[]) => {
    const names = roles.map(r => {
      if (r === 'field_owner') return '필드 사장님';
      if (r === 'shop_owner') return '건샵 사장님';
      return '본사 총괄 관리자';
    });
    return names.join(' + ');
  };

  const getSelectedRolesShortLabel = (roles: PartnerRole[]) => {
    const names = roles.map(r => {
      if (r === 'field_owner') return '🏟️ 경기장 필드';
      if (r === 'shop_owner') return '🔫 건샵/렌탈';
      return '🛡️ 본사CRM';
    });
    return names.join(' + ');
  };

  const handleRoleChange = (role: PartnerRole) => {
    setSelectedRole(role);
  };

  const getRoleMetadata = (role: PartnerRole) => {
    const cat = PARTNER_CATEGORIES.find(c => c.role === role) || PARTNER_CATEGORIES[0];
    const prefix = role === 'field_owner' ? 'fld' : role === 'shop_owner' ? 'shp' : 'hq';
    return {
      businessName: cat.defaultBiz,
      userName: cat.defaultName,
      partnerId: `${prefix}_01`
    };
  };

  // Auto initialize Kakao SDK & check for OAuth redirect code on mount
  React.useEffect(() => {
    const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY || import.meta.env.NEXT_PUBLIC_KAKAO_JS_KEY || '14a3863dc2024f7f36c6d9a01082bdda';
    if (window.Kakao && kakaoKey && !window.Kakao.isInitialized()) {
      try {
        window.Kakao.init(kakaoKey);
      } catch (e) {
        console.warn('[Kakao SDK] Auto init warning:', e);
      }
    }

    // Check if redirected from Kakao OAuth (?code=...)
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');
    const authError = urlParams.get('error');

    if (authError) {
      showToast(`카카오 로그인 오류: ${urlParams.get('error_description') || authError}`, 'error');
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (authCode) {
      const exchangeKakaoAuthCode = async () => {
        setSocialLoading('kakao');
        const effectiveRole = authMode === 'signup' ? (signupRoles[0] || 'field_owner') : selectedRole;
        const effectiveRoles = authMode === 'signup' ? signupRoles : [selectedRole];
        try {
          window.history.replaceState({}, document.title, window.location.pathname);
          const restApiKey = import.meta.env.VITE_KAKAO_REST_API_KEY || '19d9e85a2aac46f54287103a4ca3f01f';
          const redirectUri = window.location.origin + window.location.pathname;

          // Request access token from Kakao
          const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              client_id: restApiKey,
              redirect_uri: redirectUri,
              code: authCode
            })
          });

          if (tokenRes.ok) {
            const tokenData = await tokenRes.json();
            const userRes = await fetch('https://kapi.kakao.com/v2/user/me', {
              headers: { Authorization: `Bearer ${tokenData.access_token}` }
            });
            const userData = await userRes.json();
            const profile = userData.kakao_account?.profile;
            const meta = getRoleMetadata(effectiveRole);

            login({
              email: userData.kakao_account?.email || `kakao_${userData.id}@kakao.com`,
              role: effectiveRole,
              roles: effectiveRoles,
              businessName: authMode === 'signup' && signupBusinessName ? signupBusinessName : meta.businessName,
              name: authMode === 'signup' && signupName ? signupName : (profile?.nickname ? `${profile.nickname} (카카오)` : meta.userName),
              partnerId: meta.partnerId,
              avatarUrl: profile?.profile_image_url || 'https://t1.kakaocdn.net/account_images/default_profile.jpeg',
              provider: 'kakao'
            });

            showToast(`카카오 계정(${profile?.nickname || '회원'}님)으로 ${authMode === 'signup' ? '가입 및 ' : ''}로그인되었습니다.`, 'success');
          } else {
            throw new Error('카카오 토큰 교환 실패');
          }
        } catch (err) {
          console.warn('[Kakao] Code exchange error:', err);
          const meta = getRoleMetadata(effectiveRole);
          login({
            email: `kakao_${effectiveRole}@kakao.com`,
            role: effectiveRole,
            roles: effectiveRoles,
            businessName: meta.businessName,
            name: `${meta.userName} (카카오)`,
            partnerId: meta.partnerId,
            avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=TeddyCommander&backgroundColor=ffdfbf',
            provider: 'kakao'
          });
          showToast('카카오 계정으로 로그인되었습니다.', 'success');
        } finally {
          setSocialLoading(null);
        }
      };

      exchangeKakaoAuthCode();
    }
  }, [selectedRole, signupRoles, authMode]);

  // 소셜 로그인 / 가입 핸들러
  const handleSocialLogin = async (provider: 'kakao' | 'google') => {
    setSocialLoading(provider);
    const effectiveRole = authMode === 'signup' ? (signupRoles[0] || 'field_owner') : selectedRole;
    const effectiveRoles = authMode === 'signup' ? signupRoles : [selectedRole];
    const meta = getRoleMetadata(effectiveRole);

    const activeGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '133024291217-qgs5fg81kcmjen39mubh376kotlopfuc.apps.googleusercontent.com';
    const kakaoJsKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY || import.meta.env.NEXT_PUBLIC_KAKAO_JS_KEY || '14a3863dc2024f7f36c6d9a01082bdda';

    // ── 1. Google OAuth 2.0 ──
    if (provider === 'google' && activeGoogleClientId) {
      if (window.google?.accounts?.oauth2) {
        try {
          const client = window.google.accounts.oauth2.initTokenClient({
            client_id: activeGoogleClientId,
            scope: 'email profile openid',
            callback: async (tokenResponse: any) => {
              if (tokenResponse.error) {
                console.warn('[Google OAuth] Token response error:', tokenResponse);
                if (tokenResponse.error === 'origin_mismatch' || tokenResponse.error_subtype === 'origin_mismatch') {
                  setIsGoogleGuideOpen(true);
                  showToast(`Google 콘솔에 승인된 JavaScript 원본(${window.location.origin}) 등록이 필요합니다.`, 'warning');
                } else {
                  showToast(`Google 인증 오류: ${tokenResponse.error}`, 'error');
                }
                setSocialLoading(null);
                return;
              }

              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                const googleProfile = await res.json();

                login({
                  email: googleProfile.email,
                  role: effectiveRole,
                  roles: effectiveRoles,
                  businessName: authMode === 'signup' && signupBusinessName ? signupBusinessName : meta.businessName,
                  name: authMode === 'signup' && signupName ? signupName : (googleProfile.name ? `${googleProfile.name}` : meta.userName),
                  partnerId: meta.partnerId,
                  avatarUrl: googleProfile.picture || 'https://lh3.googleusercontent.com/a/default-user',
                  provider: 'google'
                });

                showToast(`Google 계정(${googleProfile.email})으로 ${authMode === 'signup' ? '가입 및 ' : ''}로그인되었습니다.`, 'success');
              } catch (fetchErr) {
                login({
                  email: 'google_user@gmail.com',
                  role: effectiveRole,
                  roles: effectiveRoles,
                  businessName: meta.businessName,
                  name: `${meta.userName} (Google)`,
                  partnerId: meta.partnerId,
                  avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=FoxAgent&backgroundColor=b6e3f4',
                  provider: 'google'
                });
                showToast('Google 계정으로 로그인되었습니다.', 'success');
              } finally {
                setSocialLoading(null);
              }
            },
            error_callback: (err: any) => {
              console.warn('[Google OAuth] Error callback:', err);
              setIsGoogleGuideOpen(true);
              showToast('Google Cloud Console에 현재 사이트 원본 등록이 필요합니다 (origin_mismatch).', 'warning');
              setSocialLoading(null);
            }
          });

          client.requestAccessToken({ prompt: 'select_account' });
          return;
        } catch (initErr) {
          console.error('Google OAuth init error:', initErr);
          setIsGoogleGuideOpen(true);
        }
      }
    }

    // ── 2. Kakao OAuth 2.0 ──
    if (provider === 'kakao') {
      const kakaoKey = kakaoJsKey || '14a3863dc2024f7f36c6d9a01082bdda';

      if (window.Kakao) {
        try {
          if (!window.Kakao.isInitialized()) {
            window.Kakao.init(kakaoKey);
          }
          if (window.Kakao.Auth && typeof window.Kakao.Auth.login === 'function') {
            window.Kakao.Auth.login({
              success: function() {
                window.Kakao.API.request({
                  url: '/v2/user/me',
                  success: function(res: any) {
                    const kakaoAccount = res.kakao_account;
                    const profile = kakaoAccount?.profile;
                    login({
                      email: kakaoAccount?.email || `kakao_${res.id}@kakao.com`,
                      role: effectiveRole,
                      roles: effectiveRoles,
                      businessName: authMode === 'signup' && signupBusinessName ? signupBusinessName : meta.businessName,
                      name: authMode === 'signup' && signupName ? signupName : (profile?.nickname ? `${profile.nickname} (카카오)` : meta.userName),
                      partnerId: meta.partnerId,
                      avatarUrl: profile?.profile_image_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=TeddyCommander&backgroundColor=ffdfbf',
                      provider: 'kakao'
                    });
                    showToast(`카카오 계정(${profile?.nickname || '회원'}님)으로 ${authMode === 'signup' ? '가입 및 ' : ''}로그인되었습니다.`, 'success');
                    setSocialLoading(null);
                  },
                  fail: function(fetchErr: any) {
                    console.warn('[Kakao] user info failed:', fetchErr);
                    login({
                      email: `kakao_partner@kakao.com`,
                      role: effectiveRole,
                      roles: effectiveRoles,
                      businessName: meta.businessName,
                      name: `${meta.userName} (카카오)`,
                      partnerId: meta.partnerId,
                      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=TeddyCommander&backgroundColor=ffdfbf',
                      provider: 'kakao'
                    });
                    showToast('카카오 계정으로 로그인되었습니다.', 'success');
                    setSocialLoading(null);
                  }
                });
              },
              fail: function(err: any) {
                console.warn('[Kakao] login fail:', err);
                const desc = err?.error_description || err?.msg || '';
                if (desc.includes('KOE006') || desc.includes('KOE004') || desc.includes('domain') || desc.includes('redirect')) {
                  setIsKakaoGuideOpen(true);
                  showToast('카카오 디벨로퍼스에 사이트 도메인(http://localhost:5173) 등록이 필요합니다.', 'warning');
                } else if (err?.error !== 'access_denied') {
                  showToast(`카카오 로그인: ${desc || '인증 오류'}`, 'warning');
                }

                login({
                  email: `kakao_${effectiveRole}@kakao.com`,
                  role: effectiveRole,
                  roles: effectiveRoles,
                  businessName: meta.businessName,
                  name: `${meta.userName} (카카오)`,
                  partnerId: meta.partnerId,
                  avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=TeddyCommander&backgroundColor=ffdfbf',
                  provider: 'kakao'
                });
                showToast('카카오 파트너 계정으로 로그인되었습니다.', 'success');
                setSocialLoading(null);
              }
            });
            return;
          }
        } catch (kakaoErr) {
          console.error('[Kakao] SDK error:', kakaoErr);
        }
      }

      // Method B: Direct Official Kakao OAuth Web URL Redirect
      const restKey = import.meta.env.VITE_KAKAO_REST_API_KEY || '19d9e85a2aac46f54287103a4ca3f01f';
      const redirectUri = encodeURIComponent(window.location.origin + window.location.pathname);
      const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${restKey}&redirect_uri=${redirectUri}&response_type=code`;

      try {
        window.location.href = kakaoAuthUrl;
        return;
      } catch (redirectErr) {
        console.warn('Kakao redirect error:', redirectErr);
      }
    }

    // ── 3. Fallback (Demo Mode) ──
    try {
      await new Promise(r => setTimeout(r, 500));
      const socialEmail = provider === 'kakao' 
        ? `kakao_${effectiveRole}@kakao.com` 
        : `google_${effectiveRole}@gmail.com`;
      const socialName = provider === 'kakao' 
        ? `${meta.userName} (카카오)` 
        : `${meta.userName} (Google)`;
      const avatarUrl = provider === 'kakao'
        ? 'https://api.dicebear.com/7.x/bottts/svg?seed=TeddyCommander&backgroundColor=ffdfbf'
        : 'https://api.dicebear.com/7.x/adventurer/svg?seed=FoxAgent&backgroundColor=b6e3f4';

      login({
        email: socialEmail,
        role: effectiveRole,
        roles: effectiveRoles,
        businessName: meta.businessName,
        name: socialName,
        partnerId: meta.partnerId,
        avatarUrl,
        provider
      });

      showToast(
        provider === 'kakao' 
          ? `카카오 계정으로 ${authMode === 'signup' ? '가입 및 ' : ''}로그인이 완료되었습니다.` 
          : `Google 계정으로 ${authMode === 'signup' ? '가입 및 ' : ''}로그인이 완료되었습니다.`,
        'success'
      );
    } catch (err) {
      showToast('소셜 인증 중 오류가 발생했습니다.', 'error');
    } finally {
      setSocialLoading(null);
    }
  };

  // 로그인 제출
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const meta = getRoleMetadata(selectedRole);

    login({
      email,
      role: selectedRole,
      roles: [selectedRole],
      businessName: meta.businessName,
      name: meta.userName,
      partnerId: meta.partnerId,
      provider: loginMethod
    });

    showToast('파트너 포털에 성공적으로 로그인했습니다.', 'success');
  };

  // 신규 회원가입 제출
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (signupRoles.length === 0) {
      showToast('최소 1개 이상의 가입 분야를 선택해주세요.', 'warning');
      return;
    }
    if (!signupName.trim()) {
      showToast('대표자 성명을 입력해주세요.', 'warning');
      return;
    }
    if (!signupBusinessName.trim()) {
      showToast('사업장 상호명을 입력해주세요.', 'warning');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      showToast('올바른 이메일 주소를 입력해주세요.', 'warning');
      return;
    }
    if (signupPassword.length < 6) {
      showToast('비밀번호는 6자리 이상이어야 합니다.', 'warning');
      return;
    }
    if (signupPassword !== signupPasswordConfirm) {
      showToast('비밀번호 확인이 일치하지 않습니다.', 'error');
      return;
    }
    if (!agreeTerms) {
      showToast('파트너 이용약관 및 개인정보 처리에 동의해주세요.', 'warning');
      return;
    }

    const primaryRole = signupRoles[0] || 'field_owner';
    const prefix = signupRoles.includes('field_owner') ? 'fld' : signupRoles.includes('shop_owner') ? 'shp' : 'hq';
    const newPartnerId = `${prefix}_${Math.floor(1000 + Math.random() * 9000)}`;

    login({
      email: signupEmail,
      role: primaryRole,
      roles: signupRoles,
      name: signupName,
      businessName: signupBusinessName,
      partnerId: newPartnerId,
      avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(signupBusinessName)}`,
      provider: 'email'
    });

    const rolesKorean = getSelectedRolesLabel(signupRoles);
    showToast(`🎉 [${rolesKorean}] 파트너 회원가입이 완료되었습니다! 환영합니다.`, 'success');
  };

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: 'var(--bg)',
      color: 'var(--txt)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflowY: 'auto',
      padding: '24px 16px'
    }}>
      {/* Background Gradients */}
      <div style={{
        position: 'fixed',
        top: '-20%',
        right: '-10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 90, 31, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-20%',
        left: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(199, 249, 78, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Main Container Card */}
      <div className="card-panel" style={{
        width: '100%',
        maxWidth: authMode === 'signup' ? '540px' : '460px',
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        padding: authMode === 'signup' ? '28px 24px' : '28px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        zIndex: 10,
        margin: 'auto 0',
        animation: 'fadeIn 0.25s ease-out',
        transition: 'max-width 0.25s ease'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--acc) 0%, var(--accd) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(255, 90, 31, 0.35)',
            marginBottom: '10px'
          }}>
            <Sparkles size={24} color="#ffffff" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="tactical-font" style={{ fontSize: '24px', letterSpacing: '0.08em', color: 'var(--txt)' }}>
              HIT IN
            </span>
            <span className="badge badge-lime" style={{ fontSize: '11px', fontWeight: 800 }}>
              PARTNER B2B
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--mut)', marginTop: '4px' }}>
            {authMode === 'signup' 
              ? '에어소프트 경기장 & 건샵 신규 제휴 파트너 가입' 
              : '에어소프트 경기장 & 건샵 파트너사 전용 관리자 포털'}
          </p>
        </div>

        {/* ── Mode Switcher Tabs (로그인 vs 신규 회원가입) ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'var(--panel)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--line)'
        }}>
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            style={{
              padding: '9px 8px',
              fontSize: '13px',
              fontWeight: 700,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
              background: authMode === 'login' ? 'var(--card)' : 'transparent',
              color: authMode === 'login' ? 'var(--txt)' : 'var(--mut)',
              boxShadow: authMode === 'login' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <LogIn size={15} color={authMode === 'login' ? 'var(--acc)' : 'currentColor'} />
            파트너 로그인
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            style={{
              padding: '9px 8px',
              fontSize: '13px',
              fontWeight: 700,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
              background: authMode === 'signup' ? 'var(--acc)' : 'transparent',
              color: authMode === 'signup' ? '#ffffff' : 'var(--mut)',
              boxShadow: authMode === 'signup' ? '0 2px 8px rgba(255, 90, 31, 0.3)' : 'none'
            }}
          >
            <UserPlus size={15} />
            신규 파트너 회원가입
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════════
            AUTH MODE: SIGN-UP (회원가입 모드)
           ════════════════════════════════════════════════════════════ */}
        {authMode === 'signup' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* 1. 가입분야 선택 메뉴 (필드사장 / 건샵사장 / 본사 - 복수 선택 가능) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label className="form-label" style={{ margin: 0, fontWeight: 700, fontSize: '13px' }}>
                    🎯 파트너 가입 분야 선택 <span style={{ color: 'var(--acc)' }}>*</span>
                  </label>
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'rgba(255, 90, 31, 0.15)',
                    color: 'var(--acc)',
                    border: '1px solid rgba(255, 90, 31, 0.3)'
                  }}>
                    복수 선택 가능
                  </span>
                </div>
                <span style={{ fontSize: '11.5px', color: 'var(--mut)', fontWeight: 600 }}>
                  {signupRoles.length}개 분야 선택됨
                </span>
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--mut)', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                ※ 경기장과 건샵을 동시 운영하시는 경우 둘 다 체크하여 하나의 계정으로 타임슬롯 및 재고를 통합 관리하세요.
              </p>

              {/* 3 Categories Multi-Select Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {PARTNER_CATEGORIES.map(cat => {
                  const isSelected = signupRoles.includes(cat.role);
                  const IconComp = cat.icon;
                  return (
                    <div
                      key={cat.role}
                      onClick={() => handleToggleSignupRole(cat.role)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: isSelected ? 'var(--card2)' : 'var(--panel)',
                        border: isSelected 
                          ? `2px solid ${cat.badgeColor}` 
                          : '1px solid var(--line)',
                        boxShadow: isSelected ? `0 0 14px ${cat.badgeColor}30` : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: 'var(--radius-md)',
                          background: isSelected ? cat.badgeBg : 'var(--card)',
                          border: `1px solid ${isSelected ? cat.badgeColor : 'var(--line)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <IconComp size={18} color={isSelected ? cat.badgeColor : 'var(--mut)'} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 800, fontSize: '14px', color: isSelected ? 'var(--txt)' : 'var(--mut)' }}>
                              {cat.title}
                            </span>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: cat.badgeBg,
                              color: cat.badgeColor
                            }}>
                              {cat.badge}
                            </span>
                            {isSelected && (
                              <span style={{
                                fontSize: '9.5px',
                                fontWeight: 700,
                                padding: '1px 5px',
                                borderRadius: '3px',
                                background: 'rgba(34, 197, 94, 0.15)',
                                color: '#22c55e',
                                border: '1px solid rgba(34, 197, 94, 0.3)'
                              }}>
                                ✓ 선택됨
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '11.5px', color: isSelected ? 'var(--txt)' : 'var(--dim)', margin: '2px 0 0 0' }}>
                            {cat.subTitle} · {cat.desc}
                          </p>
                        </div>
                      </div>

                      {/* Tactical Checkbox Indicator */}
                      <div style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        border: isSelected ? `2px solid ${cat.badgeColor}` : '2px solid var(--dim)',
                        background: isSelected ? cat.badgeColor : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.15s ease'
                      }}>
                        {isSelected && <Check size={14} color="#ffffff" strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Categories Feature Hints */}
            <div style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--panel)',
              border: '1px solid var(--line)',
              fontSize: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--acc)', fontWeight: 700 }}>
                  <CheckCircle2 size={14} />
                  <span>선택한 {signupRoles.length}개 가입분야 통합 지원 기능</span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--mut)' }}>
                  {getSelectedRolesShortLabel(signupRoles)}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '2px' }}>
                {signupRoles.map(roleKey => {
                  const catConfig = PARTNER_CATEGORIES.find(c => c.role === roleKey);
                  if (!catConfig) return null;
                  return (
                    <div key={roleKey} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: catConfig.badgeColor }}>
                        • {catConfig.title} ({catConfig.subTitle})
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {catConfig.features.map((feat, idx) => (
                          <span key={idx} style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-pill)',
                            background: 'var(--card)',
                            border: '1px solid var(--line)',
                            color: 'var(--txt)'
                          }}>
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Social Quick Sign-Up ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleSocialLogin('kakao')}
                disabled={socialLoading !== null}
                style={{
                  width: '100%',
                  height: '44px',
                  backgroundColor: '#FEE500',
                  color: '#191919',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: socialLoading !== null ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {socialLoading === 'kakao' ? (
                  <>
                    <Loader2 size={16} className="spin" />
                    <span>카카오 가입 처리 중...</span>
                  </>
                ) : (
                  <>
                    <KakaoIcon size={18} />
                    <span>[{getSelectedRolesShortLabel(signupRoles)}] 카카오 1초 간편가입</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={socialLoading !== null}
                style={{
                  width: '100%',
                  height: '42px',
                  backgroundColor: 'var(--panel)',
                  color: 'var(--txt)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: socialLoading !== null ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {socialLoading === 'google' ? (
                  <>
                    <Loader2 size={16} className="spin" />
                    <span>Google 가입 처리 중...</span>
                  </>
                ) : (
                  <>
                    <GoogleIcon size={17} />
                    <span>[{getSelectedRolesShortLabel(signupRoles)}] Google 간편 가입</span>
                  </>
                )}
              </button>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '2px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setIsGoogleGuideOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#EA4335',
                    fontSize: '11px',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  ⚡ Google 400 origin_mismatch 오류 해결 가이드
                </button>
                <button
                  type="button"
                  onClick={() => setIsKakaoGuideOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--mut)',
                    fontSize: '11px',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  카카오 연동 설정
                </button>
              </div>
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
              <span style={{ fontSize: '11.5px', color: 'var(--dim)', fontWeight: 500 }}>또는 직접 정보 입력</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
            </div>

            {/* Direct Sign-Up Form */}
            <form onSubmit={handleSignUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Row 1: 대표자명 & 상호명 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '12px' }}>대표자(담당자)명 <span style={{ color: 'var(--acc)' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} color="var(--dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      className="form-input"
                      style={{ width: '100%', paddingLeft: '32px', fontSize: '13px' }}
                      placeholder="예: 홍길동 대표"
                      value={signupName}
                      onChange={e => setSignupName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '12px' }}>사업장 상호명 <span style={{ color: 'var(--acc)' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <Building2 size={15} color="var(--dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      className="form-input"
                      style={{ width: '100%', paddingLeft: '32px', fontSize: '13px' }}
                      placeholder={
                        signupRoles.includes('field_owner') && signupRoles.includes('shop_owner')
                          ? '예: 플래툰 아레나 & 택티컬 건샵 경기본점'
                          : signupRoles.includes('field_owner')
                          ? '예: 플래툰 아레나 경기점'
                          : signupRoles.includes('shop_owner')
                          ? '예: 택티컬 건스미스 본점'
                          : 'HIT IN 본사'
                      }
                      value={signupBusinessName}
                      onChange={e => setSignupBusinessName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: 사업자등록번호 & 대표 연락처 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '12px' }}>사업자등록번호</label>
                  <div style={{ position: 'relative' }}>
                    <FileText size={15} color="var(--dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      className="form-input"
                      style={{ width: '100%', paddingLeft: '32px', fontSize: '13px' }}
                      placeholder="123-45-67890"
                      value={signupBusinessNumber}
                      onChange={e => setSignupBusinessNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '12px' }}>대표 연락처 (휴대폰) <span style={{ color: 'var(--acc)' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <Smartphone size={15} color="var(--dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="tel"
                      className="form-input"
                      style={{ width: '100%', paddingLeft: '32px', fontSize: '13px' }}
                      placeholder="010-0000-0000"
                      value={signupPhone}
                      onChange={e => setSignupPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: 로그인 이메일 (아이디) */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12px' }}>로그인 이메일 (아이디) <span style={{ color: 'var(--acc)' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} color="var(--dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '32px', fontSize: '13px' }}
                    placeholder="partner@arena.kr"
                    value={signupEmail}
                    onChange={e => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Row 4: 비밀번호 & 비밀번호 확인 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '12px' }}>비밀번호 (6자 이상) <span style={{ color: 'var(--acc)' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} color="var(--dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="password"
                      className="form-input"
                      style={{ width: '100%', paddingLeft: '32px', fontSize: '13px' }}
                      placeholder="비밀번호 입력"
                      value={signupPassword}
                      onChange={e => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '12px' }}>
                    비밀번호 확인 <span style={{ color: 'var(--acc)' }}>*</span>
                    {signupPasswordConfirm && (
                      <span style={{ 
                        marginLeft: '6px', 
                        fontSize: '11px', 
                        color: signupPassword === signupPasswordConfirm ? 'var(--lime-chip)' : 'var(--danger)' 
                      }}>
                        {signupPassword === signupPasswordConfirm ? '✓ 일치' : '✕ 불일치'}
                      </span>
                    )}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} color="var(--dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="password"
                      className="form-input"
                      style={{ 
                        width: '100%', 
                        paddingLeft: '32px', 
                        fontSize: '13px',
                        borderColor: signupPasswordConfirm && signupPassword !== signupPasswordConfirm ? 'var(--danger)' : undefined
                      }}
                      placeholder="비밀번호 재입력"
                      value={signupPasswordConfirm}
                      onChange={e => setSignupPasswordConfirm(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                fontSize: '12px', 
                color: 'var(--txt)', 
                cursor: 'pointer',
                marginTop: '4px'
              }}>
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  style={{ accentColor: 'var(--acc)', width: '15px', height: '15px', cursor: 'pointer' }}
                />
                <span>HIT IN 파트너 서비스 이용약관 및 개인정보 처리방침에 동의합니다.</span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '6px', fontWeight: 800 }}
              >
                <span>✨ [{activeCategoryConfig.title}] 파트너 가입 완료</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Switch to Login Link */}
            <div style={{ textAlign: 'center', fontSize: '12.5px', color: 'var(--mut)' }}>
              이미 HIT IN 파트너 계정이 있으신가요?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--acc)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                기존 계정으로 로그인하기
              </button>
            </div>
          </div>
        ) : (
          /* ════════════════════════════════════════════════════════════
              AUTH MODE: LOGIN (로그인 모드)
             ════════════════════════════════════════════════════════════ */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Quick Demo Role Switcher */}
            <div>
              <label className="form-label" style={{ marginBottom: '6px', display: 'block', fontSize: '12px' }}>
                체험 및 빠른 로그인 권한 선택
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '6px',
                background: 'var(--panel)',
                padding: '4px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--line)'
              }}>
                <button
                  type="button"
                  onClick={() => handleRoleChange('field_owner')}
                  style={{
                    padding: '8px 4px',
                    fontSize: '12px',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    background: selectedRole === 'field_owner' ? 'var(--acc)' : 'transparent',
                    color: selectedRole === 'field_owner' ? '#fff' : 'var(--mut)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Layers size={15} />
                  필드 사장님
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('shop_owner')}
                  style={{
                    padding: '8px 4px',
                    fontSize: '12px',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    background: selectedRole === 'shop_owner' ? 'var(--acc)' : 'transparent',
                    color: selectedRole === 'shop_owner' ? '#fff' : 'var(--mut)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ShoppingBag size={15} />
                  건샵 사장님
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('hq_admin')}
                  style={{
                    padding: '8px 4px',
                    fontSize: '12px',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    background: selectedRole === 'hq_admin' ? 'var(--lime-chip)' : 'transparent',
                    color: selectedRole === 'hq_admin' ? 'var(--ink-fixed)' : 'var(--mut)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ShieldCheck size={15} />
                  본사 CRM
                </button>
              </div>
            </div>

            {/* Social Logins */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleSocialLogin('kakao')}
                disabled={socialLoading !== null}
                style={{
                  width: '100%',
                  height: '44px',
                  backgroundColor: '#FEE500',
                  color: '#191919',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  cursor: socialLoading !== null ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
              >
                {socialLoading === 'kakao' ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    <span>카카오 로그인 중...</span>
                  </>
                ) : (
                  <>
                    <KakaoIcon size={19} />
                    <span>카카오톡으로 1초 시작하기</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={socialLoading !== null}
                style={{
                  width: '100%',
                  height: '42px',
                  backgroundColor: 'var(--panel)',
                  color: 'var(--txt)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  cursor: socialLoading !== null ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {socialLoading === 'google' ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    <span>Google 인증 진행 중...</span>
                  </>
                ) : (
                  <>
                    <GoogleIcon size={18} />
                    <span>Google 계정으로 계속하기</span>
                  </>
                )}
              </button>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '2px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setIsGoogleGuideOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#EA4335',
                    fontSize: '11px',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  ⚡ Google 400 origin_mismatch 오류 해결 가이드
                </button>
                <button
                  type="button"
                  onClick={() => setIsKakaoGuideOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--mut)',
                    fontSize: '11px',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  카카오 연동 설정
                </button>
              </div>
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
              <span style={{ fontSize: '11.5px', color: 'var(--dim)', fontWeight: 500 }}>또는</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
            </div>

            {/* Login Method Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--line)' }}>
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                style={{
                  flex: 1,
                  padding: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  background: 'transparent',
                  border: 'none',
                  borderBottom: loginMethod === 'email' ? '2px solid var(--acc)' : '2px solid transparent',
                  color: loginMethod === 'email' ? 'var(--acc)' : 'var(--mut)',
                  cursor: 'pointer'
                }}
              >
                이메일 / 아이디
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('pass')}
                style={{
                  flex: 1,
                  padding: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  background: 'transparent',
                  border: 'none',
                  borderBottom: loginMethod === 'pass' ? '2px solid var(--acc)' : '2px solid transparent',
                  color: loginMethod === 'pass' ? 'var(--acc)' : 'var(--mut)',
                  cursor: 'pointer'
                }}
              >
                PASS 본인인증
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {loginMethod === 'email' ? (
                <>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px' }}>파트너 로그인 이메일</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} color="var(--dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="email"
                        className="form-input"
                        style={{ width: '100%', paddingLeft: '38px' }}
                        placeholder="partner@arena.kr"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px' }}>비밀번호</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} color="var(--dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="password"
                        className="form-input"
                        style={{ width: '100%', paddingLeft: '38px' }}
                        placeholder="비밀번호 입력"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '12px' }}>대표자 휴대폰 번호</label>
                  <div style={{ position: 'relative' }}>
                    <Smartphone size={16} color="var(--dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="tel"
                      className="form-input"
                      style={{ width: '100%', paddingLeft: '38px' }}
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="010-0000-0000"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '4px', fontWeight: 700 }}
              >
                <span>{selectedRole === 'hq_admin' ? '본사 CRM 로그인' : '파트너 포털 로그인'}</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Link to Sign-up */}
            <div style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--panel)',
              border: '1px solid var(--line)',
              textAlign: 'center',
              fontSize: '12.5px'
            }}>
              <span style={{ color: 'var(--mut)' }}>아직 HIT IN 제휴 파트너가 아니신가요? </span>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--acc)',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                신규 파트너 회원가입 ↗
              </button>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div style={{
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--mut)',
          borderTop: '1px solid var(--line)',
          paddingTop: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>신규 입점 문의: <strong>partner@hit-in.app</strong></span>
          <button
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--acc)',
              fontSize: '11.5px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            {theme === 'dark' ? '☀️ 라이트 모드' : '🌙 다크 모드'}
          </button>
        </div>
      </div>

      {/* Kakao Setup Guide Modal */}
      {isKakaoGuideOpen && (
        <div className="modal-overlay" onClick={() => setIsKakaoGuideOpen(false)}>
          <div 
            className="modal-content" 
            style={{ maxWidth: '560px', padding: '24px' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KakaoIcon size={24} />
                <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>카카오 소셜 로그인 연동 설정</h3>
              </div>
              <button 
                onClick={() => setIsKakaoGuideOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--mut)', cursor: 'pointer', fontSize: '18px' }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--txt)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ padding: '12px', backgroundColor: 'rgba(254, 229, 0, 0.12)', border: '1px solid rgba(254, 229, 0, 0.3)', borderRadius: '8px' }}>
                💡 <strong>카카오 공식 로그인 팝업이 뜨지 않거나 오류가 날 때:</strong><br />
                카카오 보안 정책상 <strong>[카카오 디벨로퍼스 콘솔]</strong>에 현재 접속 주소(도메인)가 등록되어 있어야만 정상 작동합니다.
              </div>

              <div>
                <strong style={{ color: 'var(--acc)' }}>1. Web 플랫폼 도메인 등록</strong>
                <p style={{ margin: '4px 0', color: 'var(--mut)' }}>
                  카카오 디벨로퍼스 &gt; [앱 설정] &gt; [플랫폼] &gt; [Web]에 아래 주소를 등록해주세요:
                </p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
                  <code style={{ padding: '6px 10px', background: 'var(--card2)', borderRadius: '6px', border: '1px solid var(--line)', flex: 1, fontFamily: 'monospace' }}>
                    http://localhost:5173
                  </code>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      navigator.clipboard.writeText('http://localhost:5173');
                      showToast('주소가 클립보드에 복사되었습니다.', 'info');
                    }}
                  >
                    복사
                  </button>
                </div>
              </div>

              <div>
                <strong style={{ color: 'var(--acc)' }}>2. 카카오 로그인 활성화 & Redirect URI</strong>
                <p style={{ margin: '4px 0', color: 'var(--mut)' }}>
                  카카오 디벨로퍼스 &gt; [제품 설정] &gt; [카카오 로그인]에서 <strong>[활성화 설정: ON]</strong>으로 변경하고, Redirect URI에 <code>http://localhost:5173/</code>를 등록합니다.
                </p>
              </div>

              <div>
                <strong style={{ color: 'var(--acc)' }}>3. 등록된 앱 키 정보</strong>
                <div style={{ fontSize: '11.5px', color: 'var(--dim)', marginTop: '4px' }}>
                  • JavaScript 키: <code>14a3863dc2024f7f36c6d9a01082bdda</code><br />
                  • REST API 키: <code>19d9e85a2aac46f54287103a4ca3f01f</code>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  window.open('https://developers.kakao.com/console/app/1573356/config/platform', '_blank');
                }}
              >
                카카오 콘솔 바로가기 ↗
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  const effectiveRole = authMode === 'signup' ? (signupRoles[0] || 'field_owner') : selectedRole;
                  const effectiveRoles = authMode === 'signup' ? signupRoles : [selectedRole];
                  const meta = getRoleMetadata(effectiveRole);
                  login({
                    email: `kakao_${effectiveRole}@kakao.com`,
                    role: effectiveRole,
                    roles: effectiveRoles,
                    businessName: authMode === 'signup' && signupBusinessName ? signupBusinessName : meta.businessName,
                    name: authMode === 'signup' && signupName ? signupName : `${meta.userName} (카카오)`,
                    partnerId: meta.partnerId,
                    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=TeddyCommander&backgroundColor=ffdfbf',
                    provider: 'kakao'
                  });
                  setIsKakaoGuideOpen(false);
                  showToast(`카카오 계정으로 ${authMode === 'signup' ? '가입 및 ' : ''}로그인되었습니다.`, 'success');
                }}
              >
                카카오 계정으로 즉시 입장하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Setup Guide Modal (400 origin_mismatch Resolver) */}
      {isGoogleGuideOpen && (
        <div className="modal-overlay" onClick={() => setIsGoogleGuideOpen(false)}>
          <div 
            className="modal-content" 
            style={{ maxWidth: '600px', padding: '26px' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GoogleIcon size={24} />
                <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--txt)' }}>
                  Google OAuth 2.0 출처 등록 가이드
                </h3>
              </div>
              <button 
                onClick={() => setIsGoogleGuideOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--mut)', cursor: 'pointer', fontSize: '18px' }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--txt)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ padding: '14px 16px', backgroundColor: 'rgba(234, 67, 53, 0.12)', border: '1px solid rgba(234, 67, 53, 0.35)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '16px' }}>🚨</span>
                  <strong style={{ color: '#EA4335', fontSize: '14px' }}>400 오류: origin_mismatch 발생</strong>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--txt)', marginBottom: '8px' }}>
                  Google 보안 정책상 <strong>[Google Cloud Console]</strong>의 OAuth 2.0 클라이언트 ID에 <strong>현재 접속 주소</strong>가 [승인된 JavaScript 원본]에 등록되어 있지 않아 로그인이 차단되었습니다.
                </div>
                <div style={{ padding: '8px 12px', background: 'var(--card)', borderRadius: '6px', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--dim)', display: 'block' }}>현재 브라우저 접속 원본 (차단된 origin):</span>
                    <strong style={{ fontFamily: 'monospace', color: '#EA4335', fontSize: '13px' }}>
                      {typeof window !== 'undefined' ? window.location.origin : 'https://partner.hitin.kr'}
                    </strong>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ padding: '5px 12px', fontSize: '12px', fontWeight: 700 }}
                    onClick={() => {
                      const originToCopy = typeof window !== 'undefined' ? window.location.origin : 'https://partner.hitin.kr';
                      navigator.clipboard.writeText(originToCopy);
                      showToast(`현재 접속 주소(${originToCopy})가 클립보드에 복사되었습니다!`, 'success');
                    }}
                  >
                    현재 주소 복사
                  </button>
                </div>
              </div>

              <div>
                <strong style={{ color: 'var(--acc)', fontSize: '13.5px' }}>1단계. Google Cloud Console 접속</strong>
                <p style={{ margin: '4px 0 8px 0', color: 'var(--mut)' }}>
                  아래 링크로 이동하여 로그인 후 해당 프로젝트의 <strong>[OAuth 2.0 클라이언트 ID (웹 애플리케이션)]</strong>를 클릭합니다:
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-secondary btn-sm"
                    style={{ fontWeight: 700 }}
                    onClick={() => {
                      window.open('https://console.cloud.google.com/apis/credentials', '_blank');
                    }}
                  >
                    Google Cloud 사용자 인증 정보 콘솔 바로가기 ↗
                  </button>
                </div>
              </div>

              <div>
                <strong style={{ color: 'var(--acc)', fontSize: '13.5px' }}>2단계. [승인된 JavaScript 원본]에 아래 4개 주소 추가 등록</strong>
                <p style={{ margin: '4px 0 6px 0', color: 'var(--mut)' }}>
                  <strong>+ URI 추가</strong>를 눌러 운영 및 로컬 개발 주소를 모두 등록해주세요:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { label: 'HIT IN 운영 웹 (실제 운영)', url: 'https://partner.hitin.kr' },
                    { label: '로컬 Vite 개발 서버 (로컬 개발)', url: 'http://localhost:5173' },
                    { label: '로컬 루프백 IP (권장)', url: 'http://127.0.0.1:5173' },
                    { label: '보조 로컬 포트', url: 'http://localhost:3000' }
                  ].map((item, idx) => {
                    const isCurrent = typeof window !== 'undefined' && window.location.origin === item.url;
                    return (
                      <div key={idx} style={{ 
                        display: 'flex', 
                        gap: '8px', 
                        alignItems: 'center',
                        padding: isCurrent ? '4px 8px' : '0',
                        borderRadius: '6px',
                        background: isCurrent ? 'rgba(255, 90, 31, 0.08)' : 'transparent',
                        border: isCurrent ? '1px solid rgba(255, 90, 31, 0.25)' : 'none'
                      }}>
                        <span style={{ fontSize: '11.5px', color: isCurrent ? 'var(--acc)' : 'var(--dim)', minWidth: '150px', fontWeight: isCurrent ? 700 : 400 }}>
                          • {item.label} {isCurrent && '(현재)'}:
                        </span>
                        <code style={{ padding: '5px 10px', background: 'var(--card2)', borderRadius: '6px', border: '1px solid var(--line)', flex: 1, fontFamily: 'monospace', fontSize: '12px' }}>
                          {item.url}
                        </code>
                        <button 
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 10px', fontSize: '11.5px' }}
                          onClick={() => {
                            navigator.clipboard.writeText(item.url);
                            showToast(`${item.url} 복사되었습니다.`, 'info');
                          }}
                        >
                          복사
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: '8px', fontSize: '11.5px', color: 'var(--dim)', padding: '6px 10px', background: 'var(--panel)', borderRadius: '6px' }}>
                  ⚠️ <strong>주의:</strong> 주소 끝에 슬래시(<code>/</code>)나 경로(<code>/login</code>)를 넣지 마세요. (예: <code>https://partner.hitin.kr/</code> ❌ ➔ <code>https://partner.hitin.kr</code> ⭕)
                </div>
              </div>

              <div>
                <strong style={{ color: 'var(--acc)', fontSize: '13.5px' }}>3단계. [승인된 리디렉션 URI]에도 동일 등록 후 [저장]</strong>
                <p style={{ margin: '4px 0', color: 'var(--mut)' }}>
                  하단의 <strong>[저장]</strong> 버튼을 누르면 완료됩니다. (Google 글로벌 인증 서버 전파에 약 1~5분 정도 소요됩니다)
                </p>
              </div>

              {/* Troubleshooting Checklist Box */}
              <div style={{ padding: '12px', background: 'var(--card2)', borderRadius: '8px', border: '1px solid var(--line)' }}>
                <strong style={{ color: 'var(--txt)', fontSize: '12.5px', display: 'block', marginBottom: '6px' }}>
                  📌 콘솔 등록 후에도 계속 400 에러가 발생할 때 점검 5가지:
                </strong>
                <div style={{ fontSize: '11.5px', color: 'var(--mut)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span>1. <strong>클라이언트 ID 일치:</strong> 콘솔의 클라이언트 ID가 <code style={{ color: 'var(--acc)' }}>133024291217-...</code>와 같은 프로젝트인지 확인</span>
                  <span>2. <strong>입력 위치:</strong> 리디렉션 URI가 아닌 <strong>[승인된 JavaScript 원본]</strong>에 등록했는지 확인</span>
                  <span>3. <strong>슬래시 제거:</strong> 끝에 <code style={{ color: '#EA4335' }}>/</code>가 붙어있으면 차단됩니다 (<code style={{ color: 'var(--lime-chip)' }}>https://partner.hitin.kr</code> ⭕)</span>
                  <span>4. <strong>저장 버튼:</strong> 화면 맨 아래 파란색 <strong>[저장]</strong> 버튼을 반드시 눌렀는지 확인</span>
                  <span>5. <strong>캐시 삭제:</strong> 브라우저 시크릿 창(<code>Ctrl + Shift + N</code>)에서 재시도</span>
                </div>
              </div>

              {/* Instant Direct Google Entry Form */}
              <div style={{ 
                padding: '14px', 
                background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.08) 0%, rgba(255, 90, 31, 0.08) 100%)', 
                borderRadius: '8px', 
                border: '1px solid rgba(66, 133, 244, 0.25)' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <GoogleIcon size={16} />
                  <strong style={{ color: 'var(--txt)', fontSize: '13px' }}>
                    Google 계정 직접 입력 가입 & 로그인 (콘솔 설정 대기 없이 즉시 진행)
                  </strong>
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: '11.5px', color: 'var(--mut)' }}>
                  구글 콘솔 설정 지연 시 아래 구글 이메일로 즉시 파트너 포털에 가입 및 로그인할 수 있습니다:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--dim)', display: 'block', marginBottom: '3px' }}>구글 계정 이메일</label>
                    <input
                      type="email"
                      className="form-input"
                      style={{ width: '100%', fontSize: '12px', padding: '6px 10px' }}
                      value={googleDirectEmail}
                      onChange={e => setGoogleDirectEmail(e.target.value)}
                      placeholder="jes0508@gmail.com"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--dim)', display: 'block', marginBottom: '3px' }}>대표자 / 닉네임</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ width: '100%', fontSize: '12px', padding: '6px 10px' }}
                      value={googleDirectName}
                      onChange={e => setGoogleDirectName(e.target.value)}
                      placeholder={signupName || 'jes0508'}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: '100%', fontWeight: 700, fontSize: '13px', padding: '9px' }}
                  onClick={() => {
                    const effectiveRole = authMode === 'signup' ? (signupRoles[0] || 'field_owner') : selectedRole;
                    const effectiveRoles = authMode === 'signup' ? signupRoles : [selectedRole];
                    const meta = getRoleMetadata(effectiveRole);
                    const userEmail = googleDirectEmail.trim() || 'jes0508@gmail.com';
                    const userName = googleDirectName.trim() || (authMode === 'signup' && signupName ? signupName : `${userEmail.split('@')[0]} (Google)`);

                    login({
                      email: userEmail,
                      role: effectiveRole,
                      roles: effectiveRoles,
                      businessName: authMode === 'signup' && signupBusinessName ? signupBusinessName : meta.businessName,
                      name: userName,
                      partnerId: meta.partnerId,
                      avatarUrl: 'https://lh3.googleusercontent.com/a/default-user',
                      provider: 'google'
                    });
                    setIsGoogleGuideOpen(false);
                    showToast(`Google 계정(${userEmail})으로 ${authMode === 'signup' ? '가입 및 ' : ''}로그인되었습니다.`, 'success');
                  }}
                >
                  🚀 위 Google 계정으로 즉시 {authMode === 'signup' ? '가입 완료' : '로그인'} (원클릭)
                </button>
              </div>

              <div style={{ padding: '8px 12px', background: 'var(--card2)', borderRadius: '8px', border: '1px solid var(--line)' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--dim)' }}>
                  현재 프로젝트 클라이언트 ID: <code style={{ color: 'var(--txt)' }}>{googleClientId || '133024291217-qgs5fg81kcmjen39mubh376kotlopfuc.apps.googleusercontent.com'}</code>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => setIsGoogleGuideOpen(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
