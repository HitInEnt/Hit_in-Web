import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Gauge, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Save, 
  Check, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';
import { PartnerService } from '../../services/partnerService';
import { FieldInfo } from '../../types';

export const FieldManageView: React.FC = () => {
  const { user, showToast, triggerRefresh, refreshKey } = usePartner();

  const [field, setField] = useState<FieldInfo | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [tel, setTel] = useState('');
  const [capacity, setCapacity] = useState(60);
  const [surfaceType, setSurfaceType] = useState('');
  const [maxFps, setMaxFps] = useState(350);
  const [rules, setRules] = useState<string[]>([]);
  const [newRule, setNewRule] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
  const [coverImage, setCoverImage] = useState('');

  useEffect(() => {
    const fields = PartnerService.getFields();
    const f = fields.find(item => item.id === user.partnerId) || fields[0];
    if (f) {
      setField(f);
      setName(f.name);
      setAddress(f.address);
      setTel(f.tel);
      setCapacity(f.capacity);
      setSurfaceType(f.surfaceType);
      setMaxFps(f.maxFps);
      setRules(f.rules || []);
      setAmenities(f.amenities || []);
      setCoverImage(f.coverImage);
    }
  }, [user.partnerId, user.businessName, refreshKey]);


  if (!field) return null;

  const handleAddRule = () => {
    if (!newRule.trim()) return;
    setRules([...rules, newRule.trim()]);
    setNewRule('');
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleAddAmenity = () => {
    if (!newAmenity.trim()) return;
    setAmenities([...amenities, newAmenity.trim()]);
    setNewAmenity('');
  };

  const handleRemoveAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    PartnerService.updateField(field.id, {
      name,
      address,
      tel,
      capacity: Number(capacity),
      surfaceType,
      maxFps: Number(maxFps),
      rules,
      amenities,
      coverImage
    });
    triggerRefresh();
    showToast('필드 시설 및 경기 규정이 성공적으로 저장되었습니다.', 'success');
  };

  return (
    <div className="page-scrollable">
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Top Header Card with Save Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--card)',
          padding: '20px 24px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--line)'
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--txt)' }}>
              경기장 시설 및 안전 규정 관리
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--mut)', marginTop: '4px' }}>
              HIT IN B2C 플레이어 앱에 공개되는 구장 소개, 탄속 규정, 편의시설 및 제휴 건샵 정보입니다.
            </p>
          </div>

          <button type="submit" className="btn btn-primary">
            <Save size={16} />
            변경사항 저장하기
          </button>
        </div>

        {/* 2 Column Layout */}
        <div className="grid-responsive-2col">
          {/* Left Column: Basic Info & Safety Regulations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card-panel">
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--txt)', marginBottom: '16px' }}>
                기본 구장 정보
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">필드 명칭 *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">도로명 주소 *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="grid-responsive-form">
                  <div className="form-group">
                    <label className="form-label">대표 전화번호</label>
                    <input
                      type="text"
                      className="form-input"
                      value={tel}
                      onChange={e => setTel(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">최대 동시 수용 정원 (명)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={capacity}
                      onChange={e => setCapacity(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">필드 지형 및 구조</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="예: CQB 실내 3층 + 1200평 야외 산악 복합"
                    value={surfaceType}
                    onChange={e => setSurfaceType(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">대표 커버 이미지 URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={coverImage}
                    onChange={e => setCoverImage(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Tactical FPS & Chrono Safety Rules */}
            <div className="card-panel">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Gauge size={18} color="var(--acc)" />
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--txt)' }}>
                  크로노그래프 탄속(FPS) 및 안전 규정
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">0.2g BB탄 기준 최대 허용 FPS</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="number"
                      className="form-input"
                      style={{ width: '140px' }}
                      min={200}
                      max={450}
                      value={maxFps}
                      onChange={e => setMaxFps(Number(e.target.value))}
                    />
                    <span style={{ fontSize: '13px', color: 'var(--mut)' }}>
                      FPS (초과 시 현장 입장 불가 및 영구 밴 안내)
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">필드 필수 안전 규칙 목록</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {rules.map((rule, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          background: 'var(--panel)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--line)',
                          fontSize: '13px'
                        }}
                      >
                        <span>• {rule}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRule(idx)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <input
                      type="text"
                      className="form-input"
                      style={{ flex: 1 }}
                      placeholder="신규 안전 규칙 입력..."
                      value={newRule}
                      onChange={e => setNewRule(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddRule();
                        }
                      }}
                    />
                    <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddRule}>
                      <Plus size={14} /> 추가
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Amenities, Linked Shops & Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Amenities Tag Editor */}
            <div className="card-panel">
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--txt)', marginBottom: '14px' }}>
                구장 편의시설 태그
              </h3>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                {amenities.map((item, idx) => (
                  <span
                    key={idx}
                    className="badge badge-lime"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(idx)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--ink-fixed)', cursor: 'pointer', marginLeft: '4px' }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ flex: 1 }}
                  placeholder="예: 무료 HPA 충전, 샤워실..."
                  value={newAmenity}
                  onChange={e => setNewAmenity(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddAmenity();
                    }
                  }}
                />
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddAmenity}>
                  <Plus size={14} /> 태그 추가
                </button>
              </div>
            </div>

            {/* Linked Gunshops */}
            <div className="card-panel">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <ShoppingBag size={18} color="var(--acc)" />
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--txt)' }}>
                  연계 제휴 건샵 (렌탈 배송 지원)
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {field.linkedShopNames.map((sName, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      background: 'var(--panel)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--line)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--txt)' }}>
                        {sName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--mut)', marginTop: '2px' }}>
                        HIT IN 직영 렌탈 장비 현장 사전 배치 완료
                      </div>
                    </div>
                    <span className="badge badge-success" style={{ fontSize: '10px' }}>
                      연동 활성
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="card-panel" style={{ padding: '0', overflow: 'hidden' }}>
              <img
                src={coverImage}
                alt={name}
                style={{ width: '100%', height: '160px', objectFit: 'cover' }}
              />
              <div style={{ padding: '16px' }}>
                <span className="badge badge-lime" style={{ fontSize: '10px', marginBottom: '6px' }}>
                  B2C 앱 노출 미리보기
                </span>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--txt)' }}>
                  {name}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--mut)', marginTop: '4px' }}>
                  {address}
                </p>
                <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                  <span className="badge badge-outline" style={{ fontSize: '10px' }}>
                    ⚡ 최대 {maxFps} FPS
                  </span>
                  <span className="badge badge-outline" style={{ fontSize: '10px' }}>
                    👥 정원 {capacity}명
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
