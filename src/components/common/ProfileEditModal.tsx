import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  FileText, 
  Camera, 
  Check, 
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  RotateCcw
} from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CUTE_CHARACTER_AVATARS = [
  {
    name: '택티컬 곰돌이',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=TeddyCommander&backgroundColor=ffdfbf',
    emoji: '🐻'
  },
  {
    name: '특임대 토끼',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=BunnyLeader&backgroundColor=ffd5dc',
    emoji: '🐰'
  },
  {
    name: '스나이퍼 냥이',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=CatSniper&backgroundColor=c0aede',
    emoji: '🐱'
  },
  {
    name: '정찰견 시바',
    url: 'https://api.dicebear.com/7.x/thumbs/svg?seed=ShibaGunner&backgroundColor=ffdfbf',
    emoji: '🐶'
  },
  {
    name: '밀리터리 여우',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=FoxAgent&backgroundColor=b6e3f4',
    emoji: '🦊'
  },
  {
    name: '아머드 판다',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=PandaArmor&backgroundColor=d1d4f9',
    emoji: '🐼'
  },
  {
    name: '특수작전 펭귄',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=PenguinSpecOps&backgroundColor=b6e3f4',
    emoji: '🐧'
  },
  {
    name: '캡틴 라이온',
    url: 'https://api.dicebear.com/7.x/thumbs/svg?seed=LionCaptain&backgroundColor=ffd5dc',
    emoji: '🦁'
  },
  {
    name: '치킨 코만도',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=TacticalDuck&backgroundColor=ffdfbf',
    emoji: '🐥'
  }
];

