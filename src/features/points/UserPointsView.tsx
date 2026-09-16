import React, { useState, useMemo } from 'react';
import { 
  Coins, 
  Award, 
  QrCode, 
  Star, 
  MessageSquare, 
  Search, 
  Filter, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Clock, 
  User, 
  Phone, 
  ShieldCheck, 
  AlertCircle, 
  Calendar, 
  ChevronRight, 
  RefreshCw, 
  SlidersHorizontal, 
  History, 
  Sparkles, 
  TrendingUp, 
  X,
  Building2,
  Check
} from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';
import { PartnerService } from '../../services/partnerService';
import { UserPointSummary, UserPointTransaction, PointReason } from '../../types';

export const UserPointsView: React.FC = () => {
  const { user, role, showToast, triggerRefresh, refreshKey } = usePartner();

  // State
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'transactions'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [reasonFilter, setReasonFilter] = useState<'all' | PointReason>('all');
  const [userFilter, setUserFilter] = useState<'all' | 'checked_in_today' | 'not_checked_in' | 'vip'>('all');

  // Modals state
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<UserPointSummary | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Form states for modals
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [manualAmount, setManualAmount] = useState<string>('1000');
  const [manualReason, setManualReason] = useState<string>('');

  // Load Data
  const userSummaries = useMemo(() => {
    return PartnerService.getUserPointSummaries();
  }, [refreshKey]);

  const transactions = useMemo(() => {
    return PartnerService.getUserPointTransactions();
  }, [refreshKey]);

  // Statistics calculation
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayTxs = transactions.filter(t => t.createdAt.startsWith(todayStr));
    
    const todayEarnedPoints = todayTxs
      .filter(t => t.type === 'earn')
      .reduce((sum, t) => sum + t.amount, 0);

    const todayQrCheckIns = todayTxs.filter(t => t.reason === 'qr_checkin').length;
    const todayReviews = todayTxs.filter(t => t.reason === 'review_rating');
    const totalTrackedPoints = userSummaries.reduce((sum, u) => sum + u.totalPoints, 0);

    return {
      todayEarnedPoints,
      todayQrCheckIns,
      todayReviewCount: todayReviews.length,
      todayReviewPoints: todayReviews.reduce((sum, t) => sum + t.amount, 0),
      totalUsers: userSummaries.length,
      totalTrackedPoints
    };
  }, [transactions, userSummaries]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return userSummaries.filter(u => {
      const matchesSearch = 
        !searchTerm.trim() ||
        u.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.userNickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone.includes(searchTerm);

      if (!matchesSearch) return false;

      if (userFilter === 'checked_in_today') return u.todayQrCheckedIn;
      if (userFilter === 'not_checked_in') return !u.todayQrCheckedIn;
      if (userFilter === 'vip') return u.totalPoints >= 5000;

      return true;
    });
  }, [userSummaries, searchTerm, userFilter]);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = 
        !searchTerm.trim() ||
        t.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.userNickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.userPhone.includes(searchTerm) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (reasonFilter !== 'all' && t.reason !== reasonFilter) return false;

      return true;
    });
  }, [transactions, searchTerm, reasonFilter]);

  // Modal Handlers
  const handleOpenQrModal = (userId?: string) => {
    if (userId) {
      setSelectedUserId(userId);
    } else if (userSummaries.length > 0) {
      setSelectedUserId(userSummaries[0].userId);
    }
    setIsQrModalOpen(true);
  };

  const handleOpenReviewModal = (userId?: string) => {
    if (userId) {
      setSelectedUserId(userId);
    } else if (userSummaries.length > 0) {
      setSelectedUserId(userSummaries[0].userId);
    }
    setReviewRating(5);
    setReviewComment('상대팀과의 힛콜 매너가 매우 훌륭하고 게임 몰입도가 높았습니다.');
    setIsReviewModalOpen(true);
  };

  const handleOpenManualModal = (userId?: string) => {
    if (userId) {
      setSelectedUserId(userId);
    } else if (userSummaries.length > 0) {
      setSelectedUserId(userSummaries[0].userId);
    }
    setManualAmount('1000');
    setManualReason('현장 이벤트 참여 감사 보너스 포인트');
    setIsManualModalOpen(true);
  };

  const handleExecuteQrCheckIn = () => {
    const targetUser = userSummaries.find(u => u.userId === selectedUserId);
    if (!targetUser) {
      showToast('선택된 사용자가 없습니다.', 'warning');
      return;
    }

    const res = PartnerService.recordQrCheckInPoints(
      targetUser.userId,
      targetUser.userName,
      targetUser.userNickname,
      targetUser.phone,
      user.partnerId,
      user.businessName || 'HITIN 파트너사',
      role === 'shop_owner' ? 'shop' : 'field'
    );

    if (res.success) {
      showToast(res.message, 'success');
      setIsQrModalOpen(false);
      triggerRefresh();
      // update detail if open
      if (selectedUserForDetail && selectedUserForDetail.userId === targetUser.userId) {
        const updatedSummaries = PartnerService.getUserPointSummaries();
        const found = updatedSummaries.find(u => u.userId === targetUser.userId);
        if (found) setSelectedUserForDetail(found);
      }
    } else {
      showToast(res.message, 'warning');
    }
  };

  const handleExecuteReviewGrant = () => {
    const targetUser = userSummaries.find(u => u.userId === selectedUserId);
    if (!targetUser) {
      showToast('선택된 사용자가 없습니다.', 'warning');
      return;
    }

    const res = PartnerService.recordReviewRatingPoints(
      targetUser.userId,
      reviewRating,
      reviewComment || '게임 후기 및 매너 평점 등록',
      user.partnerId,
      user.businessName || 'HITIN 파트너사'
    );

    if (res.success) {
      showToast(res.message, 'success');
      setIsReviewModalOpen(false);
      triggerRefresh();
      if (selectedUserForDetail && selectedUserForDetail.userId === targetUser.userId) {
        const updatedSummaries = PartnerService.getUserPointSummaries();
        const found = updatedSummaries.find(u => u.userId === targetUser.userId);
        if (found) setSelectedUserForDetail(found);
      }
    }
  };

  const handleExecuteManualGrant = () => {
    const targetUser = userSummaries.find(u => u.userId === selectedUserId);
    if (!targetUser) {
      showToast('선택된 사용자가 없습니다.', 'warning');
      return;
    }

    const amt = parseInt(manualAmount, 10);
    if (isNaN(amt) || amt === 0) {
      showToast('유효한 포인트 금액을 입력해주세요.', 'warning');
      return;
    }

    PartnerService.grantManualPoints(
      targetUser.userId,
      amt,
      manualReason || (amt > 0 ? '관리자 수동 포인트 지급' : '관리자 수동 포인트 차감'),
      user.partnerId,
      user.businessName || 'HITIN 파트너사'
    );

    showToast(`${targetUser.userName}님에게 ${amt > 0 ? '+' : ''}${amt.toLocaleString()} P가 적용되었습니다.`, 'success');
    setIsManualModalOpen(false);
    triggerRefresh();
    if (selectedUserForDetail && selectedUserForDetail.userId === targetUser.userId) {
      const updatedSummaries = PartnerService.getUserPointSummaries();
      const found = updatedSummaries.find(u => u.userId === targetUser.userId);
      if (found) setSelectedUserForDetail(found);
    }
  };

  const getReasonBadge = (reason: PointReason) => {
    switch (reason) {
      case 'qr_checkin':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '600',
            backgroundColor: 'rgba(34, 197, 94, 0.15)',
            color: '#22c55e',
            border: '1px solid rgba(34, 197, 94, 0.3)'
          }}>
            <QrCode size={12} /> QR 체크인 (1일 1회)
          </span>
        );
      case 'review_rating':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '600',
            backgroundColor: 'rgba(234, 179, 8, 0.15)',
            color: '#eab308',
            border: '1px solid rgba(234, 179, 8, 0.3)'
          }}>
            <Star size={12} /> 게임 후기·매너 평점
          </span>
        );
      case 'manner_reward':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '600',
            backgroundColor: 'rgba(168, 85, 247, 0.15)',
            color: '#a855f7',
            border: '1px solid rgba(168, 85, 247, 0.3)'
          }}>
            <Sparkles size={12} /> 매너 보너스
          </span>
        );
      case 'manual_adjust':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '600',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            color: '#3b82f6',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}>
            <SlidersHorizontal size={12} /> 관리자 조정
          </span>
        );
      default:
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '600',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'var(--text-muted)'
          }}>
            기타
          </span>
        );
    }
  };

  return (
    <div className="page-scrollable">
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)',
        border: '1px solid rgba(234, 88, 12, 0.25)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'rgba(234, 88, 12, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}>
              <Coins size={20} />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>사용자 & 포인트 관리</h1>
            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              padding: '3px 8px',
              borderRadius: '20px',
              backgroundColor: 'var(--primary)',
              color: '#000',
              letterSpacing: '0.5px'
            }}>
              {role === 'shop_owner' ? '건샵관리 채널' : role === 'field_owner' ? '필드관리 채널' : '본사관리 채널'}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            현장 <strong>QR 체크인 (1일 1회 +1,000 P)</strong>과 <strong>게임 후기·매너 평점(-5점 ~ +5점 평가에 따라 -50P ~ +5P 지급/차감)</strong> 적립 현황 및 사용자별 누적 포인트를 실시간으로 조회하고 관리합니다.
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => handleOpenQrModal()}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
          >
            <QrCode size={15} color="var(--primary)" />
            QR 체크인 포인트 적립
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => handleOpenReviewModal()}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
          >
            <Star size={15} color="#eab308" />
            게임후기·평점 등록 (-50P ~ +5P)
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => handleOpenManualModal()}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
          >
            <Plus size={15} />
            수동 포인트 조정
          </button>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid-responsive-cards" style={{ marginBottom: '24px' }}>
        {/* Card 1: Today Points */}
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>오늘 적립 포인트</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(234, 88, 12, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
            +{stats.todayEarnedPoints.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: '500' }}>P</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            QR: {(stats.todayQrCheckIns * 1000).toLocaleString()} P / 후기: {stats.todayReviewPoints.toLocaleString()} P
          </div>
        </div>

        {/* Card 2: Today QR Check-ins */}
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>오늘 QR 체크인 회원</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#22c55e'
            }}>
              <QrCode size={16} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
            {stats.todayQrCheckIns} <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)' }}>명</span>
          </div>
          <div style={{ fontSize: '11px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} /> 1일 1회 (+1,000 P) 적립 적용
          </div>
        </div>

        {/* Card 3: Game Review Points */}
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>게임 후기 & 매너 평점</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(234, 179, 8, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#eab308'
            }}>
              <Star size={16} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
            {stats.todayReviewCount} <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)' }}>건</span>
          </div>
          <div style={{ fontSize: '11px', color: '#eab308' }}>
            건당 +500 P 적립 (상호 매너 평가)
          </div>
        </div>

        {/* Card 4: Total Users & Total Points */}
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>관리 회원 & 총 잔여 포인트</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6'
            }}>
              <Coins size={16} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
            {stats.totalUsers} <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)' }}>명</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            총 잔여: {stats.totalTrackedPoints.toLocaleString()} P
          </div>
        </div>
      </div>

      {/* Main Section with Subtabs */}
      <div className="card" style={{ padding: '20px' }}>
        {/* Navigation & Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          borderBottom: '1px solid var(--line)',
          paddingBottom: '16px',
          marginBottom: '16px'
        }}>
          {/* Subtabs */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveSubTab('users')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: activeSubTab === 'users' ? 'var(--primary)' : 'var(--bg-card)',
                color: activeSubTab === 'users' ? '#000' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <User size={15} />
              체크인 회원 포인트 현황 ({userSummaries.length})
            </button>
            <button
              onClick={() => setActiveSubTab('transactions')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: activeSubTab === 'transactions' ? 'var(--primary)' : 'var(--bg-card)',
                color: activeSubTab === 'transactions' ? '#000' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <History size={15} />
              실시간 포인트 적립 & 사용 피드 ({transactions.length})
            </button>
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="이름, 닉네임, 연락처 검색..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '32px', fontSize: '13px', height: '36px' }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '8px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Subtab 1: User Point Directory */}
        {activeSubTab === 'users' && (
          <div>
            {/* Filter Chips */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setUserFilter('all')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  border: '1px solid var(--line)',
                  backgroundColor: userFilter === 'all' ? 'var(--line)' : 'transparent',
                  color: userFilter === 'all' ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                전체 회원 ({userSummaries.length})
              </button>
              <button
                onClick={() => setUserFilter('checked_in_today')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  backgroundColor: userFilter === 'checked_in_today' ? 'rgba(34, 197, 94, 0.2)' : 'transparent',
                  color: userFilter === 'checked_in_today' ? '#22c55e' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <CheckCircle2 size={12} /> 오늘 QR 체크인 완료 ({userSummaries.filter(u => u.todayQrCheckedIn).length})
              </button>
              <button
                onClick={() => setUserFilter('not_checked_in')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  border: '1px solid var(--line)',
                  backgroundColor: userFilter === 'not_checked_in' ? 'var(--line)' : 'transparent',
                  color: userFilter === 'not_checked_in' ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                오늘 미체크인 ({userSummaries.filter(u => !u.todayQrCheckedIn).length})
              </button>
              <button
                onClick={() => setUserFilter('vip')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  border: '1px solid rgba(234, 88, 12, 0.4)',
                  backgroundColor: userFilter === 'vip' ? 'rgba(234, 88, 12, 0.2)' : 'transparent',
                  color: userFilter === 'vip' ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Award size={12} /> VIP (5,000P 이상)
              </button>
            </div>

            {/* User Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 8px' }}>회원 정보</th>
                    <th style={{ padding: '12px 8px' }}>보유 포인트</th>
                    <th style={{ padding: '12px 8px' }}>오늘 QR 체크인 (1일 1회)</th>
                    <th style={{ padding: '12px 8px' }}>누적 QR 체크인</th>
                    <th style={{ padding: '12px 8px' }}>후기 & 매너 평점</th>
                    <th style={{ padding: '12px 8px' }}>최근 체크인</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>포인트 관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        검색 조건에 일치하는 회원이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => (
                      <tr 
                        key={u.userId}
                        style={{
                          borderBottom: '1px solid var(--line)',
                          transition: 'background-color 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {/* User Profile */}
                        <td style={{ padding: '12px 8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img 
                              src={u.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=TeddyCommander&backgroundColor=ffdfbf'} 
                              alt={u.userName}
                              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontWeight: '600', color: '#fff' }}>
                                {u.userName} <span style={{ fontSize: '12px', color: 'var(--primary)' }}>({u.userNickname})</span>
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{u.phone}</div>
                            </div>
                          </div>
                        </td>

                        {/* Total Points */}
                        <td style={{ padding: '12px 8px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)' }}>
                            {u.totalPoints.toLocaleString()} P
                          </span>
                        </td>

                        {/* Today QR Checked In */}
                        <td style={{ padding: '12px 8px' }}>
                          {u.todayQrCheckedIn ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '600',
                              backgroundColor: 'rgba(34, 197, 94, 0.15)',
                              color: '#22c55e',
                              border: '1px solid rgba(34, 197, 94, 0.3)'
                            }}>
                              <CheckCircle2 size={12} /> 완료 (+1,000 P)
                            </span>
                          ) : (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              color: 'var(--text-muted)',
                              border: '1px solid var(--line)'
                            }}>
                              미체크인
                            </span>
                          )}
                        </td>

                        {/* QR Check-in count */}
                        <td style={{ padding: '12px 8px' }}>
                          <span style={{ fontWeight: '600' }}>{u.qrCheckInCount}</span> 회
                        </td>

                        {/* Reviews & Manner */}
                        <td style={{ padding: '12px 8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Star size={13} fill="#eab308" color="#eab308" />
                            <span style={{ fontWeight: '600', color: '#eab308' }}>{u.mannerScore.toFixed(1)}</span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({u.reviewsWrittenCount}건 작성)</span>
                          </div>
                        </td>

                        {/* Last check in */}
                        <td style={{ padding: '12px 8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                          {u.lastQrCheckInDate ? u.lastQrCheckInDate.slice(5) : '-'}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              className="btn btn-secondary"
                              onClick={() => setSelectedUserForDetail(u)}
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                              title="포인트 적립/사용 전체 내역 조회"
                            >
                              상세보기
                            </button>
                            {!u.todayQrCheckedIn && (
                              <button
                                className="btn btn-secondary"
                                onClick={() => handleOpenQrModal(u.userId)}
                                style={{
                                  padding: '4px 8px',
                                  fontSize: '11px',
                                  borderColor: 'rgba(34, 197, 94, 0.4)',
                                  color: '#22c55e'
                                }}
                                title="1일 1회 QR 체크인 포인트 지급"
                              >
                                +1,000P
                              </button>
                            )}
                            <button
                              className="btn btn-secondary"
                              onClick={() => handleOpenManualModal(u.userId)}
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                              title="수동 포인트 조정"
                            >
                              조정
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Subtab 2: Live Point Transactions Feed */}
        {activeSubTab === 'transactions' && (
          <div>
            {/* Filter Chips by Reason */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setReasonFilter('all')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  border: '1px solid var(--line)',
                  backgroundColor: reasonFilter === 'all' ? 'var(--line)' : 'transparent',
                  color: reasonFilter === 'all' ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                전체 적립·사용 내역 ({transactions.length})
              </button>
              <button
                onClick={() => setReasonFilter('qr_checkin')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  backgroundColor: reasonFilter === 'qr_checkin' ? 'rgba(34, 197, 94, 0.2)' : 'transparent',
                  color: reasonFilter === 'qr_checkin' ? '#22c55e' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <QrCode size={12} /> QR 체크인 (+1,000 P / 1일 1회)
              </button>
              <button
                onClick={() => setReasonFilter('review_rating')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  border: '1px solid rgba(234, 179, 8, 0.4)',
                  backgroundColor: reasonFilter === 'review_rating' ? 'rgba(234, 179, 8, 0.2)' : 'transparent',
                  color: reasonFilter === 'review_rating' ? '#eab308' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Star size={12} /> 게임 후기·매너 평점 (-50P ~ +5P)
              </button>
              <button
                onClick={() => setReasonFilter('manual_adjust')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  backgroundColor: reasonFilter === 'manual_adjust' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  color: reasonFilter === 'manual_adjust' ? '#3b82f6' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                관리자 수동 조정
              </button>
            </div>

            {/* Transactions Feed Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 8px' }}>일시</th>
                    <th style={{ padding: '12px 8px' }}>회원 정보</th>
                    <th style={{ padding: '12px 8px' }}>적립 사유 / 뱃지</th>
                    <th style={{ padding: '12px 8px' }}>적립 상세 및 후기 내용</th>
                    <th style={{ padding: '12px 8px' }}>발생 채널</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>포인트 변동</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        해당 조건에 일치하는 포인트 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map(tx => (
                      <tr 
                        key={tx.id}
                        style={{
                          borderBottom: '1px solid var(--line)',
                          transition: 'background-color 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {/* Datetime */}
                        <td style={{ padding: '12px 8px', fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                          {tx.createdAt}
                        </td>

                        {/* User */}
                        <td style={{ padding: '12px 8px' }}>
                          <div style={{ fontWeight: '600', color: '#fff' }}>
                            {tx.userName} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>({tx.userNickname})</span>
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{tx.userPhone}</div>
                        </td>

                        {/* Reason Badge */}
                        <td style={{ padding: '12px 8px', whiteSpace: 'nowrap' }}>
                          {getReasonBadge(tx.reason)}
                        </td>

                        {/* Description & Review Info */}
                        <td style={{ padding: '12px 8px' }}>
                          <div style={{ color: '#ddd' }}>{tx.description}</div>
                          {tx.reviewRating !== undefined && tx.reviewRating !== null && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                              <span style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                padding: '1px 6px',
                                borderRadius: '4px',
                                backgroundColor: tx.reviewRating < 0 ? 'rgba(239, 68, 68, 0.15)' : tx.reviewRating === 0 ? 'rgba(148, 163, 184, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                                color: tx.reviewRating < 0 ? '#ef4444' : tx.reviewRating === 0 ? '#94a3b8' : '#eab308',
                                border: `1px solid ${tx.reviewRating < 0 ? 'rgba(239, 68, 68, 0.3)' : tx.reviewRating === 0 ? 'rgba(148, 163, 184, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`
                              }}>
                                ★ {tx.reviewRating > 0 ? `+${tx.reviewRating}` : tx.reviewRating}점
                              </span>
                              {tx.reviewComment && (
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                  "{tx.reviewComment}"
                                </span>
                              )}
                            </div>
                          )}
                          {tx.targetSlotTitle && (
                            <div style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '2px' }}>
                              🎯 {tx.targetSlotTitle}
                            </div>
                          )}
                        </td>

                        {/* Partner */}
                        <td style={{ padding: '12px 8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--line)'
                          }}>
                            {tx.partnerName}
                          </span>
                        </td>

                        {/* Amount */}
                        <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            color: tx.amount === 0 ? '#94a3b8' : (tx.type === 'earn' && tx.amount > 0) ? '#22c55e' : '#ef4444',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '2px'
                          }}>
                            {tx.amount === 0 ? '0' : (tx.type === 'earn' && tx.amount > 0) ? `+${tx.amount.toLocaleString()}` : `-${Math.abs(tx.amount).toLocaleString()}`} P
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: User Detail Drawer / Modal */}
      {selectedUserForDetail && (
        <div className="modal-overlay" onClick={() => setSelectedUserForDetail(null)}>
          <div 
            className="modal-content" 
            style={{ maxWidth: '680px' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Coins size={20} color="var(--primary)" />
                <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>회원 포인트 & 체크인 상세</h2>
              </div>
              <button className="btn-icon" onClick={() => setSelectedUserForDetail(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              {/* Profile Card */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                backgroundColor: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                marginBottom: '20px'
              }}>
                <img 
                  src={selectedUserForDetail.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=TeddyCommander&backgroundColor=ffdfbf'}
                  alt={selectedUserForDetail.userName}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>{selectedUserForDetail.userName}</span>
                    <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600' }}>({selectedUserForDetail.userNickname})</span>
                    {selectedUserForDetail.todayQrCheckedIn && (
                      <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}>
                        오늘 체크인 완료
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{selectedUserForDetail.phone}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>현재 보유 포인트</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary)' }}>
                    {selectedUserForDetail.totalPoints.toLocaleString()} P
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--line)', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>총 QR 체크인 횟수</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', marginTop: '4px' }}>{selectedUserForDetail.qrCheckInCount}회</div>
                </div>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--line)', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>작성한 게임 후기</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', marginTop: '4px' }}>{selectedUserForDetail.reviewsWrittenCount}건</div>
                </div>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--line)', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>플레이어 매너 평점</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#eab308', marginTop: '4px' }}>⭐ {selectedUserForDetail.mannerScore.toFixed(1)}</div>
                </div>
              </div>

              {/* Transaction History for this user */}
              <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>최근 포인트 적립 및 사용 내역</h3>
              <div style={{ maxHeight: '240px', overflowY: 'auto', border: '1px solid var(--line)', borderRadius: '8px' }}>
                {transactions.filter(t => t.userId === selectedUserForDetail.userId).length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                    포인트 내역이 없습니다.
                  </div>
                ) : (
                  transactions.filter(t => t.userId === selectedUserForDetail.userId).map(tx => (
                    <div 
                      key={tx.id}
                      style={{
                        padding: '10px 14px',
                        borderBottom: '1px solid var(--line)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '12px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {getReasonBadge(tx.reason)}
                          <span style={{ color: '#fff', fontWeight: '500' }}>{tx.description}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {tx.createdAt} · {tx.partnerName}
                        </div>
                      </div>
                      <div style={{
                        fontWeight: '700',
                        color: tx.type === 'earn' ? '#22c55e' : '#ef4444'
                      }}>
                        {tx.type === 'earn' ? '+' : '-'}{Math.abs(tx.amount).toLocaleString()} P
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Action row */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
                {!selectedUserForDetail.todayQrCheckedIn && (
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      handleOpenQrModal(selectedUserForDetail.userId);
                    }}
                    style={{ borderColor: 'rgba(34, 197, 94, 0.4)', color: '#22c55e' }}
                  >
                    <QrCode size={14} style={{ marginRight: '4px' }} />
                    오늘 QR 체크인 (+1,000P)
                  </button>
                )}
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    handleOpenReviewModal(selectedUserForDetail.userId);
                  }}
                >
                  <Star size={14} color="#eab308" style={{ marginRight: '4px' }} />
                  게임후기·평점 등록 (-50P ~ +5P)
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    handleOpenManualModal(selectedUserForDetail.userId);
                  }}
                >
                  포인트 직접 조정
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: QR Check-in Simulation Modal */}
      {isQrModalOpen && (
        <div className="modal-overlay" onClick={() => setIsQrModalOpen(false)}>
          <div 
            className="modal-content" 
            style={{ maxWidth: '480px' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <QrCode size={20} color="#22c55e" />
                <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>QR 체크인 포인트 적립</h2>
              </div>
              <button className="btn-icon" onClick={() => setIsQrModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{
                padding: '12px',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.25)',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '12px',
                color: '#22c55e',
                lineHeight: '1.5'
              }}>
                📌 <strong>규정 안내:</strong> 필드 및 건샵 현장 QR 체크인 시 사용자당 <strong>1일 1회 한정으로 1,000 P</strong>가 자동 적립됩니다.
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  적립 대상 회원 선택
                </label>
                <select 
                  className="input-field"
                  value={selectedUserId}
                  onChange={e => setSelectedUserId(e.target.value)}
                  style={{ width: '100%' }}
                >
                  {userSummaries.map(u => (
                    <option key={u.userId} value={u.userId}>
                      {u.userName} ({u.userNickname}) - {u.phone} {u.todayQrCheckedIn ? '[오늘 이미 적립됨]' : '[오늘 미적립]'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Check if user already checked in */}
              {userSummaries.find(u => u.userId === selectedUserId)?.todayQrCheckedIn && (
                <div style={{
                  padding: '10px',
                  backgroundColor: 'rgba(234, 179, 8, 0.1)',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  borderRadius: '6px',
                  color: '#eab308',
                  fontSize: '12px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <AlertCircle size={15} />
                  해당 회원은 오늘 이미 1회 체크인 포인트(+1,000P)를 지급받았습니다.
                </div>
              )}

              <div style={{
                padding: '14px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: '8px',
                border: '1px solid var(--line)',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>적립 예정 포인트</span>
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#22c55e' }}>+1,000 P</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button className="btn btn-secondary" onClick={() => setIsQrModalOpen(false)}>
                  취소
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleExecuteQrCheckIn}
                  style={{ backgroundColor: '#22c55e', color: '#000', border: 'none', fontWeight: '700' }}
                >
                  QR 체크인 및 +1,000P 적립
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Game Review & Manner Rating Modal */}
      {isReviewModalOpen && (
        <div className="modal-overlay" onClick={() => setIsReviewModalOpen(false)}>
          <div 
            className="modal-content" 
            style={{ maxWidth: '500px' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Star size={20} color="#eab308" />
                <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>게임 후기 & 매너 평점 적립 / 차감</h2>
              </div>
              <button className="btn-icon" onClick={() => setIsReviewModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              {/* Point Notice Banner */}
              <div style={{
                padding: '14px 16px',
                backgroundColor: 'rgba(234, 179, 8, 0.08)',
                border: '1px solid rgba(234, 179, 8, 0.25)',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '12px',
                lineHeight: '1.6'
              }}>
                <div style={{ fontWeight: '700', color: '#eab308', marginBottom: '6px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Star size={14} fill="#eab308" />
                  <span>게임 후기 & 매너 평점 포인트 적립/차감 안내</span>
                </div>
                <div style={{ color: 'var(--txt)', marginBottom: '6px' }}>
                  평가 별점(<strong>-5점 ~ +5점</strong>) 부여에 따라 포인트가 차등 지급 또는 차감됩니다:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4px', fontSize: '11.5px' }}>
                  <div style={{ color: '#ef4444' }}>
                    🔴 <strong>-5점 ~ -1점 (비매너/불량):</strong> -50P ~ -10P 차감
                    <div style={{ fontSize: '10.5px', color: 'var(--mut)', marginTop: '1px' }}>
                      (-5점: -50P / -4점: -40P / -3점: -30P / -2점: -20P / -1점: -10P)
                    </div>
                  </div>
                  <div style={{ color: 'var(--mut)' }}>
                    ⚪ <strong>0점 (보통 평가):</strong> 0 P (변동 없음)
                  </div>
                  <div style={{ color: '#22c55e' }}>
                    🟢 <strong>+1점 ~ +5점 (우수 매너/시설 호평):</strong> +1P ~ +5P 지급
                    <div style={{ fontSize: '10.5px', color: 'var(--mut)', marginTop: '1px' }}>
                      (+1점: +1P / +2점: +2P / +3점: +3P / +4점: +4P / +5점: +5P)
                    </div>
                  </div>
                </div>
              </div>

              {/* User Selection */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--txt)' }}>
                  작성 회원 선택
                </label>
                <select 
                  className="input-field"
                  value={selectedUserId}
                  onChange={e => setSelectedUserId(e.target.value)}
                  style={{ width: '100%' }}
                >
                  {userSummaries.map(u => (
                    <option key={u.userId} value={u.userId}>
                      {u.userName} ({u.userNickname}) - {u.phone}
                    </option>
                  ))}
                </select>
              </div>

              {/* -5 ~ +5 Rating Selector */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--txt)', margin: 0 }}>
                    매너 & 경기 평점 선택 (-5 ~ +5점)
                  </label>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '800',
                    color: reviewRating < 0 ? '#ef4444' : reviewRating === 0 ? '#94a3b8' : '#22c55e',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    background: reviewRating < 0 ? 'rgba(239,68,68,0.15)' : reviewRating === 0 ? 'rgba(148,163,184,0.15)' : 'rgba(34,197,94,0.15)',
                    border: `1px solid ${reviewRating < 0 ? 'rgba(239,68,68,0.3)' : reviewRating === 0 ? 'rgba(148,163,184,0.3)' : 'rgba(34,197,94,0.3)'}`
                  }}>
                    {reviewRating > 0 ? `+${reviewRating}` : reviewRating}점 
                    ({reviewRating < 0 ? `${reviewRating * 10}P 차감` : reviewRating === 0 ? '0P' : `+${reviewRating}P 지급`})
                  </span>
                </div>

                {/* Rating 11-Button Palette */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(11, 1fr)',
                  gap: '4px',
                  background: 'var(--panel)',
                  padding: '6px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--line)'
                }}>
                  {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map(val => {
                    const isSelected = reviewRating === val;
                    const isNegative = val < 0;
                    const isZero = val === 0;
                    const btnColor = isNegative ? '#ef4444' : isZero ? '#94a3b8' : '#22c55e';
                    const activeBg = isNegative ? 'rgba(239,68,68,0.25)' : isZero ? 'rgba(148,163,184,0.25)' : 'rgba(34,197,94,0.25)';
                    const activeBorder = isNegative ? '#ef4444' : isZero ? '#94a3b8' : '#22c55e';

                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setReviewRating(val)}
                        style={{
                          padding: '8px 2px',
                          borderRadius: 'var(--radius-sm)',
                          border: isSelected ? `2px solid ${activeBorder}` : '1px solid var(--line)',
                          background: isSelected ? activeBg : 'transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span style={{ fontSize: '13px', fontWeight: 800, color: isSelected ? btnColor : 'var(--txt)' }}>
                          {val > 0 ? `+${val}` : val}
                        </span>
                        <span style={{ fontSize: '9px', color: isSelected ? btnColor : 'var(--dim)', fontWeight: 600 }}>
                          {val < 0 ? `${val * 10}P` : val === 0 ? '0P' : `+${val}P`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Review Comment */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--txt)' }}>
                  게임 후기 및 매너 코멘트
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="게임 진행 매너와 필드 시설에 대한 평가를 입력하세요..."
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>

              {/* Calculated Points Preview */}
              {(() => {
                const calculatedPoints = reviewRating < 0 ? reviewRating * 10 : reviewRating;
                const isDeduct = calculatedPoints < 0;
                const isZero = calculatedPoints === 0;

                return (
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: isDeduct ? 'rgba(239, 68, 68, 0.1)' : isZero ? 'rgba(148, 163, 184, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                    borderRadius: '8px',
                    border: `1px solid ${isDeduct ? 'rgba(239, 68, 68, 0.3)' : isZero ? 'rgba(148, 163, 184, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                    marginBottom: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {isDeduct ? '차감 예정 포인트 (비매너 감점)' : isZero ? '반영 포인트' : '지급 예정 포인트 (매너 가점)'}
                      </div>
                      <div style={{ fontSize: '11px', color: isDeduct ? '#ef4444' : isZero ? '#94a3b8' : '#22c55e', marginTop: '2px', fontWeight: 600 }}>
                        평점 {reviewRating > 0 ? `+${reviewRating}` : reviewRating}점 기준
                      </div>
                    </div>
                    <span style={{
                      fontSize: '20px',
                      fontWeight: '800',
                      color: isDeduct ? '#ef4444' : isZero ? '#94a3b8' : '#22c55e'
                    }}>
                      {isDeduct ? `${calculatedPoints} P` : isZero ? '0 P' : `+${calculatedPoints} P`}
                    </span>
                  </div>
                );
              })()}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button className="btn btn-secondary" onClick={() => setIsReviewModalOpen(false)}>
                  취소
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleExecuteReviewGrant}
                  style={{
                    backgroundColor: reviewRating < 0 ? '#ef4444' : reviewRating === 0 ? '#64748b' : '#eab308',
                    color: reviewRating === 0 ? '#fff' : reviewRating < 0 ? '#fff' : '#000',
                    border: 'none',
                    fontWeight: '700'
                  }}
                >
                  {reviewRating < 0 
                    ? `후기 등록 및 ${Math.abs(reviewRating * 10)}P 차감`
                    : reviewRating === 0
                    ? '후기 등록 (0P)'
                    : `후기 등록 및 +${reviewRating}P 적립`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Manual Adjustment Modal */}
      {isManualModalOpen && (
        <div className="modal-overlay" onClick={() => setIsManualModalOpen(false)}>
          <div 
            className="modal-content" 
            style={{ maxWidth: '480px' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SlidersHorizontal size={20} color="var(--primary)" />
                <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>수동 포인트 지급 / 차감</h2>
              </div>
              <button className="btn-icon" onClick={() => setIsManualModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  대상 회원 선택
                </label>
                <select 
                  className="input-field"
                  value={selectedUserId}
                  onChange={e => setSelectedUserId(e.target.value)}
                  style={{ width: '100%' }}
                >
                  {userSummaries.map(u => (
                    <option key={u.userId} value={u.userId}>
                      {u.userName} ({u.userNickname}) - 현재 {u.totalPoints.toLocaleString()} P
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  조정할 포인트 (+지급 / -차감)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={manualAmount}
                  onChange={e => setManualAmount(e.target.value)}
                  placeholder="예: 1000 또는 -500"
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  {['+500', '+1000', '+3000', '+5000', '-1000'].map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setManualAmount(preset.replace('+', ''))}
                      style={{
                        padding: '3px 8px',
                        fontSize: '11px',
                        borderRadius: '4px',
                        border: '1px solid var(--line)',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  지급/차감 사유
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={manualReason}
                  onChange={e => setManualReason(e.target.value)}
                  placeholder="예: 현장 이벤트 당첨 보너스, 소모품 현장 구매 차감 등"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button className="btn btn-secondary" onClick={() => setIsManualModalOpen(false)}>
                  취소
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleExecuteManualGrant}
                >
                  포인트 적용
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
