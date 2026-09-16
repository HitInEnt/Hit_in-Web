import React, { useState } from 'react';
import { PartnerProvider, usePartner } from './context/PartnerContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/layout/ToastContainer';

// Feature Views
import { DashboardView } from './features/dashboard/DashboardView';
import { BookingsView } from './features/bookings/BookingsView';
import { CheckInDeskView } from './features/checkin/CheckInDeskView';
import { FieldManageView } from './features/field/FieldManageView';
import { ShopInventoryView } from './features/shop/ShopInventoryView';
import { SettlementView } from './features/settlement/SettlementView';
import { HqClientsView } from './features/hq/HqClientsView';
import { UserPointsView } from './features/points/UserPointsView';

// Auth
import { LoginView } from './features/auth/LoginView';
import { PrivacyPolicyView } from './features/legal/PrivacyPolicyView';

// Modals
import { QuickCheckInModal } from './components/common/QuickCheckInModal';
import { CreateSlotModal } from './components/common/CreateSlotModal';
import { ManualBookingModal } from './components/common/ManualBookingModal';
import { CreateProductModal } from './components/common/CreateProductModal';
import { PlayerMannerModal } from './components/common/PlayerMannerModal';
import { ProfileEditModal } from './components/common/ProfileEditModal';
import { TimeSlot } from './types';
import { PartnerService } from './services/partnerService';

const PartnerAppInner: React.FC = () => {
  const { activeTab, role, user, refreshKey, isAuthenticated, isProfileModalOpen, setIsProfileModalOpen } = usePartner();

  // Route state for non-authenticated pages like Privacy Policy & Terms
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return typeof window !== 'undefined' ? (window.location.pathname + window.location.hash) : '';
  });

  React.useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname + window.location.hash);
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const isPrivacyRoute = currentPath.startsWith('/privacy') || currentPath.includes('#privacy') || currentPath.startsWith('/terms') || currentPath.includes('#terms');

  // Modal States
  const [isQuickCheckInOpen, setIsQuickCheckInOpen] = useState(false);
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [slotModalDate, setSlotModalDate] = useState<string | undefined>(undefined);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [inspectedUserId, setInspectedUserId] = useState<string | null>(null);

  const [bookingSlotsForModal, setBookingSlotsForModal] = useState<TimeSlot[]>([]);

  const handleOpenAddSlot = (date?: string) => {
    setSlotModalDate(date);
    setIsAddSlotOpen(true);
  };

  const handleOpenManualBooking = (slots: TimeSlot[]) => {
    setBookingSlotsForModal(slots);
    setIsManualBookingOpen(true);
  };

  const handleInspectPlayer = (userId: string) => {
    setInspectedUserId(userId);
  };

  // If visiting Privacy Policy or Terms route, show it immediately without requiring login
  if (isPrivacyRoute) {
    return (
      <>
        <PrivacyPolicyView
          onBack={() => {
            window.history.pushState({}, '', '/');
            setCurrentPath('/');
          }}
        />
        <ToastContainer />
      </>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenQuickCheckIn={() => setIsQuickCheckInOpen(true)}
            onOpenAddSlot={() => handleOpenAddSlot()}
            onOpenAddProduct={() => setIsAddProductOpen(true)}
            onInspectPlayer={handleInspectPlayer}
          />
        );
      case 'bookings':
        return (
          <BookingsView
            onOpenAddSlot={handleOpenAddSlot}
            onOpenManualBooking={handleOpenManualBooking}
            onInspectPlayer={handleInspectPlayer}
          />
        );
      case 'checkin':
        return (
          <CheckInDeskView
            onInspectPlayer={handleInspectPlayer}
          />
        );
      case 'user_points':
        return <UserPointsView />;
      case 'field_manage':
        return <FieldManageView />;
      case 'shop_inventory':
        return (
          <ShopInventoryView
            onOpenAddProduct={() => setIsAddProductOpen(true)}
          />
        );
      case 'settlement':
        return <SettlementView />;
      case 'hq_clients':
        return <HqClientsView />;
      default:
        return (
          <DashboardView
            onOpenQuickCheckIn={() => setIsQuickCheckInOpen(true)}
            onOpenAddSlot={() => handleOpenAddSlot()}
            onOpenAddProduct={() => setIsAddProductOpen(true)}
            onInspectPlayer={handleInspectPlayer}
          />
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <LoginView onOpenPrivacy={() => {
          window.history.pushState({}, '', '/privacy');
          setCurrentPath('/privacy');
        }} />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <main className="main-content">
        {/* Header */}
        <Header
          onOpenQuickCheckIn={() => setIsQuickCheckInOpen(true)}
          onOpenAddSlot={() => handleOpenAddSlot()}
          onOpenAddProduct={() => setIsAddProductOpen(true)}
        />

        {/* Dynamic Page Content */}
        {renderActiveView()}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />

      {/* Global Toast Container */}
      <ToastContainer />

      {/* Modals */}
      <QuickCheckInModal
        isOpen={isQuickCheckInOpen}
        onClose={() => setIsQuickCheckInOpen(false)}
        onInspectPlayer={handleInspectPlayer}
      />

      <CreateSlotModal
        isOpen={isAddSlotOpen}
        onClose={() => {
          setIsAddSlotOpen(false);
          setSlotModalDate(undefined);
        }}
        initialDate={slotModalDate}
      />

      <ManualBookingModal
        isOpen={isManualBookingOpen}
        onClose={() => setIsManualBookingOpen(false)}
        slots={bookingSlotsForModal.length > 0 ? bookingSlotsForModal : PartnerService.getSlots(user.partnerId)}
      />

      <CreateProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
      />

      <PlayerMannerModal
        userId={inspectedUserId}
        onClose={() => setInspectedUserId(null)}
      />

      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <PartnerProvider>
      <PartnerAppInner />
    </PartnerProvider>
  );
}
