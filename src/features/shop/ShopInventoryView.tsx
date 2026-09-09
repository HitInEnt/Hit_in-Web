import React, { useState, useMemo } from 'react';
import { 
  PackageCheck, 
  PlusCircle, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Minus, 
  Plus, 
  Wrench,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';
import { PartnerService } from '../../services/partnerService';
import { RentalProduct, ProductCategory, ProductStatus } from '../../types';

interface ShopInventoryViewProps {
  onOpenAddProduct: () => void;
}

export const ShopInventoryView: React.FC<ShopInventoryViewProps> = ({ onOpenAddProduct }) => {
  const { user, showToast, triggerRefresh, refreshKey } = usePartner();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const products = useMemo(() => {
    return PartnerService.getProducts(user.partnerId);
  }, [user.partnerId, refreshKey]);

  const filteredProducts = useMemo(() => {
    let list = products;
    if (categoryFilter !== 'all') {
      list = list.filter(p => p.category === categoryFilter);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.spec.toLowerCase().includes(q));
    }
    return list;
  }, [products, categoryFilter, searchTerm]);

  // Adjust stock
  const handleAdjustStock = (productId: string, delta: number) => {
    const p = products.find(item => item.id === productId);
    if (!p) return;
    const newStock = Math.max(0, p.totalStock + delta);
    PartnerService.updateProduct(productId, { totalStock: newStock });
    triggerRefresh();
    showToast(`'${p.name}' 총 재고가 ${newStock}개로 변경되었습니다.`, 'info');
  };

  const handleUpdateStatus = (productId: string, status: ProductStatus) => {
    PartnerService.updateProduct(productId, { status });
    triggerRefresh();
    showToast('상품 상태가 업데이트되었습니다.', 'success');
  };

  const totalStockCount = products.reduce((s, p) => s + p.totalStock, 0);
  const totalRentedCount = products.reduce((s, p) => s + p.rentedCount, 0);

  return (
    <div className="page-scrollable">
      {/* Top Header Card */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        background: 'var(--card)',
        padding: '20px 24px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--line)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-lime">건샵 렌탈 허브</span>
            <span style={{ fontSize: '13px', color: 'var(--mut)' }}>{user.businessName}</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--txt)', marginTop: '4px' }}>
            렌탈 총기 & 소모품 실시간 재고 관리
          </h2>
        </div>

        <button className="btn btn-primary" onClick={onOpenAddProduct}>
          <PlusCircle size={16} />
          신규 상품 등록
        </button>
      </div>

      {/* 3 Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card-panel">
          <div style={{ fontSize: '12.5px', color: 'var(--mut)', fontWeight: 600 }}>총 등록 품목</div>
          <div className="mono-font" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--txt)', marginTop: '6px' }}>
            {products.length}종
          </div>
        </div>

        <div className="card-panel card-panel-accent">
          <div style={{ fontSize: '12.5px', color: 'var(--mut)', fontWeight: 600 }}>현재 현장 렌탈 대여 중</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
            <span className="mono-font" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--acc)' }}>
              {totalRentedCount}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--mut)' }}>/ {totalStockCount}개 ({totalStockCount > 0 ? Math.round((totalRentedCount / totalStockCount) * 100) : 0}%)</span>
          </div>
        </div>

        <div className="card-panel">
          <div style={{ fontSize: '12.5px', color: 'var(--mut)', fontWeight: 600 }}>렌탈 연계 제휴 필드</div>
          <div className="mono-font" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--green)', marginTop: '6px' }}>
            2개 구장
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: 'var(--panel)',
        padding: '12px 18px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--line)'
      }}>
        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: '전체' },
            { id: 'gbbr', label: 'GBBR' },
            { id: 'aeg', label: 'AEG' },
            { id: 'protection', label: '보호구' },
            { id: 'ammo_gas', label: 'BB탄/가스' },
            { id: 'gear', label: '전술장비' }
          ].map(c => (
            <button
              key={c.id}
              className={`btn btn-sm ${categoryFilter === c.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCategoryFilter(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '220px' }}>
          <Search size={14} color="var(--dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ width: '100%', paddingLeft: '32px', fontSize: '12px' }}
            placeholder="상품명, 스펙 검색..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Product Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {filteredProducts.map(p => {
          const isRentedOut = p.rentedCount >= p.totalStock || p.status === 'rented_out';
          const isMaintenance = p.status === 'maintenance';

          return (
            <div
              key={p.id}
              className="card-panel"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}
            >
              <div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'cover',
                      border: '1px solid var(--line)',
                      flexShrink: 0
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span className="badge badge-outline" style={{ fontSize: '10px' }}>
                        {p.category.toUpperCase()}
                      </span>
                      <select
                        value={p.status}
                        onChange={e => handleUpdateStatus(p.id, e.target.value as ProductStatus)}
                        className="form-select"
                        style={{ padding: '2px 6px', fontSize: '11px', height: '24px' }}
                      >
                        <option value="available">대여 가능</option>
                        <option value="rented_out">전량 대여중</option>
                        <option value="maintenance">정비/점검중</option>
                        <option value="out_of_stock">품절</option>
                      </select>
                    </div>

                    <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--txt)', marginTop: '4px' }}>
                      {p.name}
                    </h4>
                    <p style={{ fontSize: '11.5px', color: 'var(--mut)', marginTop: '2px', lineHeight: 1.3 }}>
                      {p.spec}
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--panel)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  marginTop: '12px'
                }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--mut)' }}>1회 렌탈비: </span>
                    <span className="mono-font" style={{ fontSize: '15px', fontWeight: 800, color: 'var(--acc)' }}>
                      {p.rentalPrice.toLocaleString()}원
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '11px', color: 'var(--mut)' }}>대여 현황: </span>
                    <span className="mono-font" style={{ fontWeight: 800, color: isRentedOut ? 'var(--danger)' : 'var(--green)' }}>
                      {p.rentedCount} / {p.totalStock}개
                    </span>
                  </div>
                </div>
              </div>

              {/* Stock Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: '10px' }}>
                <span style={{ fontSize: '12px', color: 'var(--mut)', fontWeight: 600 }}>총 보유 수량 조절</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '4px 8px' }}
                    onClick={() => handleAdjustStock(p.id, -1)}
                  >
                    <Minus size={13} />
                  </button>
                  <span className="mono-font" style={{ fontSize: '14px', fontWeight: 800, minWidth: '32px', textAlign: 'center' }}>
                    {p.totalStock}
                  </span>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '4px 8px' }}
                    onClick={() => handleAdjustStock(p.id, 1)}
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
