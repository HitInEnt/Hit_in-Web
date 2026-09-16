import React, { useMemo, useState } from 'react';
import { 
  ReceiptText, 
  DollarSign, 
  Download, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Building, 
  TrendingUp,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';
import { PartnerService } from '../../services/partnerService';
import { SettlementRecord } from '../../types';

export const SettlementView: React.FC = () => {
  const { user, role, showToast } = usePartner();
  const [selectedPeriod, setSelectedPeriod] = useState('2026-09');

  const settlements = useMemo(() => {
    return PartnerService.getSettlements(role === 'hq_admin' ? undefined : user.partnerId);
  }, [user.partnerId, role]);

  const totalGrossSales = settlements.reduce((s, item) => s + item.grossSales, 0);
  const totalPlatformFees = settlements.reduce((s, item) => s + item.platformFeeAmount, 0);
  const totalNetPayout = settlements.reduce((s, item) => s + item.netPayout, 0);

  const handleDownloadInvoice = (record: SettlementRecord) => {
    showToast(`'${record.period}' 세금계산서 및 정산 명세서 PDF가 다운로드되었습니다.`, 'success');
  };

  const handleRequestPayout = () => {
    showToast('익월 정산 계좌로 조기 정산 신청이 접수되었습니다.', 'info');
  };

  return (
    <div className="page-scrollable">
      {/* Header Banner */}
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
            <span className="badge badge-lime">정산 주기: 주 단위 (매주 금요일)</span>
            <span style={{ fontSize: '13px', color: 'var(--mut)' }}>수수료율: {role === 'shop_owner' ? '5.0%' : '8.0%'}</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--txt)', marginTop: '4px' }}>
            매출 정산 대사 및 지급 내역
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleRequestPayout}>
            <DollarSign size={15} />
            조기 입금 신청
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => showToast('전체 정산 데이터 엑셀 내보내기 완료', 'success')}>
            <FileSpreadsheet size={15} />
            엑셀 다운로드
          </button>
        </div>
      </div>

      {/* 3 Summary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        <div className="card-panel">
          <div style={{ fontSize: '12.5px', color: 'var(--mut)', fontWeight: 600 }}>총 누적 결제액 (GMV)</div>
          <div className="mono-font" style={{ fontSize: '26px', fontWeight: 900, color: 'var(--txt)', marginTop: '6px' }}>
            {totalGrossSales.toLocaleString()} <span style={{ fontSize: '14px', color: 'var(--mut)' }}>원</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--mut)', marginTop: '6px' }}>
            총 예약 완료: <strong style={{ color: 'var(--txt)' }}>{settlements.reduce((s, i) => s + i.bookingCount, 0)}건</strong>
          </div>
        </div>

        <div className="card-panel">
          <div style={{ fontSize: '12.5px', color: 'var(--mut)', fontWeight: 600 }}>플랫폼 중개 수수료 공제</div>
          <div className="mono-font" style={{ fontSize: '26px', fontWeight: 900, color: 'var(--danger)', marginTop: '6px' }}>
            -{totalPlatformFees.toLocaleString()} <span style={{ fontSize: '14px', color: 'var(--mut)' }}>원</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--mut)', marginTop: '6px' }}>
            PG 결제 대행 수수료 및 서버 비용 포함
          </div>
        </div>

        <div className="card-panel card-panel-accent">
          <div style={{ fontSize: '12.5px', color: 'var(--mut)', fontWeight: 600 }}>실지급 확정 정산액 (순입금)</div>
          <div className="mono-font" style={{ fontSize: '26px', fontWeight: 900, color: 'var(--green)', marginTop: '6px' }}>
            {totalNetPayout.toLocaleString()} <span style={{ fontSize: '14px', color: 'var(--mut)' }}>원</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--mut)', marginTop: '6px' }}>
            등록 계좌: <strong style={{ color: 'var(--txt)' }}>기업은행 124-***-88901 (예금주: {user.name})</strong>
          </div>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--txt)' }}>
              주차별 정산 대사 명세서
            </h3>
            <div style={{ fontSize: '12px', color: 'var(--mut)' }}>
              정산 완료 시 세금계산서가 자동 발행되며 입금 예정일에 지정 계좌로 송금됩니다.
            </div>
          </div>
          <span className="badge badge-outline">총 {settlements.length}개 정산주기</span>
        </div>

        <div className="table-container">
          <table className="tactical-table">
            <thead>
              <tr>
                <th>정산 주기</th>
                <th>고객사(파트너)명</th>
                <th>예약 건수</th>
                <th>총 매출액 (A)</th>
                <th>수수료 (B)</th>
                <th>실지급액 (A - B)</th>
                <th>지급 상태</th>
                <th>지급(예정)일</th>
                <th>정산서</th>
              </tr>
            </thead>
            <tbody>
              {settlements.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--mut)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <ReceiptText size={32} style={{ opacity: 0.4, color: 'var(--acc)' }} />
                      <span style={{ fontWeight: 700, color: 'var(--txt)', fontSize: '14px' }}>
                        아직 발생한 정산 및 매출 내역이 없습니다.
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--mut)' }}>
                        실제 고객 결제 및 예약이 완료되면 매주 금요일 정산 대사 명세서가 자동으로 집계되어 생성됩니다.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                settlements.map(record => {
                  const isPaid = record.payoutStatus === 'paid';
                  return (
                    <tr key={record.id}>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--txt)' }}>{record.period}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '13px' }}>{record.partnerName}</span>
                      </td>
                      <td>
                        <span className="mono-font">{record.bookingCount}건</span>
                      </td>
                      <td>
                        <span className="mono-font" style={{ fontWeight: 700 }}>
                          {record.grossSales.toLocaleString()}원
                        </span>
                      </td>
                      <td>
                        <span className="mono-font" style={{ color: 'var(--danger)', fontSize: '12px' }}>
                          -{(record.platformFeeAmount).toLocaleString()}원 ({(record.platformFeeRate * 100).toFixed(0)}%)
                        </span>
                      </td>
                      <td>
                        <span className="mono-font" style={{ fontWeight: 800, color: 'var(--green)', fontSize: '14px' }}>
                          {record.netPayout.toLocaleString()}원
                        </span>
                      </td>
                      <td>
                        {isPaid ? (
                          <span className="badge badge-success">
                            <CheckCircle2 size={11} /> 입금완료
                          </span>
                        ) : (
                          <span className="badge badge-warning">
                            <Clock size={11} /> 지급예정
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="mono-font" style={{ fontSize: '12px', color: 'var(--mut)' }}>
                          {record.payoutDate}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                          onClick={() => handleDownloadInvoice(record)}
                        >
                          <Download size={12} /> PDF
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