export const PRESET_AVATARS = CUTE_CHARACTER_AVATARS.map(c => c.url);

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose }) => {
  const { user, role, updateProfile, showToast } = usePartner();

  const [name, setName] = useState(user.name);
  const [businessName, setBusinessName] = useState(user.businessName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [businessNumber, setBusinessNumber] = useState(user.businessNumber || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || PRESET_AVATARS[0]);
  const [customAvatarInput, setCustomAvatarInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customMode, setCustomMode] = useState<'upload' | 'url'>('upload');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setBusinessName(user.businessName);
      setEmail(user.email);
      setPhone(user.phone || '');
      setBusinessNumber(user.businessNumber || '');
      setAvatarUrl(user.avatarUrl || PRESET_AVATARS[0]);
      setShowCustomInput(false);
      setCustomAvatarInput('');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('대표자명을 입력해주세요.', 'error');
      return;
    }
    if (!businessName.trim()) {
      showToast('사업장(파트너사)명을 입력해주세요.', 'error');
      return;
    }

    updateProfile({
      name: name.trim(),
      businessName: businessName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      businessNumber: businessNumber.trim(),
      avatarUrl
    });

    showToast('프로필 정보가 성공적으로 변경되었습니다.', 'success');
    onClose();
  };

  const handleApplyCustomAvatar = () => {
    if (customAvatarInput.trim()) {
      setAvatarUrl(customAvatarInput.trim());
      setShowCustomInput(false);
      setCustomAvatarInput('');
      showToast('프로필 사진 URL이 적용되었습니다.', 'info');
    }
  };

  // Direct file upload handler with canvas image compression
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('이미지 파일(JPG, PNG, GIF, WEBP 등)만 업로드할 수 있습니다.', 'warning');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showToast('파일 용량은 최대 15MB 이하만 업로드 가능합니다.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      
      // Compress & optimize image for localStorage performance
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 400; // 400x400 px is optimal for avatar
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
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setAvatarUrl(compressedDataUrl);
          showToast('📷 본인 사진이 성공적으로 업로드되었습니다!', 'success');
        } else {
          setAvatarUrl(rawDataUrl);
          showToast('📷 본인 사진이 성공적으로 업로드되었습니다!', 'success');
        }
      };
      img.onerror = () => {
        setAvatarUrl(rawDataUrl);
        showToast('📷 본인 사진이 성공적으로 업로드되었습니다!', 'success');
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);

    // Reset input value so same file can be re-selected if desired
    e.target.value = '';
  };

  const isPresetSelected = PRESET_AVATARS.includes(avatarUrl);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '560px',
        backgroundColor: 'var(--card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--line)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />

        {/* Modal Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--panel)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--acc) 0%, var(--accd) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <User size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--txt)', margin: 0 }}>
                파트너 프로필 설정
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--mut)' }}>
                본인 사진 업로드, 귀여운 캐릭터 아바타 및 관리자 계정 정보 수정
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--mut)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '82vh', overflowY: 'auto' }}>
          
          {/* Avatar Section */}
          <div style={{
            background: 'var(--panel)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                프로필 사진 / 아바타 선택
              </label>
              {!isPresetSelected ? (
                <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={12} /> 본인 사진 직접 등록됨
                </span>
              ) : (
                <span style={{ fontSize: '11px', color: 'var(--acc)', fontWeight: '600' }}>
                  ✨ 9종 캐릭터 & 사진 업로드
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Avatar Preview & Clickable Upload Trigger */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                title="클릭하여 내 기기에서 본인 사진 업로드"
                style={{ 
                  position: 'relative', 
                  width: '72px', 
                  height: '72px', 
                  flexShrink: 0,
                  cursor: 'pointer'
                }}
              >
                <img
                  src={avatarUrl}
                  alt="Profile Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '3px solid var(--acc)',
                    boxShadow: '0 4px 12px rgba(255, 90, 31, 0.25)',
                    transition: 'transform 0.15s ease'
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = PRESET_AVATARS[0];
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--acc)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  border: '2px solid var(--card)'
                }}>
                  <Camera size={13} />
                </div>
              </div>

              {/* Character grid & Upload buttons */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                  {CUTE_CHARACTER_AVATARS.map((char, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAvatarUrl(char.url);
                        setShowCustomInput(false);
                      }}
                      title={char.name}
                      style={{
                        padding: '4px',
                        borderRadius: 'var(--radius-md)',
                        border: avatarUrl === char.url ? '2px solid var(--acc)' : '1px solid var(--line)',
                        background: avatarUrl === char.url ? 'rgba(255, 90, 31, 0.15)' : 'var(--card2)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                        transform: avatarUrl === char.url ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <img 
                        src={char.url} 
                        alt={char.name} 
                        style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                      <span style={{ fontSize: '9px', color: avatarUrl === char.url ? 'var(--acc)' : 'var(--mut)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '42px' }}>
                        {char.emoji}
                      </span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(!showCustomInput)}
                    className="btn btn-secondary btn-sm"
                    style={{ 
                      padding: '0 4px', 
                      fontSize: '10px', 
                      height: '46px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      borderColor: showCustomInput || !isPresetSelected ? 'var(--acc)' : 'var(--line)',
                      background: showCustomInput || !isPresetSelected ? 'rgba(255, 90, 31, 0.12)' : undefined
                    }}
                    title="본인 사진 직접 업로드 / URL 입력"
                  >
                    <Upload size={13} color={showCustomInput || !isPresetSelected ? 'var(--acc)' : 'currentColor'} />
                    <span style={{ fontWeight: showCustomInput || !isPresetSelected ? '700' : '500' }}>직접입력</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Avatar Upload / URL Box */}
            {showCustomInput && (
              <div style={{ 
                marginTop: '6px',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--card)',
                border: '1px solid var(--line)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                {/* Tabs: File Upload vs URL */}
                <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setCustomMode('upload')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      background: customMode === 'upload' ? 'var(--acc)' : 'transparent',
                      color: customMode === 'upload' ? '#fff' : 'var(--mut)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Upload size={12} />
                    내 사진 파일 업로드
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomMode('url')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      background: customMode === 'url' ? 'var(--acc)' : 'transparent',
                      color: customMode === 'url' ? '#fff' : 'var(--mut)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <LinkIcon size={12} />
                    웹 이미지 URL 입력
                  </button>
                </div>

                {/* Tab 1: File Upload */}
                {customMode === 'upload' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: '2px dashed var(--acc)',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: 'rgba(255, 90, 31, 0.05)',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255, 90, 31, 0.1)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255, 90, 31, 0.05)')}
                    >
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'rgba(255, 90, 31, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--acc)'
                        }}>
                          <Upload size={18} />
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--txt)' }}>
                        클릭하여 본인 사진 파일 선택
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--mut)', marginTop: '2px' }}>
                        JPG, PNG, GIF, WEBP 지원 (자동 리사이징 최적화)
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Tab 2: URL Input */
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="이미지 웹 주소 입력 (https://...)"
                      style={{ flex: 1, fontSize: '12px' }}
                      value={customAvatarInput}
                      onChange={e => setCustomAvatarInput(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomAvatar}
                      className="btn btn-primary btn-sm"
                    >
                      적용
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">
                대표자명 (관리자 이름) <span style={{ color: 'var(--acc)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '38px' }}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="예: 김태식 대표"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                사업장 (파트너사 상호명) <span style={{ color: 'var(--acc)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Building2 size={16} color="var(--dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '38px' }}
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  placeholder="예: 플래툰 아레나 경기 광주점"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">이메일 주소</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="var(--dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '38px' }}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="example@hit-in.app"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">대표 연락처</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="var(--dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="tel"
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '38px' }}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">사업자 등록번호</label>
              <div style={{ position: 'relative' }}>
                <FileText size={16} color="var(--dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '38px' }}
                  value={businessNumber}
                  onChange={e => setBusinessNumber(e.target.value)}
                  placeholder="124-86-90123"
                />
              </div>
            </div>

            {/* Current Role Badge Info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--panel)',
              border: '1px solid var(--line)',
              fontSize: '12.5px'
            }}>
              <span style={{ color: 'var(--mut)' }}>현재 권한 모드</span>
              <span className={`badge ${role === 'field_owner' ? 'badge-orange' : role === 'shop_owner' ? 'badge-cyan' : 'badge-lime'}`}>
                {role === 'field_owner' ? '경기장 필드 사장님' : role === 'shop_owner' ? '건샵/렌탈 사장님' : '본사 운영 CRM'}
              </span>
            </div>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <Check size={16} />
              <span>프로필 변경 완료</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
