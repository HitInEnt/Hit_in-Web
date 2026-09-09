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
  CheckCircle2
} from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';
import { PartnerRole } from '../../types';

export const LoginView: React.FC = () => {
  const { login, theme, toggleTheme } = usePartner();

  const [selectedRole, setSelectedRole] = useState<PartnerRole>('field_owner');
  const [email, setEmail] = useState('field_manager@platoon.kr');
  const [password, setPassword] = useState('••••••••');
  const [phone, setPhone] = useState('010-8921-4432');
  const [loginMethod, setLoginMethod] = useState<'email' | 'pass'>('email');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let businessName = '플래툰 아레나 경기점';
    let userName = '김태식 대표';
    let partnerId = 'fld_01';

    if (selectedRole === 'shop_owner') {
      businessName = '건스미스 서울본점';
      userName = '박성호 실장';
      partnerId = 'shp_01';
    } else if (selectedRole === 'hq_admin') {
      businessName = 'HIT IN 본사 운영센터';
      userName = '최민준 총괄팀장';
      partnerId = 'hq_01';
    }

    login({
      email,
      role: selectedRole,
      businessName,
      name: userName,
      partnerId
    });
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
        padding: '36px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
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
            marginBottom: '12px'
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
            이메일 / 아이디 로그인
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
            PASS 본인인증 로그인
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
            style={{ width: '100%', marginTop: '6px' }}
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
          paddingTop: '14px',
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
    </div>
  );
};
