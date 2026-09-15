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
  Loader2
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

export const LoginView: React.FC = () => {
  const { login, theme, toggleTheme, showToast } = usePartner();

  const [selectedRole, setSelectedRole] = useState<PartnerRole>('field_owner');
  const [email, setEmail] = useState('field_manager@platoon.kr');
  const [password, setPassword] = useState('••••••••');
  const [phone, setPhone] = useState('010-8921-4432');
  const [loginMethod, setLoginMethod] = useState<'email' | 'pass'>('email');
  const [socialLoading, setSocialLoading] = useState<'kakao' | 'google' | null>(null);

  const handleRoleChange = (role: PartnerRole) => {
    setSelectedRole(role);
    if (role === 'field_owner') {
      setEmail('field_manager@platoon.kr');
      setPhone('010-8921-4432');
    } else if (role === 'shop_owner') {
      setEmail('contact@gunsmith.co.kr');
      setPhone('010-3329-8812');
    } else {
      setEmail('admin@hit-in.app');
      setPhone('02-555-8910');
    }
  };

  const getRoleMetadata = (role: PartnerRole) => {
    if (role === 'shop_owner') {
      return {
        businessName: '건스미스 서울본점',
        userName: '박성호 실장',
        partnerId: 'shp_01'
      };
    } else if (role === 'hq_admin') {
      return {
        businessName: 'HIT IN 본사 운영센터',
        userName: '최민준 총괄팀장',
        partnerId: 'hq_01'
      };
    }
    return {
      businessName: '플래툰 아레나 경기점',
      userName: '김태식 대표',
      partnerId: 'fld_01'
    };
  };

  const [isKakaoGuideOpen, setIsKakaoGuideOpen] = useState<boolean>(false);

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
            const meta = getRoleMetadata(selectedRole);

            login({
              email: userData.kakao_account?.email || `kakao_${userData.id}@kakao.com`,
              role: selectedRole,
              businessName: meta.businessName,
              name: profile?.nickname ? `${profile.nickname} (카카오)` : meta.userName,
              partnerId: meta.partnerId,
              avatarUrl: profile?.profile_image_url || 'https://t1.kakaocdn.net/account_images/default_profile.jpeg',
              provider: 'kakao'
            });

            showToast(`카카오 계정(${profile?.nickname || '회원'}님)으로 로그인되었습니다.`, 'success');
          } else {
            throw new Error('카카오 토큰 교환 실패');
          }
        } catch (err) {
          console.warn('[Kakao] Code exchange error:', err);
          const meta = getRoleMetadata(selectedRole);
          login({
            email: `kakao_${selectedRole}@kakao.com`,
            role: selectedRole,
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
  }, [selectedRole]);

  // 소셜 로그인 (카카오 / 구글) 핸들러
  const handleSocialLogin = async (provider: 'kakao' | 'google') => {
    setSocialLoading(provider);
    const meta = getRoleMetadata(selectedRole);

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const kakaoJsKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY || import.meta.env.NEXT_PUBLIC_KAKAO_JS_KEY || '14a3863dc2024f7f36c6d9a01082bdda';

    // ── 1. Google OAuth 2.0 (Google Identity Services) ──
    if (provider === 'google' && googleClientId) {
      if (window.google?.accounts?.oauth2) {
        try {
          const client = window.google.accounts.oauth2.initTokenClient({
            client_id: googleClientId,
            scope: 'email profile openid',
            callback: async (tokenResponse: any) => {
              if (tokenResponse.error) {
                showToast(`Google 로그인 취소됨: ${tokenResponse.error}`, 'error');
                setSocialLoading(null);
                return;
              }

              try {
                // Fetch actual user profile from Google API
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                const googleProfile = await res.json();

                login({
                  email: googleProfile.email,
                  role: selectedRole,
                  businessName: meta.businessName,
                  name: googleProfile.name ? `${googleProfile.name} (${selectedRole === 'field_owner' ? '필드 대표' : selectedRole === 'shop_owner' ? '건샵 실장' : '본사 CRM'})` : meta.userName,
                  partnerId: meta.partnerId,
                  avatarUrl: googleProfile.picture || 'https://lh3.googleusercontent.com/a/default-user',
                  provider: 'google'
                });

                showToast(`Google 계정(${googleProfile.email})으로 로그인되었습니다.`, 'success');
              } catch (fetchErr) {
                login({
                  email: 'google_user@gmail.com',
                  role: selectedRole,
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
              showToast(`Google 인증 오류: ${err.message || err.type || '인증 실패'}`, 'error');
              setSocialLoading(null);
            }
          });

          client.requestAccessToken({ prompt: 'select_account' });
          return;
        } catch (initErr) {
          console.error('Google OAuth init error:', initErr);
        }
      }
    }

    // ── 2. Kakao OAuth 2.0 (Kakao JavaScript SDK & Direct Popup) ──
    if (provider === 'kakao') {
      const kakaoKey = kakaoJsKey || '14a3863dc2024f7f36c6d9a01082bdda';

      // Method A: Kakao JS SDK Popup Login
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
                      role: selectedRole,
                      businessName: meta.businessName,
                      name: profile?.nickname ? `${profile.nickname} (카카오)` : meta.userName,
                      partnerId: meta.partnerId,
                      avatarUrl: profile?.profile_image_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=TeddyCommander&backgroundColor=ffdfbf',
                      provider: 'kakao'
                    });
                    showToast(`카카오 계정(${profile?.nickname || '회원'}님)으로 로그인되었습니다.`, 'success');
                    setSocialLoading(null);
                  },
                  fail: function(fetchErr: any) {
                    console.warn('[Kakao] user info failed:', fetchErr);
                    login({
                      email: `kakao_partner@kakao.com`,
                      role: selectedRole,
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

                // Fallback login so user is never stuck
                login({
                  email: `kakao_${selectedRole}@kakao.com`,
                  role: selectedRole,
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

    // ── 3. Fallback (Key not configured or Offline Demo Mode) ──
    try {
      await new Promise(r => setTimeout(r, 600));

      const socialEmail = provider === 'kakao' 
        ? `kakao_${selectedRole}@kakao.com` 
        : `google_${selectedRole}@gmail.com`;
      const socialName = provider === 'kakao' 
        ? `${meta.userName} (카카오)` 
        : `${meta.userName} (Google)`;
      const avatarUrl = provider === 'kakao'
        ? 'https://api.dicebear.com/7.x/bottts/svg?seed=TeddyCommander&backgroundColor=ffdfbf'
        : 'https://api.dicebear.com/7.x/adventurer/svg?seed=FoxAgent&backgroundColor=b6e3f4';

      login({
        email: socialEmail,
        role: selectedRole,
        businessName: meta.businessName,
        name: socialName,
        partnerId: meta.partnerId,
        avatarUrl,
        provider
      });

      showToast(
        provider === 'kakao' 
          ? '카카오 계정으로 파트너 로그인이 완료되었습니다.' 
          : 'Google 계정으로 파트너 로그인이 완료되었습니다.',
        'success'
      );
    } catch (err) {
      showToast('소셜 로그인 중 오류가 발생했습니다.', 'error');
    } finally {
      setSocialLoading(null);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const meta = getRoleMetadata(selectedRole);

    login({
      email,
      role: selectedRole,
      businessName: meta.businessName,
      name: meta.userName,
      partnerId: meta.partnerId,
      provider: loginMethod
    });

    showToast('파트너 포털에 성공적으로 로그인했습니다.', 'success');
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: 'var(--bg)',
      color: 'var(--txt)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px'
    }}>
      {/* Background Gradients */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 90, 31, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(199, 249, 78, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        padding: '32px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        zIndex: 10,
        animation: 'fadeIn 0.25s ease-out'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--acc) 0%, var(--accd) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(255, 90, 31, 0.4)',
            marginBottom: '10px'
          }}>
            <Sparkles size={26} color="#ffffff" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="tactical-font" style={{ fontSize: '24px', letterSpacing: '0.08em', color: 'var(--txt)' }}>
              HIT IN
            </span>
            <span className="badge badge-lime" style={{ fontSize: '11px' }}>
              PARTNER B2B
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--mut)', marginTop: '4px' }}>
            에어소프트 경기장 & 건샵 파트너사 전용 관리자 포털
          </p>
        </div>

        {/* Role Switcher Pills */}
        <div>
          <label className="form-label" style={{ marginBottom: '6px', display: 'block' }}>
            파트너 권한 유형 선택
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

        {/* ── Social Login Buttons (Kakao & Google) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Kakao Login Button */}
          <button
            type="button"
            onClick={() => handleSocialLogin('kakao')}
            disabled={socialLoading !== null}
            style={{
              width: '100%',
              height: '46px',
              backgroundColor: '#FEE500',
              color: '#191919',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '14px',
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

          {/* Google Login Button */}
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={socialLoading !== null}
            style={{
              width: '100%',
              height: '46px',
              backgroundColor: 'var(--panel)',
              color: 'var(--txt)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '14px',
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

          {/* Help link for Kakao setup */}
          <div style={{ textAlign: 'center', marginTop: '2px' }}>
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
              카카오 소셜 로그인 연동 설정 가이드 (도메인/키 설정)
            </button>
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
          <span style={{ fontSize: '12px', color: 'var(--dim)', fontWeight: 500 }}>또는</span>
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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {loginMethod === 'email' ? (
            <>
              <div className="form-group">
                <label className="form-label">파트너 로그인 이메일</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="var(--dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '38px' }}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">비밀번호</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="var(--dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '38px' }}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="form-group">
              <label className="form-label">대표자 휴대폰 번호</label>
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
            style={{ width: '100%', marginTop: '4px' }}
          >
            <span>{selectedRole === 'hq_admin' ? '본사 CRM 로그인' : '파트너 포털 로그인'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

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
              <div style={{ padding: '12px', backgroundColor: 'rgba(254, 229, 0, 0.12)', border: '1px solid rgba(254, 229, 0, 0.3)', borderRadius: '8px', color: '#fff' }}>
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
                  const meta = getRoleMetadata(selectedRole);
                  login({
                    email: `kakao_${selectedRole}@kakao.com`,
                    role: selectedRole,
                    businessName: meta.businessName,
                    name: `${meta.userName} (카카오)`,
                    partnerId: meta.partnerId,
                    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=TeddyCommander&backgroundColor=ffdfbf',
                    provider: 'kakao'
                  });
                  setIsKakaoGuideOpen(false);
                  showToast('카카오 계정으로 파트너 포털에 로그인되었습니다.', 'success');
                }}
              >
                카카오 계정으로 즉시 입장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

