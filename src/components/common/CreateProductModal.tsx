import React, { useState } from 'react';
import { X, PackagePlus, Plus } from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';
import { PartnerService } from '../../services/partnerService';
import { ProductCategory } from '../../types';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'gbbr', label: 'GBBR (가스 블로우백 라이플)' },
  { value: 'aeg', label: 'AEG (전동건 라이플/SMG)' },
  { value: 'sniper', label: '스나이퍼 / DMR' },
  { value: 'protection', label: '보호구 (마스크, 고글, 헬멧)' },
  { value: 'ammo_gas', label: '소모품 (바이오 BB탄, 가스, 배터리)' },
  { value: 'gear', label: '전술 장비 (체스트리그, 탄창, 벨트)' }
];

export const CreateProductModal: React.FC<CreateProductModalProps> = ({ isOpen, onClose }) => {
  const { user, showToast, triggerRefresh } = usePartner();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('gbbr');
  const [totalStock, setTotalStock] = useState(10);
  const [rentalPrice, setRentalPrice] = useState(25000);
  const [spec, setSpec] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('상품명을 입력해주세요.', 'warning');
      return;
    }

    PartnerService.addProduct({
      shopId: user.partnerId,
      name,
      category,
      totalStock: Number(totalStock),
      rentedCount: 0,
      rentalPrice: Number(rentalPrice),
      status: 'available',
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=600&auto=format&fit=crop&q=80',
      spec: spec.trim() || 'HIT IN 공식 인증 건샵 렌탈 상품',
      targetFields: ['fld_01', 'fld_02']
    });

    triggerRefresh();
    showToast(`'${name}' 상품이 등록되었습니다.`, 'success');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PackagePlus size={18} color="var(--acc)" />
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--txt)' }}>
              신규 렌탈 장비 / 소모품 등록
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--mut)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">상품 / 총기 모델명 *</label>
              <input
                type="text"
                className="form-input"
                placeholder="예: 마루이 Mk18 Mod1 GBBR 세트"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">카테고리</label>
              <select
                className="form-select"
                value={category}
                onChange={e => setCategory(e.target.value as ProductCategory)}
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">보유 총 수량 (개)</label>
                <input
                  type="number"
                  className="form-input"
                  min={1}
                  max={500}
                  value={totalStock}
                  onChange={e => setTotalStock(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">회당 렌탈/판매 단가 (원)</label>
                <input
                  type="number"
                  className="form-input"
                  step={1000}
                  min={0}
                  value={rentalPrice}
                  onChange={e => setRentalPrice(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">스펙 및 구성품 설명</label>
              <input
                type="text"
                className="form-input"
                placeholder="예: 가스식 블로우백, 탄창 2개, 0.2g BB탄 1봉 제공"
                value={spec}
                onChange={e => setSpec(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">이미지 URL (선택)</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              <Plus size={15} />
              상품 등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
