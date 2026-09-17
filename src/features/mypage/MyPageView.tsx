import React, { useState, useRef } from 'react';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  FileText, 
  Camera, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Scale, 
  ExternalLink, 
  Trash2, 
  Key, 
  Layers, 
  ShoppingBag, 
  CheckCircle2, 
  RefreshCw, 
  Upload, 
  CreditCard,
  Lock,
  Globe
} from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';
import { PartnerRole } from '../../types';
import { CUTE_CHARACTER_AVATARS, PRESET_AVATARS } from '../../components/common/ProfileEditModal';
import { formatPhoneNumber, formatBusinessNumber } from '../../utils/formatters';

export const MyPageView: React.FC = () => {
  const { role, user, updateProfile, setRole, showToast, logout } = usePartner();

  // Form states
  const [name, setName] = useState(user.name);
  const [businessName, setBusinessName] = useState(user.businessName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [businessNumber, setBusinessNumber] = useState(user.businessNumber || '');
  const [selectedRoles, setSelectedRoles] = useState<PartnerRole[]>(
    user.roles && user.roles.length > 0 ? user.roles : [user.role]
  );
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || PRESET_AVATARS[0]);
  const [customAvatarInput, setCustomAvatarInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggleRole = (roleKey: PartnerRole) => {
    setSelectedRoles(prev => {
      if (prev.includes(roleKey)) {
        if (prev.length <= 1) {
          showToast('최소 1개 이상의 운영 분야를 선택해야 합니다.', 'warning');
          return prev;
        }
        return prev.filter(r => r !== roleKey);
      } else {
        return [...prev, roleKey];
      }
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('대표자명을 입력해주세요.', 'error');
      return;
    }
    if (!businessName.trim()) {
      showToast('사업장(파트너사)명을 입력해주세요.', 'error');
      return;
    }
    if (selectedRoles.length === 0) {
      showToast('최소 1개 이상의 운영 분야를 선택해주세요.', 'warning');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      updateProfile({
        name: name.trim(),
        businessName: businessName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        businessNumber: businessNumber.trim(),
        roles: selectedRoles,
        role: selectedRoles.includes(role) ? role : selectedRoles[0],
        avatarUrl
      });
      setIsSaving(false);
      showToast('마이페이지 정보가 성공적으로 저장되었습니다.', 'success');
    }, 300);
  };

  // Image Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('이미지 파일(JPG, PNG, GIF, WEBP)만 업로드 가능합니다.', 'warning');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showToast('파일 용량은 15MB 이하여야 합니다.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 400;
        let { width, height } = img;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setAvatarUrl(compressedDataUrl);
          showToast('새 프로필 사진이 적용되었습니다. [저장하기]를 눌러 반영하세요.', 'success');
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const getRoleTheme = (r: PartnerRole) => {
    switch (r) {
      case 'field_owner':
        return { label: '필드관리', badge: 'badge-orange', color: 'var(--acc)', bg: 'rgba(255, 90, 31, 0.12)' };
      case 'shop_owner':
        return { label: '건샵관리', badge: 'badge-cyan', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)' };
      case 'hq_admin':
        return { label: '본사관리', badge: 'badge-lime', color: 'var(--lime-chip)', bg: 'rgba(199, 249, 78, 0.15)' };
    }
  };

  const currentTheme = getRoleTheme(role);

  return (
    <div className="page-scrollable animate-fade-in" style={{ paddingBottom: '80px' }}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      {/* 1. Header Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${currentTheme.bg} 0%, rgba(19, 27, 46, 0.95) 100%)`,
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={avatarUrl}
              alt={name}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: `3px solid ${currentTheme.color}`,
                boxShadow: 'var(--shadow-md)'
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="사진 변경"
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--acc)',
                border: '2px solid var(--card)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Camera size={12} />
            </button>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: 'var(--txt)' }}>
                {businessName || '사업장명을 등록해주세요'}
              </h2>
              <span className={`badge ${currentTheme.badge}`} style={{ fontSize: '11px', padding: '3px 8px' }}>
                {currentTheme.label}
              </span>
              {user.status === 'pending_approval' && (
                <span className="badge badge-orange" style={{ fontSize: '11px', padding: '3px 8px', fontWeight: 800 }}>
                  ⏳ 가맹 심사 대기 중
                </span>
              )}
              {user.status === 'active' && (
                <span className="badge badge-lime" style={{ fontSize: '11px', padding: '3px 8px', fontWeight: 800 }}>
                  ✓ 가맹 승인 완료
                </span>
              )}
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--mut)', marginTop: '4px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span>대표자: <strong>{name || '미등록'}</strong></span>
              <span>계정 이메일: <strong>{email}</strong></span>
              <span>파트너 ID: <code style={{ color: 'var(--acc)' }}>{user.partnerId}</code></span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              window.history.pushState({}, '', '/privacy');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
          >
            <ShieldCheck size={14} color="#60A5FA" />
            <span>개인정보방침 ↗</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              window.history.pushState({}, '', '/terms');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
          >
            <Scale size={14} color="var(--acc)" />
            <span>이용약관 ↗</span>
          </button>
        </div>
      </div>

      {/* 2. Main Form Grid */}
      <form onSubmit={handleSaveProfile}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          
          {/* Card 1: 기본 정보 & 사업자 정보 */}
          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>
              <Building2 size={18} color="var(--acc)" />
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--txt)' }}>
                업체 기본 정보 관리
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">사업장(파트너사) 상호명 *</label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={14} color="var(--dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '32px' }}
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    placeholder="예: HIT IN 아레나 / 건샵"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">대표자 성명 *</label>
                <div style={{ position: 'relative' }}>
                  <User size={14} color="var(--dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '32px' }}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="대표자 이름"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">대표 연락처 (휴대전화)</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={14} color="var(--dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="tel"
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '32px' }}
                    value={phone}
                    onChange={e => setPhone(formatPhoneNumber(e.target.value))}
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">사업자등록번호</label>
                <div style={{ position: 'relative' }}>
                  <FileText size={14} color="var(--dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '32px' }}
                    value={businessNumber}
                    onChange={e => setBusinessNumber(formatBusinessNumber(e.target.value))}
                    placeholder="000-00-00000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: 운영 분야 및 아바타 설정 */}
          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>
              <Sparkles size={18} color="var(--acc)" />
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--txt)' }}>
                운영 분야 및 캐릭터 아바타
              </h3>
            </div>

            {/* Operating Roles Multi-Selection */}
            <div style={{ marginBottom: '18px' }}>
              <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
                운영 분야 선택 (복수 선택 가능)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${role === 'hq_admin' || (user.roles && user.roles.includes('hq_admin')) ? 3 : 2}, 1fr)`, gap: '8px' }}>
                {[
                  { role: 'field_owner' as PartnerRole, label: '🏟️ 필드관리', sub: '타임슬롯 & QR' },
                  { role: 'shop_owner' as PartnerRole, label: '🔫 건샵관리', sub: '렌탈 & 예약' },
                  ...((role === 'hq_admin' || (user.roles && user.roles.includes('hq_admin'))) ? [{ role: 'hq_admin' as PartnerRole, label: '👑 본사관리', sub: '플랫폼 & 심사' }] : [])
                ].map(item => {
                  const isChecked = selectedRoles.includes(item.role);
                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => handleToggleRole(item.role)}
                      style={{
                        padding: '10px 8px',
                        borderRadius: 'var(--radius-md)',
                        background: isChecked ? (item.role === 'shop_owner' ? 'rgba(56, 189, 248, 0.15)' : item.role === 'hq_admin' ? 'rgba(199, 249, 78, 0.15)' : 'rgba(255, 90, 31, 0.12)') : 'var(--panel)',
                        border: `1px solid ${isChecked ? (item.role === 'shop_owner' ? '#38bdf8' : item.role === 'hq_admin' ? 'var(--lime-chip)' : 'var(--acc)') : 'var(--line)'}`,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: 700, color: isChecked ? 'var(--txt)' : 'var(--mut)' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--dim)', marginTop: '2px' }}>
                        {item.sub}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Character Preset Avatars */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="form-label" style={{ margin: 0 }}>택티컬 마스코트 아바타 선택</label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--acc)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  📁 내 사진 파일 업로드
                </button>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))',
                gap: '8px',
                padding: '10px',
                background: 'var(--panel)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--line)'
              }}>
                {CUTE_CHARACTER_AVATARS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(item.url)}
                    title={item.name}
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      border: avatarUrl === item.url ? '3px solid var(--acc)' : '1px solid var(--line)',
                      padding: '2px',
                      background: 'var(--card)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: avatarUrl === item.url ? 'scale(1.1)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <img src={item.url} alt={item.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isSaving}
            style={{ fontWeight: 800, padding: '10px 24px' }}
          >
            <Check size={18} />
            <span>{isSaving ? '저장 중...' : '마이페이지 정보 변경 저장'}</span>
          </button>
        </div>
      </form>

      {/* 3. 📜 마이페이지 하단: 개인정보처리방침 & 서비스 이용약관 섹션 */}
      <div className="card" style={{
        padding: '24px',
        border: '1px solid var(--line)',
        background: 'var(--card)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          borderBottom: '1px solid var(--line)',
          paddingBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="var(--acc)" />
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--txt)', margin: 0 }}>
              📜 마이페이지 법적 고지 및 개인정보 보호정책 (Legal & Privacy)
            </h3>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--dim)' }}>
            Google OAuth 2.0 정책 준수
          </span>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--mut)', lineHeight: 1.6, marginBottom: '16px' }}>
          HIT IN 파트너 센터는 이용자의 개인정보를 안전하게 보호하며, Google API 서비스 사용자 데이터 정책(Limited Use Requirements)을 철저히 준수합니다.
        </p>

        {/* Legal Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px',
          marginBottom: '18px'
        }}>
          {/* Privacy Policy Card */}
          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--panel)',
            border: '1px solid var(--line)',
            borderLeft: '4px solid #60A5FA',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '14px', color: 'var(--txt)' }}>
                <ShieldCheck size={16} color="#60A5FA" />
                <span>개인정보처리방침 (Privacy Policy)</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--mut)', marginTop: '6px', lineHeight: 1.5, margin: '6px 0 0 0' }}>
                • Google OAuth 수집 데이터: 이메일, 이름, 프로필 사진, 고유 ID<br />
                • 수집 목적: 파트너 식별, 세션 유지 및 예약/정산 관리<br />
                • 제3자 미제공 및 불공유 원칙 준수
              </p>
            </div>
            <a
              href="/privacy"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/privacy');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'center', gap: '6px', fontWeight: 600, cursor: 'pointer' }}
            >
              <span>개인정보처리방침 전문 열람</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Terms of Service Card */}
          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--panel)',
            border: '1px solid var(--line)',
            borderLeft: '4px solid var(--acc)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '14px', color: 'var(--txt)' }}>
                <Scale size={16} color="var(--acc)" />
                <span>서비스 이용약관 (Terms of Service)</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--mut)', marginTop: '6px', lineHeight: 1.5, margin: '6px 0 0 0' }}>
                • HIT IN 플랫폼 경기장/건샵 운영 규정 및 파트너 권리의무<br />
                • Google OAuth 계정 연동 및 로그인 관리 규정<br />
                • 예약 슬롯 등록 및 정산 대사 기준
              </p>
            </div>
            <a
              href="/terms"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/terms');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'center', gap: '6px', fontWeight: 600, cursor: 'pointer' }}
            >
              <span>서비스 이용약관 전문 열람</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Data Deletion / Account Withdrawal Section */}
        <div style={{
          padding: '14px 16px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(239, 68, 68, 0.06)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--txt)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trash2 size={15} color="var(--danger)" />
              <span>Google 연동 해제 및 데이터 영구 파기 (회원 탈퇴)</span>
            </div>
            <span style={{ fontSize: '11.5px', color: 'var(--dim)', marginTop: '2px', display: 'block' }}>
              탈퇴 시 등록된 사업장 정보 및 소셜 연동 데이터가 영구적으로 파기됩니다.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('정말로 파트너 계정을 탈퇴하고 연동된 모든 Google 데이터를 영구 삭제하시겠습니까?\n삭제 후에는 복구할 수 없습니다.')) {
                showToast('계정 탈퇴 및 데이터 영구 삭제 처리가 완료되었습니다.', 'info');
                logout();
              }
            }}
            style={{
              background: 'var(--danger)',
              border: 'none',
              color: '#fff',
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            회원 탈퇴 & 데이터 삭제
          </button>
        </div>
      </div>

      {/* 4. 마이페이지 최하단 푸터 */}
      <footer style={{
        marginTop: '36px',
        textAlign: 'center',
        fontSize: '11.5px',
        color: 'var(--dim)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
          <a 
            href="/terms" 
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/terms');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            style={{ color: 'var(--mut)', textDecoration: 'underline', cursor: 'pointer' }}
          >
            서비스 이용약관
          </a>
          <span>•</span>
          <a 
            href="/privacy" 
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/privacy');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            style={{ color: 'var(--acc)', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}
          >
            개인정보처리방침
          </a>
          <span>•</span>
          <span>고객지원: <strong>hitinent@gmail.com</strong></span>
        </div>
        <div>
          © 2026 HitInEnt. All rights reserved. | 대표 웹사이트: <a href="https://partner.hitin.kr" style={{ color: 'var(--dim)' }}>partner.hitin.kr</a>
        </div>
      </footer>
    </div>
  );
};
