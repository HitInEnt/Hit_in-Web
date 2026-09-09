import React, { useState } from 'react';
import { PartnerProvider, usePartner } from './context/PartnerContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/layout/ToastContainer';

// Feature Views
import { DashboardView } from './features/dashboard/DashboardView';
import { BookingsView } from './features/bookings/BookingsView';
import { CheckInDeskView } from './features/checkin/CheckInDeskView';
import { FieldManageView } from './features/field/FieldManageView';
import { ShopInventoryView } from './features/shop/ShopInventoryView';
import { SettlementView } from './features/settlement/SettlementView';
import { HqClientsView } from './features/hq/HqClientsView';

// Auth
import { LoginView } from './features/auth/LoginView';

// Modals
import { QuickCheckInModal } from './components/common/QuickCheckInModal';
import { CreateSlotModal } from './components/common/CreateSlotModal';
import { ManualBookingModal } from './components/common/ManualBookingModal';
import { CreateProductModal } from './components/common/CreateProductModal';
import { PlayerMannerModal } from './components/common/PlayerMannerModal';
import { TimeSlot } from './types';
import { PartnerService } from './services/partnerService';

const PartnerAppInner: React.FC = () => {
  const { activeTab, role, user, refreshKey, isAuthenticated } = usePartner();

  // Modal States
  const [isQuickCheckInOpen, setIsQuickCheckInOpen] = useState(false);
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [inspectedUserId, setInspectedUserId] = useState<string | null>(null);

  const [bookingSlotsForModal, setBookingSlotsForModal] = useState<TimeSlot[]>([]);

  const handleOpenManualBooking = (slots: TimeSlot[]) => {
    setBookingSlotsForModal(slots);
    setIsManualBookingOpen(true);
  };

  const handleInspectPlayer = (userId: string) => {
    setInspectedUserId(userId);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenQuickCheckIn={() => setIsQuickCheckInOpen(true)}
            onOpenAddSlot={() => setIsAddSlotOpen(true)}
            onOpenAddProduct={() => setIsAddProductOpen(true)}
            onInspectPlayer={handleInspectPlayer}
          />
        );
      case 'bookings':
        return (
          <BookingsView
            onOpenAddSlot={() => setIsAddSlotOpen(true)}
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
            onOpenAddSlot={() => setIsAddSlotOpen(true)}
            onOpenAddProduct={() => setIsAddProductOpen(true)}
            onInspectPlayer={handleInspectPlayer}
          />
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <LoginView />
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
          onOpenAddSlot={() => setIsAddSlotOpen(true)}
          onOpenAddProduct={() => setIsAddProductOpen(true)}
        />

        {/* Dynamic Page Content */}
        {renderActiveView()}
      </main>

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
        onClose={() => setIsAddSlotOpen(false)}
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
