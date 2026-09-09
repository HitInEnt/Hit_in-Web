import React, { useState, useMemo } from 'react';
import { 
  Users2, 
  Building2, 
  ShoppingBag, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Percent, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';
import { PartnerService } from '../../services/partnerService';
import { ClientPartner, ClientStatus } from '../../types';

export const HqClientsView: React.FC = () => {
  const { showToast, triggerRefresh, refreshKey } = usePartner();

  const [typeFilter, setTypeFilter] = useState<'all' | 'field' | 'shop' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientPartner | null>(null);

  const clients = useMemo(() => {
    return PartnerService.getClients();
  }, [refreshKey]);

  const filteredClients = useMemo(() => {
    let list = clients;
    if (typeFilter === 'field') list = list.filter(c => c.type === 'field');
    if (typeFilter === 'shop') list = list.filter(c => c.type === 'shop');
    if (typeFilter === 'pending') list = list.filter(c => c.status === 'pending_approval');

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.representative.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
      );
    }
    return list;
  }, [clients, typeFilter, searchTerm]);

  const handleApprove = (client: ClientPartner) => {
    PartnerService.updateClientStatus(client.id, 'active');
    triggerRefresh();
    showToast(`'${client.name}' 고객사의 입점 승인이 완료되었습니다.`, 'success');
  };

  const handleSuspend = (client: ClientPartner) => {
    if (window.confirm(`'${client.name}' 파트너사의 서비스를 일시 정지(계약 보류) 처리하시겠습니까?`)) {
      PartnerService.updateClientStatus(client.id, 'suspended');
      triggerRefresh();
      showToast(`'${client.name}' 파트너사가 일시 정지 처리되었습니다.`, 'warning');
    }
  };

  const handleUpdateCommission = (clientId: string, rate: number) => {
    PartnerService.updateClientStatus(clientId, 'active', rate);
    triggerRefresh();
    showToast(`수수료율이 ${(rate * 100).toFixed(1)}%로 변경되었습니다.`, 'success');
  };

  const pendingCount = clients.filter(c => c.status === 'pending_approval').length;
  const activeCount = clients.filter(c => c.status === 'active').length;
  const totalGmv = clients.reduce((s, c) => s + c.totalRevenue, 0);

  return (
    <div className="page-scrollable">
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        background: 'linear-gradient(135deg, var(--card) 0%, var(--card2) 100%)',
        padding: '20px 24px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--line)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-lime">HQ SUPER ADMIN CRM</span>
            <span style={{ fontSize: '13px', color: 'var(--mut)' }}>전국 에어소프트 파트너사 종합 관리</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--txt)', marginTop: '4px' }}>
            입점 고객사(필드 / 건샵) 계약 및 심사 관리
          </h2>
        </div>

        {pendingCount > 0 && (
          <div style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 197, 61, 0.15)',
            border: '1px solid rgba(255, 197, 61, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: 'var(--warn)',
            fontWeight: 700
          }}>
            <Sparkles size={16} />
            신규 입점 심사 대기 {pendingCount}건
          </div>
        )}
      </div>

      {/* 3 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="card-panel">
          <div style={{ fontSize: '12.5px', color: 'var(--mut)', fontWeight: 600 }}>총 입점 파트너사</div>
          <div className="mono-font" style={{ fontSize: '26px', fontWeight: 900, color: 'var(--txt)', marginTop: '6px' }}>
            {clients.length} <span style={{ fontSize: '14px', color: 'var(--mut)' }}>개사 (활성 {activeCount}개)</span>
          </div>
        </div>

        <div className="card-panel card-panel-accent">
          <div style={{ fontSize: '12.5px', color: 'var(--mut)', fontWeight: 600 }}>플랫폼 누적 중개 거래액 (GMV)</div>
          <div className="mono-font" style={{ fontSize: '26px', fontWeight: 900, color: 'var(--acc)', marginTop: '6px' }}>
            {(totalGmv / 100000000).toFixed(2)} <span style={{ fontSize: '14px', color: 'var(--mut)' }}>억원</span>
          </div>
        </div>

        <div className="card-panel">
          <div style={{ fontSize: '12.5px', color: 'var(--mut)', fontWeight: 600 }}>평균 고객사 평점</div>
          <div className="mono-font" style={{ fontSize: '26px', fontWeight: 900, color: 'var(--lime-text)', marginTop: '6px' }}>
            ★ 4.84 <span style={{ fontSize: '14px', color: 'var(--mut)' }}>/ 5.0</span>
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
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'all', label: '전체 고객사' },
            { id: 'field', label: '필드 파트너' },
            { id: 'shop', label: '건샵 파트너' },
            { id: 'pending', label: `심사 대기 (${pendingCount})` }
          ].map(tab => (
            <button
              key={tab.id}
              className={`btn btn-sm ${typeFilter === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTypeFilter(tab.id as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '240px' }}>
          <Search size={14} color="var(--dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ width: '100%', paddingLeft: '32px', fontSize: '12px' }}
            placeholder="고객사명, 대표자, 지역..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="table-container">
          <table className="tactical-table">
            <thead>
              <tr>
                <th>고객사(파트너)명</th>
                <th>구분</th>
                <th>대표자 / 연락처</th>
                <th>지역</th>
                <th>수수료율</th>
                <th>월간 매출액</th>
                <th>상태</th>
                <th>관리 작업</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(c => {
                const isActive = c.status === 'active';
                const isPending = c.status === 'pending_approval';

                return (
                  <tr key={c.id}>
                    <td>
                      <div>
                        <span style={{ fontWeight: 800, color: 'var(--txt)' }}>{c.name}</span>
                        <div style={{ fontSize: '11px', color: 'var(--mut)', marginTop: '2px' }}>
                          계약일: {c.contractDate} · 평점 ★ {c.rating > 0 ? c.rating.toFixed(1) : '신규'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-outline" style={{ fontSize: '11px' }}>
                        {c.type === 'field' ? '🏟️ 필드' : '🔫 건샵'}
                      </span>
                    </td>
                    <td>
                      <div>
                        <span style={{ fontWeight: 600 }}>{c.representative}</span>
                        <div className="mono-font" style={{ fontSize: '11px', color: 'var(--dim)' }}>{c.phone}</div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px' }}>{c.region}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <select
                          className="form-select"
                          value={c.commissionRate}
                          onChange={e => handleUpdateCommission(c.id, Number(e.target.value))}
                          style={{ padding: '2px 6px', fontSize: '11px', height: '26px' }}
                        >
                          <option value={0.05}>5.0% (우대)</option>
                          <option value={0.08}>8.0% (표준)</option>
                          <option value={0.10}>10.0% (프리미엄)</option>
                        </select>
                      </div>
                    </td>
                    <td>
                      <span className="mono-font" style={{ fontWeight: 700 }}>
                        {c.monthlyRevenue > 0 ? `${(c.monthlyRevenue / 10000).toFixed(0)}만원` : '-'}
                      </span>
                    </td>
                    <td>
                      {isActive ? (
                        <span className="badge badge-success">정상 운영</span>
                      ) : isPending ? (
                        <span className="badge badge-warning">심사 대기</span>
                      ) : (
                        <span className="badge badge-danger">정지됨</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {isPending && (
                          <button
                            className="btn btn-lime btn-sm"
                            style={{ padding: '4px 10px', fontSize: '11px' }}
                            onClick={() => handleApprove(c)}
                          >
                            <CheckCircle2 size={12} /> 승인
                          </button>
                        )}
                        {isActive && (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--danger)' }}
                            onClick={() => handleSuspend(c)}
                          >
                            정지
                          </button>
                        )}
                        {c.status === 'suspended' && (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            onClick={() => handleApprove(c)}
                          >
                            재개
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
