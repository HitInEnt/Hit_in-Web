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
  Sparkles,
  Edit,
  Plus,
  Trash2,
  Phone,
  Mail,
  MapPin,
  FileText,
  Clock,
  Layers,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';
import { PartnerService } from '../../services/partnerService';
import { formatPhoneNumber, formatBusinessNumber } from '../../utils/formatters';
import { ClientPartner, ClientStatus } from '../../types';

export const HqClientsView: React.FC = () => {
  const { showToast, triggerRefresh, refreshKey } = usePartner();

  const [typeFilter, setTypeFilter] = useState<'all' | 'field' | 'shop' | 'pending' | 'suspended'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientPartner | null>(null);

  // Edit / Add Form State
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<'field' | 'shop' | 'hq'>('field');
  const [formRepresentative, setFormRepresentative] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formBusinessNumber, setFormBusinessNumber] = useState('');
  const [formRegion, setFormRegion] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formStatus, setFormStatus] = useState<ClientStatus>('active');
  const [formCommissionRate, setFormCommissionRate] = useState<number>(0.08);
  const [formNotes, setFormNotes] = useState('');

  const clients = useMemo(() => {
    return PartnerService.getClients();
  }, [refreshKey]);

  const filteredClients = useMemo(() => {
    let list = clients;
    if (typeFilter === 'field') list = list.filter(c => c.type === 'field' || (c.roles && c.roles.includes('field_owner')));
    if (typeFilter === 'shop') list = list.filter(c => c.type === 'shop' || (c.roles && c.roles.includes('shop_owner')));
    if (typeFilter === 'pending') list = list.filter(c => c.status === 'pending_approval');
    if (typeFilter === 'suspended') list = list.filter(c => c.status === 'suspended');

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.representative.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.phone && c.phone.includes(q)) ||
        (c.businessNumber && c.businessNumber.includes(q)) ||
        (c.region && c.region.toLowerCase().includes(q))
      );
    }
    return list;
  }, [clients, typeFilter, searchTerm]);

  // Open Edit Modal
  const handleOpenEdit = (client: ClientPartner) => {
    setSelectedClient(client);
    setFormName(client.name);
    setFormType(client.type);
    setFormRepresentative(client.representative);
    setFormPhone(client.phone || '');
    setFormEmail(client.email || '');
    setFormBusinessNumber(client.businessNumber || '');
    setFormRegion(client.region || '');
    setFormAddress(client.address || '');
    setFormStatus(client.status);
    setFormCommissionRate(client.commissionRate ?? 0.08);
    setFormNotes(client.notes || '');
    setIsEditModalOpen(true);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setSelectedClient(null);
    setFormName('');
    setFormType('field');
    setFormRepresentative('');
    setFormPhone('');
    setFormEmail('');
    setFormBusinessNumber('');
    setFormRegion('서울/경기');
    setFormAddress('');
    setFormStatus('active');
    setFormCommissionRate(0.08);
    setFormNotes('');
    setIsAddModalOpen(true);
  };

  // Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    if (!formName.trim()) {
      showToast('업체 상호명을 입력해주세요.', 'warning');
      return;
    }
    if (!formRepresentative.trim()) {
      showToast('대표자명을 입력해주세요.', 'warning');
      return;
    }

    PartnerService.updateClient(selectedClient.id, {
      name: formName.trim(),
      type: formType,
      representative: formRepresentative.trim(),
      phone: formPhone.trim(),
      email: formEmail.trim(),
      businessNumber: formBusinessNumber.trim(),
      region: formRegion.trim(),
      address: formAddress.trim(),
      status: formStatus,
      commissionRate: formCommissionRate,
      notes: formNotes.trim()
    });

    setIsEditModalOpen(false);
    triggerRefresh();
    showToast(`'${formName}' 파트너 회원 정보가 성공적으로 수정되었습니다.`, 'success');
  };

  // Save New Client
  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      showToast('업체 상호명을 입력해주세요.', 'warning');
      return;
    }
    if (!formRepresentative.trim()) {
      showToast('대표자명을 입력해주세요.', 'warning');
      return;
    }

    PartnerService.addClient({
      name: formName.trim(),
      type: formType,
      representative: formRepresentative.trim(),
      phone: formPhone.trim(),
      email: formEmail.trim() || `partner_${Date.now().toString().slice(-4)}@hitin.kr`,
      businessNumber: formBusinessNumber.trim(),
      region: formRegion.trim() || '수도권',
      address: formAddress.trim(),
      status: formStatus,
      commissionRate: formCommissionRate,
      notes: formNotes.trim()
    });

    setIsAddModalOpen(false);
    triggerRefresh();
    showToast(`'${formName}' 신규 파트너 업체가 등록되었습니다.`, 'success');
  };

  // Quick Status Actions
  const handleSetPending = (client: ClientPartner) => {
    PartnerService.updateClientStatus(client.id, 'pending_approval');
    triggerRefresh();
    showToast(`'${client.name}' 파트너사가 심사 대기 상태로 변경되었습니다.`, 'info');
  };

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

  const handleDelete = (client: ClientPartner) => {
    if (window.confirm(`정말로 '${client.name}' 파트너 회원 정보를 목록에서 삭제하시겠습니까?`)) {
      PartnerService.deleteClient(client.id);
      triggerRefresh();
      showToast(`'${client.name}' 파트너 정보가 삭제되었습니다.`, 'info');
    }
  };

  const pendingCount = clients.filter(c => c.status === 'pending_approval').length;
  const activeCount = clients.filter(c => c.status === 'active').length;
  const suspendedCount = clients.filter(c => c.status === 'suspended').length;
  const fieldCount = clients.filter(c => c.type === 'field').length;
  const shopCount = clients.filter(c => c.type === 'shop').length;

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
            <span className="badge badge-lime" style={{ fontWeight: 800 }}>HQ SUPER ADMIN</span>
            <span style={{ fontSize: '13px', color: 'var(--mut)' }}>전국 제휴 가맹 파트너 심사 및 통합 관리</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--txt)', marginTop: '4px' }}>
            제휴 파트너사(필드 / 건샵) 회원 정보 및 계약 관리
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            className="btn btn-primary"
            onClick={handleOpenAdd}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
          >
            <Plus size={16} />
            신규 파트너 업체 등록
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div className="card-panel">
          <div style={{ fontSize: '12px', color: 'var(--mut)', fontWeight: 600 }}>총 등록 파트너 업체</div>
          <div className="mono-font" style={{ fontSize: '24px', fontWeight: 900, color: 'var(--txt)', marginTop: '4px' }}>
            {clients.length} <span style={{ fontSize: '13px', color: 'var(--mut)' }}>개사</span>
          </div>
        </div>

        <div className="card-panel">
          <div style={{ fontSize: '12px', color: 'var(--mut)', fontWeight: 600 }}>🏟️ 경기장(필드) 파트너</div>
          <div className="mono-font" style={{ fontSize: '24px', fontWeight: 900, color: 'var(--acc)', marginTop: '4px' }}>
            {fieldCount} <span style={{ fontSize: '13px', color: 'var(--mut)' }}>개소</span>
          </div>
        </div>

        <div className="card-panel">
          <div style={{ fontSize: '12px', color: 'var(--mut)', fontWeight: 600 }}>🔫 건샵/정비 파트너</div>
          <div className="mono-font" style={{ fontSize: '24px', fontWeight: 900, color: '#38bdf8', marginTop: '4px' }}>
            {shopCount} <span style={{ fontSize: '13px', color: 'var(--mut)' }}>개점</span>
          </div>
        </div>

        <div className="card-panel">
          <div style={{ fontSize: '12px', color: 'var(--mut)', fontWeight: 600 }}>정상 활성 / 심사 대기</div>
          <div className="mono-font" style={{ fontSize: '24px', fontWeight: 900, color: 'var(--lime-text)', marginTop: '4px' }}>
            {activeCount} <span style={{ fontSize: '13px', color: 'var(--mut)' }}>/ 대기 {pendingCount}</span>
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
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `전체 파트너 (${clients.length})` },
            { id: 'field', label: `🏟️ 필드 (${fieldCount})` },
            { id: 'shop', label: `🔫 건샵 (${shopCount})` },
            { id: 'pending', label: `⏳ 심사 대기 (${pendingCount})` },
            { id: 'suspended', label: `⛔ 정지 (${suspendedCount})` }
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

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={14} color="var(--dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ width: '100%', paddingLeft: '32px', fontSize: '12.5px' }}
            placeholder="상호명, 대표자, 이메일, 전화번호, 지역 검색..."
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
                <th>업체(상호)명 / ID</th>
                <th>가입분야</th>
                <th>대표자명</th>
                <th>로그인 이메일 / 연락처</th>
                <th>사업자번호</th>
                <th>지역 / 소재지</th>
                <th>수수료율</th>
                <th>상태</th>
                <th style={{ textAlign: 'right' }}>관리 및 수정</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--mut)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <Building2 size={36} color="var(--dim)" />
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>등록된 제휴 파트너 업체 회원 정보가 없습니다.</span>
                      <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
                        <Plus size={14} /> 신규 파트너 업체 등록하기
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredClients.map(c => {
                  const isActive = c.status === 'active';
                  const isPending = c.status === 'pending_approval';

                  return (
                    <tr key={c.id}>
                      {/* Business Name & ID */}
                      <td>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 800, color: 'var(--txt)', fontSize: '13.5px' }}>{c.name}</span>
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--dim)', marginTop: '2px' }}>
                            ID: <code>{c.id}</code> · 등록: {c.contractDate || '최근'}
                          </div>
                        </div>
                      </td>

                      {/* Role/Category */}
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {c.roles && c.roles.length > 0 ? (
                            c.roles.map(r => (
                              <span key={r} className="badge" style={{
                                fontSize: '10.5px',
                                background: r === 'field_owner' ? 'rgba(255, 90, 31, 0.15)' : r === 'shop_owner' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(199, 249, 78, 0.2)',
                                color: r === 'field_owner' ? 'var(--acc)' : r === 'shop_owner' ? '#38bdf8' : 'var(--lime-chip)',
                                border: `1px solid ${r === 'field_owner' ? 'rgba(255, 90, 31, 0.3)' : r === 'shop_owner' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(199, 249, 78, 0.3)'}`
                              }}>
                                {r === 'field_owner' ? '🏟️ 필드관리' : r === 'shop_owner' ? '🔫 건샵관리' : '👑 본사관리'}
                              </span>
                            ))
                          ) : (
                            <span className="badge" style={{
                              fontSize: '10.5px',
                              background: c.type === 'field' ? 'rgba(255, 90, 31, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                              color: c.type === 'field' ? 'var(--acc)' : '#38bdf8',
                              border: `1px solid ${c.type === 'field' ? 'rgba(255, 90, 31, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`
                            }}>
                              {c.type === 'field' ? '🏟️ 필드관리' : c.type === 'shop' ? '🔫 건샵관리' : '👑 본사관리'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Representative */}
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--txt)' }}>{c.representative}</span>
                      </td>

                      {/* Email & Phone */}
                      <td>
                        <div>
                          <div style={{ fontSize: '12px', color: 'var(--txt)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Mail size={12} color="var(--dim)" />
                            <span>{c.email || '-'}</span>
                          </div>
                          <div className="mono-font" style={{ fontSize: '11.5px', color: 'var(--mut)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Phone size={12} color="var(--dim)" />
                            <span>{c.phone || '-'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Business Number */}
                      <td>
                        <span className="mono-font" style={{ fontSize: '12px', color: 'var(--txt)' }}>
                          {c.businessNumber || '-'}
                        </span>
                      </td>

                      {/* Region */}
                      <td>
                        <div style={{ fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} color="var(--dim)" />
                          <span>{c.region || '미입력'}</span>
                        </div>
                      </td>

                      {/* Commission Rate */}
                      <td>
                        <span className="badge badge-outline" style={{ fontSize: '11px', fontWeight: 700 }}>
                          {((c.commissionRate ?? 0.08) * 100).toFixed(1)}%
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        {isActive ? (
                          <span className="badge badge-success">정상 운영</span>
                        ) : isPending ? (
                          <span className="badge badge-warning">심사 대기</span>
                        ) : (
                          <span className="badge badge-danger">계약 정지</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            onClick={() => handleOpenEdit(c)}
                            title="회원 및 업체 정보 수정"
                          >
                            <Edit size={12} />
                            수정
                          </button>

                          {isPending && (
                            <button
                              className="btn btn-lime btn-sm"
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                              onClick={() => handleApprove(c)}
                              title="가맹 승인"
                            >
                              <CheckCircle2 size={12} /> 승인
                            </button>
                          )}

                          {isActive && (
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--warn)' }}
                              onClick={() => handleSuspend(c)}
                              title="일시 정지"
                            >
                              정지
                            </button>
                          )}

                          {c.status === 'suspended' && (
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--green)' }}
                              onClick={() => handleApprove(c)}
                              title="운영 재개"
                            >
                              재개
                            </button>
                          )}

                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 6px', fontSize: '11px', color: 'var(--danger)' }}
                            onClick={() => handleDelete(c)}
                            title="삭제"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          EDIT PARTNER MODAL (파트너 회원 정보 수정 모달)
         ════════════════════════════════════════════════════════════ */}
      {isEditModalOpen && selectedClient && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div 
            className="modal-content" 
            style={{ maxWidth: '620px', padding: '26px' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={22} color="var(--acc)" />
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
                  파트너 업체 회원 정보 수정
                </h3>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--mut)', cursor: 'pointer', fontSize: '18px' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Row 1: 상호명 & 가입분야 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">사업장 상호명 <span style={{ color: 'var(--acc)' }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">가입 분야 <span style={{ color: 'var(--acc)' }}>*</span></label>
                  <select
                    className="form-select"
                    value={formType}
                    onChange={e => setFormType(e.target.value as any)}
                  >
                    <option value="field">🏟️ 필드관리</option>
                    <option value="shop">🔫 건샵관리</option>
                    <option value="hq">👑 본사관리</option>
                  </select>
                </div>
              </div>

              {/* Row 2: 대표자 성명 & 대표 연락처 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">대표자(담당자) 성명 <span style={{ color: 'var(--acc)' }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    value={formRepresentative}
                    onChange={e => setFormRepresentative(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">대표 연락처 (휴대폰)</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={formPhone}
                    onChange={e => setFormPhone(formatPhoneNumber(e.target.value))}
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>

              {/* Row 3: 로그인 이메일 & 사업자등록번호 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">로그인 이메일 (계정 ID)</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    placeholder="partner@arena.kr"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">사업자등록번호</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formBusinessNumber}
                    onChange={e => setFormBusinessNumber(formatBusinessNumber(e.target.value))}
                    placeholder="123-45-67890"
                  />
                </div>
              </div>

              {/* Row 4: 지역 & 상세주소 */}
              <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">소재지 (지역)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formRegion}
                    onChange={e => setFormRegion(e.target.value)}
                    placeholder="예: 경기 광주"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">상세 사업장 주소</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formAddress}
                    onChange={e => setFormAddress(e.target.value)}
                    placeholder="상세 도로명 주소 입력"
                  />
                </div>
              </div>

              {/* Row 5: 수수료율 & 운영 상태 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">플랫폼 중개 수수료율</label>
                  <select
                    className="form-select"
                    value={formCommissionRate}
                    onChange={e => setFormCommissionRate(Number(e.target.value))}
                  >
                    <option value={0.05}>5.0% (우대 제휴사)</option>
                    <option value={0.08}>8.0% (표준 수수료)</option>
                    <option value={0.10}>10.0% (일반)</option>
                    <option value={0.12}>12.0% (프리미엄)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">가맹 운영 상태</label>
                  <select
                    className="form-select"
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as any)}
                  >
                    <option value="active">✓ 정상 운영</option>
                    <option value="pending_approval">⏳ 심사 대기</option>
                    <option value="suspended">⛔ 일시 정지 (보류)</option>
                  </select>
                </div>
              </div>

              {/* Row 6: 관리자 메모 */}
              <div className="form-group">
                <label className="form-label">본사 관리자 메모 / 특이사항</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: '60px', resize: 'vertical' }}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="계약 조건, 정산 특이사항, 시설 메모 등..."
                />
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ fontWeight: 700 }}
                >
                  💾 수정 정보 저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          ADD NEW PARTNER MODAL (신규 파트너 업체 직접 등록 모달)
         ════════════════════════════════════════════════════════════ */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div 
            className="modal-content" 
            style={{ maxWidth: '620px', padding: '26px' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={22} color="var(--acc)" />
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
                  신규 제휴 파트너 업체 등록
                </h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--mut)', cursor: 'pointer', fontSize: '18px' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAdd} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Row 1: 상호명 & 가입분야 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">사업장 상호명 <span style={{ color: 'var(--acc)' }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="예: 플래툰 아레나 일산점"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">가입 분야 <span style={{ color: 'var(--acc)' }}>*</span></label>
                  <select
                    className="form-select"
                    value={formType}
                    onChange={e => setFormType(e.target.value as any)}
                  >
                    <option value="field">🏟️ 필드관리</option>
                    <option value="shop">🔫 건샵관리</option>
                  </select>
                </div>
              </div>

              {/* Row 2: 대표자 성명 & 대표 연락처 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">대표자(담당자) 성명 <span style={{ color: 'var(--acc)' }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    value={formRepresentative}
                    onChange={e => setFormRepresentative(e.target.value)}
                    placeholder="예: 홍길동 대표"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">대표 연락처 (휴대폰)</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={formPhone}
                    onChange={e => setFormPhone(formatPhoneNumber(e.target.value))}
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>

              {/* Row 3: 로그인 이메일 & 사업자등록번호 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">로그인 이메일 (계정 ID)</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    placeholder="partner@arena.kr"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">사업자등록번호</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formBusinessNumber}
                    onChange={e => setFormBusinessNumber(formatBusinessNumber(e.target.value))}
                    placeholder="123-45-67890"
                  />
                </div>
              </div>

              {/* Row 4: 지역 & 상세주소 */}
              <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">소재지 (지역)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formRegion}
                    onChange={e => setFormRegion(e.target.value)}
                    placeholder="예: 경기 고양"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">상세 사업장 주소</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formAddress}
                    onChange={e => setFormAddress(e.target.value)}
                    placeholder="상세 도로명 주소 입력"
                  />
                </div>
              </div>

              {/* Row 5: 수수료율 & 운영 상태 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">플랫폼 중개 수수료율</label>
                  <select
                    className="form-select"
                    value={formCommissionRate}
                    onChange={e => setFormCommissionRate(Number(e.target.value))}
                  >
                    <option value={0.05}>5.0% (우대 제휴사)</option>
                    <option value={0.08}>8.0% (표준 수수료)</option>
                    <option value={0.10}>10.0% (일반)</option>
                    <option value={0.12}>12.0% (프리미엄)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">초기 가맹 상태</label>
                  <select
                    className="form-select"
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as any)}
                  >
                    <option value="active">✓ 정상 운영</option>
                    <option value="pending_approval">⏳ 심사 대기</option>
                  </select>
                </div>
              </div>

              {/* Row 6: 관리자 메모 */}
              <div className="form-group">
                <label className="form-label">본사 관리자 메모</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: '60px', resize: 'vertical' }}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="특이사항, 초기 계약 조건 등..."
                />
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ fontWeight: 700 }}
                >
                  ✨ 파트너 업체 등록 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
