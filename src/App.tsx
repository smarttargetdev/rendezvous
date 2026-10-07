/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Radio, 
  BedDouble, 
  MessageCircle, 
  Sparkles, 
  User, 
  ShieldCheck, 
  Crown, 
  Bell, 
  Lock, 
  Fingerprint, 
  CheckCircle, 
  Search, 
  Calendar, 
  Headphones, 
  Code2, 
  SlidersHorizontal,
  ChevronRight,
  MapPin,
  Heart,
  Wallet,
  AlertTriangle,
  QrCode,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  UserProfile, 
  PartnerMotel, 
  MotelSuite, 
  MotelBooking, 
  CompanionBooking, 
  CompanionProfile, 
  PushNotification, 
  PlatformMode, 
  AppTheme, 
  LanguageCode 
} from './types';

import { 
  INITIAL_CURRENT_USER, 
  MOCK_USERS, 
  MOCK_PARTNER_MOTEIS, 
  MOCK_NOTIFICATIONS, 
  MOCK_AUDIT_LOGS, 
  MOCK_REPORTS,
  MOCK_INITIAL_COMPANION_BOOKINGS,
  MOCK_INITIAL_MOTEL_BOOKINGS
} from './data/mockData';

import { TRANSLATIONS } from './translations';

import { DeviceFrameWrapper } from './components/common/DeviceFrameWrapper';
import { PushNotificationToast } from './components/common/PushNotificationToast';
import { BiometricModal } from './components/common/BiometricModal';

import { RadarView } from './components/radar/RadarView';
import { FilterDrawer, FilterState } from './components/radar/FilterDrawer';

import { GuiaMoteisCatalog } from './components/moteis/GuiaMoteisCatalog';
import { MotelBookingCheckoutModal } from './components/moteis/MotelBookingCheckoutModal';
import { MotelReviewModal } from './components/moteis/MotelReviewModal';

import { CompanionProfileManagerModal } from './components/companion/CompanionProfileManagerModal';
import { CompanionBookingModal } from './components/companion/CompanionBookingModal';

import { E2EEChatDrawer } from './components/chat/E2EEChatDrawer';
import { LoyaltyClubModal } from './components/loyalty/LoyaltyClubModal';

import { SafetyReportModal } from './components/safety/SafetyReportModal';
import { PhotoVerificationModal } from './components/safety/PhotoVerificationModal';

import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { BackendArchitectureViewer } from './components/backend/BackendArchitectureViewer';
import { SupportChatModal } from './components/support/SupportChatModal';
import { BookingHistorySection } from './components/history/BookingHistorySection';
import { TransactionDetailModal } from './components/history/TransactionDetailModal';

type AppTab = 'radar' | 'moteis' | 'chat' | 'companion' | 'profile';

const TAB_ORDER: Record<AppTab, number> = {
  radar: 0,
  moteis: 1,
  chat: 2,
  companion: 3,
  profile: 4,
};

const tabVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 36 : -36,
    opacity: 0,
    scale: 0.985,
    filter: 'blur(3px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -36 : 36,
    opacity: 0,
    scale: 0.985,
    filter: 'blur(2px)',
  }),
};

const tabTransition = {
  x: { type: 'spring' as const, stiffness: 360, damping: 32, mass: 0.75 },
  opacity: { duration: 0.2, ease: 'easeOut' as const },
  scale: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  filter: { duration: 0.18 },
};

export default function App() {
  // App Global State
  const [platform, setPlatform] = useState<PlatformMode>('ios');
  const [theme, setTheme] = useState<AppTheme>('obsidian');
  const [language, setLanguage] = useState<LanguageCode>('pt');
  const [isOffline, setIsOffline] = useState(false);
  
  // App Shell Smooth Directional Tab Navigation State
  const [activeTab, setActiveTabRaw] = useState<AppTab>('radar');
  const [tabDirection, setTabDirection] = useState<number>(1);

  const setActiveTab = (newTab: AppTab) => {
    setActiveTabRaw((current) => {
      if (newTab === current) return current;
      const dir = TAB_ORDER[newTab] > TAB_ORDER[current] ? 1 : -1;
      setTabDirection(dir);
      return newTab;
    });
  };

  // Users & Data State
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_CURRENT_USER);
  const [usersList, setUsersList] = useState<UserProfile[]>(MOCK_USERS);
  const [motelsList, setMotelsList] = useState<PartnerMotel[]>(MOCK_PARTNER_MOTEIS);
  const [auditLogs, setAuditLogs] = useState(MOCK_AUDIT_LOGS);
  const [reportsList, setReportsList] = useState(MOCK_REPORTS);
  const [loyaltyPoints, setLoyaltyPoints] = useState(1280);
  const [currentNotification, setCurrentNotification] = useState<PushNotification | null>(MOCK_NOTIFICATIONS[0]);

  // History State for Transparent Consulting & One-Click Repeat
  const [companionBookingsHistory, setCompanionBookingsHistory] = useState<CompanionBooking[]>(MOCK_INITIAL_COMPANION_BOOKINGS);
  const [motelBookingsHistory, setMotelBookingsHistory] = useState<MotelBooking[]>(MOCK_INITIAL_MOTEL_BOOKINGS);
  const [selectedTransactionForDetails, setSelectedTransactionForDetails] = useState<{ companion?: CompanionBooking; motel?: MotelBooking } | null>(null);

  // Selected Entities & Modals
  const [selectedUserForChat, setSelectedUserForChat] = useState<UserProfile | null>(null);
  const [selectedUserForBooking, setSelectedUserForBooking] = useState<UserProfile | null>(null);
  const [selectedUserForReport, setSelectedUserForReport] = useState<UserProfile | null>(null);

  const [checkoutMotel, setCheckoutMotel] = useState<PartnerMotel | null>(null);
  const [checkoutSuite, setCheckoutSuite] = useState<MotelSuite | null>(null);
  const [reviewMotel, setReviewMotel] = useState<PartnerMotel | null>(null);

  // Modal Open Toggles
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isBiometricOpen, setIsBiometricOpen] = useState(false);
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isBackendOpen, setIsBackendOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isCompanionManagerOpen, setIsCompanionManagerOpen] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    maxDistance: 25,
    minAge: 18,
    maxAge: 65,
    selectedTribes: [],
    roleFilter: 'all',
    verifiedOnly: false,
    onlineOnly: false,
    prepOnly: false
  });

  const t = TRANSLATIONS[language];

  // Filter application on user list
  const filteredUsers = usersList.filter((u) => {
    if (u.distanceKm > filters.maxDistance) return false;
    if (filters.roleFilter !== 'all' && u.role !== filters.roleFilter) return false;
    if (filters.verifiedOnly && !u.isVerified) return false;
    if (filters.onlineOnly && !u.isOnline) return false;
    if (filters.prepOnly && u.prepStatus === 'Privado') return false;
    if (filters.selectedTribes.length > 0 && !filters.selectedTribes.includes(u.tribe)) return false;
    return true;
  });

  const activeFilterCount = 
    (filters.maxDistance < 25 ? 1 : 0) +
    (filters.roleFilter !== 'all' ? 1 : 0) +
    (filters.verifiedOnly ? 1 : 0) +
    (filters.onlineOnly ? 1 : 0) +
    (filters.selectedTribes.length > 0 ? 1 : 0);

  // Handlers
  const handleSelectUser = (user: UserProfile) => {
    setSelectedUserForChat(user);
  };

  const handleSelectMotel = (motel: PartnerMotel) => {
    setCheckoutMotel(motel);
    setCheckoutSuite(motel.suites[0]);
  };

  const handleSelectSuiteForBooking = (motel: PartnerMotel, suite: MotelSuite) => {
    setCheckoutMotel(motel);
    setCheckoutSuite(suite);
  };

  const handleConfirmMotelBooking = (booking: MotelBooking) => {
    setLoyaltyPoints((prev) => prev + booking.pointsEarned);
    setMotelBookingsHistory((prev) => [booking, ...prev]);
    // Push notification trigger
    setCurrentNotification({
      id: `notif_${Date.now()}`,
      title: 'Reserva Confirmada no Guia de Motéis!',
      body: `Sua suíte no ${booking.motelName} está garantida com check-in privativo por QR Code.`,
      type: 'booking',
      timestamp: 'Agora',
      read: false
    });
  };

  const handleConfirmCompanionBooking = (booking: CompanionBooking) => {
    setLoyaltyPoints((prev) => prev + 250);
    setCompanionBookingsHistory((prev) => [booking, ...prev]);
    setCurrentNotification({
      id: `notif_${Date.now()}`,
      title: 'Custódia Escrow Bloqueada!',
      body: `R$ ${booking.totalAmount.toFixed(2)} seguros. Notificação enviada para ${booking.companionName}.`,
      type: 'booking',
      timestamp: 'Agora',
      read: false
    });
  };

  // 1-Click Repeat Booking Handlers
  const handleRepeatCompanionBooking = (booking: CompanionBooking) => {
    const companionUser = usersList.find((u) => u.id === booking.companionId) || {
      id: booking.companionId,
      name: booking.companionName,
      age: 26,
      avatar: booking.companionAvatar,
      distanceKm: 0.5,
      bio: 'Acompanhante VIP exclusivo.',
      role: 'companion' as const,
      tribe: 'Sarado' as const,
      isOnline: true,
      isVerified: true,
      lastActive: 'Agora',
      height: '1.85m',
      weight: '82kg',
      prepStatus: 'Em uso de PrEP' as const,
      tags: ['Acompanhante VIP', 'Massagem'],
      lat: -23.56,
      lng: -46.65,
      photos: [booking.companionAvatar],
      companionData: {
        hourlyRate: booking.totalAmount / (booking.durationHours || 1),
        twoHourRate: booking.totalAmount,
        overnightRate: 1800,
        services: ['Jantar', 'Massagem', 'Suíte privativa'],
        boundaries: ['Respeito mútuo'],
        availableSchedule: 'Disponível',
        suitePhotos: ['/src/assets/images/suite_luxury_motel_1791333366683.jpg'],
        meetingLocations: ['motel', 'hotel'] as any,
        bankAccount: {
          pixKeyType: 'cpf' as const,
          pixKey: '342.***.***-09',
          bankName: 'Nubank',
          agency: '0001',
          accountNumber: '89472-1',
          accountType: 'corrente' as const,
          fullName: booking.companionName,
          payoutFrequency: 'instantaneo' as const
        },
        walletBalance: 1200,
        pendingBalance: 0,
        totalEarned: 15000,
        completedBookings: 20,
        verifiedIdentity: true
      },
      rating: 4.95,
      reviewCount: 22
    };

    setSelectedUserForBooking(companionUser);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 }
      });
    } catch (e) {}

    setCurrentNotification({
      id: `repeat_${Date.now()}`,
      title: 'Repetição com 1 Clique Iniciada!',
      body: `Agendamento pré-configurado para ${booking.companionName}. Confirme para reter a garantia escrow.`,
      type: 'booking',
      timestamp: 'Agora',
      read: false
    });
  };

  const handleRepeatMotelBooking = (booking: MotelBooking) => {
    const motel = motelsList.find((m) => m.id === booking.motelId) || motelsList[0];
    const suite = motel.suites.find((s) => s.name === booking.suiteName) || motel.suites[0];

    setCheckoutMotel(motel);
    setCheckoutSuite(suite);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 }
      });
    } catch (e) {}

    setCurrentNotification({
      id: `repeat_motel_${Date.now()}`,
      title: 'Reserva Repetida com 1 Clique!',
      body: `Suíte ${suite.name} no ${motel.name} carregada com desconto aplicado.`,
      type: 'booking',
      timestamp: 'Agora',
      read: false
    });
  };

  const handleUpdateCompanionProfile = (updated: CompanionProfile) => {
    setCurrentUser((prev) => ({
      ...prev,
      role: 'companion',
      companionData: updated
    }));
  };

  const handleWithdrawalRequest = (amount: number) => {
    if (!currentUser.companionData) return;
    setCurrentUser((prev) => ({
      ...prev,
      companionData: {
        ...prev.companionData!,
        walletBalance: 0
      }
    }));
    setCurrentNotification({
      id: `notif_${Date.now()}`,
      title: 'Saque PIX Processado!',
      body: `O valor de R$ ${amount.toFixed(2)} foi transferido com sucesso para sua chave PIX cadastrada.`,
      type: 'payout',
      timestamp: 'Agora',
      read: false
    });
  };

  const handleRedeemReward = (rewardName: string, cost: number) => {
    setLoyaltyPoints((prev) => Math.max(0, prev - cost));
    setCurrentNotification({
      id: `notif_${Date.now()}`,
      title: 'Benefício Resgatado no Clube!',
      body: `${rewardName} ativado com sucesso para uso imediato.`,
      type: 'loyalty',
      timestamp: 'Agora',
      read: false
    });
  };

  const handleVerificationComplete = () => {
    setCurrentUser((prev) => ({
      ...prev,
      isVerified: true
    }));
    setLoyaltyPoints((prev) => prev + 100);
  };

  const handleReportUser = (reason: string, comment: string) => {
    if (selectedUserForReport) {
      setReportsList((prev) => [
        {
          id: `rep_${Date.now()}`,
          reportedUserId: selectedUserForReport.id,
          reportedUserName: selectedUserForReport.name,
          reportedUserAvatar: selectedUserForReport.avatar,
          reporterId: currentUser.id,
          reason: reason as any,
          comment: comment || 'Denúncia de segurança submetida pelo usuário.',
          createdAt: 'Agora',
          status: 'pendente'
        },
        ...prev
      ]);
    }
  };

  const handleBlockUser = (userId: string) => {
    setUsersList((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleModerateUser = (ticketId: string, action: 'ban' | 'dismiss') => {
    if (action === 'ban') {
      const ticket = reportsList.find((r) => r.id === ticketId);
      if (ticket) {
        setUsersList((prev) => prev.filter((u) => u.id !== ticket.reportedUserId));
      }
    }
    setReportsList((prev) => prev.filter((r) => r.id !== ticketId));
  };

  const triggerPushSample = () => {
    const samples: PushNotification[] = [
      {
        id: `push_${Date.now()}`,
        title: 'Novo Match no Radar!',
        body: 'Rodrigo Fontes (34) enviou uma curtida com alta afinidade para você.',
        type: 'match',
        timestamp: 'Agora',
        read: false
      },
      {
        id: `push_${Date.now()}`,
        title: 'Promoção Relâmpago Guia de Motéis',
        body: '25% OFF na Suíte Lush Spa com banheira de hidromassagem somente hoje!',
        type: 'promotion',
        timestamp: 'Agora',
        read: false
      },
      {
        id: `push_${Date.now()}`,
        title: 'Custódia Escrow Liberada',
        body: 'R$ 600,00 creditados na sua carteira de acompanhante após encontro concluído.',
        type: 'payout',
        timestamp: 'Agora',
        read: false
      }
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    setCurrentNotification(picked);
  };

  return (
    <DeviceFrameWrapper
      platform={platform}
      onPlatformChange={setPlatform}
      theme={theme}
      onThemeChange={setTheme}
      language={language}
      onLanguageChange={setLanguage}
      isOffline={isOffline}
      onToggleOffline={() => setIsOffline(!isOffline)}
      onOpenBackendModal={() => setIsBackendOpen(true)}
      onOpenAdminModal={() => setIsAdminOpen(true)}
      onOpenSupportModal={() => setIsSupportOpen(true)}
      onTriggerPushSample={triggerPushSample}
      onBiometricCheck={() => setIsBiometricOpen(true)}
    >
      {/* Inner Mobile/Web App Shell */}
      <div className="flex-1 flex flex-col h-full bg-neutral-950 text-neutral-100 overflow-hidden relative">
        {/* Top App Header */}
        <header className="px-4 py-3 bg-neutral-900/90 border-b border-neutral-800/80 backdrop-blur-md flex items-center justify-between gap-3 shrink-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center font-bold text-white shadow-md shadow-rose-950/40">
              <span className="font-display text-sm tracking-wider">R</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-display font-bold text-sm tracking-tight text-white">
                  Rendezvous
                </h1>
                {currentUser.isVerified && (
                  <span title="Perfil Verificado">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                  </span>
                )}
              </div>
              <p className="text-[10px] text-neutral-400">
                {activeTab === 'radar' && 'Radar em Tempo Real'}
                {activeTab === 'moteis' && 'Guia de Motéis Parceiros'}
                {activeTab === 'chat' && 'Chats Criptografados (E2EE)'}
                {activeTab === 'companion' && 'Área do Acompanhante VIP'}
                {activeTab === 'profile' && 'Perfil & Rendezvous Club'}
              </p>
            </div>
          </div>

          {/* Quick Header Badges & Actions */}
          <div className="flex items-center gap-1.5">
            {/* Loyalty Points Pill Button */}
            <button
              onClick={() => setIsLoyaltyOpen(true)}
              className="px-2.5 py-1 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 flex items-center gap-1 text-[11px] text-amber-300 transition-colors shadow-xs"
              title="Abrir Rendezvous Club"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-mono font-bold">{loyaltyPoints}</span>
              <span className="text-[9px] text-neutral-400 hidden sm:inline">pts</span>
            </button>

            {/* Support Concierge shortcut */}
            <button
              onClick={() => setIsSupportOpen(true)}
              className="p-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
              title="Suporte Concierge 24h"
            >
              <Headphones className="w-4 h-4 text-neutral-300" />
            </button>

            {/* Safety & SOS shortcut */}
            <button
              onClick={() => {
                setSelectedUserForReport(null);
                setIsSafetyOpen(true);
              }}
              className="p-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 transition-colors"
              title="Central de Segurança & SOS"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </button>
          </div>
        </header>

        {/* Tab Content Display with Framer Motion Smooth Page Transitions */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          <AnimatePresence mode="wait" custom={tabDirection} initial={false}>
            {activeTab === 'radar' && (
              <motion.div
                key="radar"
                custom={tabDirection}
                variants={tabVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={tabTransition}
                className="flex-1 flex flex-col h-full overflow-hidden w-full"
              >
                <RadarView
                  users={filteredUsers}
                  motels={motelsList}
                  onSelectUser={handleSelectUser}
                  onSelectMotel={handleSelectMotel}
                  onOpenFilter={() => setIsFilterOpen(true)}
                  activeFilterCount={activeFilterCount}
                />
              </motion.div>
            )}

            {activeTab === 'moteis' && (
              <motion.div
                key="moteis"
                custom={tabDirection}
                variants={tabVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={tabTransition}
                className="flex-1 flex flex-col h-full overflow-hidden w-full"
              >
                <GuiaMoteisCatalog
                  motels={motelsList}
                  onSelectSuite={handleSelectSuiteForBooking}
                  onOpenReviews={(motel) => setReviewMotel(motel)}
                />
              </motion.div>
            )}

            {activeTab === 'chat' && (
              <motion.div
                key="chat"
                custom={tabDirection}
                variants={tabVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={tabTransition}
                className="flex-1 flex flex-col h-full bg-neutral-950 p-3 sm:p-4 overflow-y-auto space-y-3 w-full"
              >
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
                  <div>
                    <h2 className="text-sm font-bold text-white">Conversas Privadas & Seguras</h2>
                    <p className="text-[11px] text-neutral-400">
                      Criptografia de ponta a ponta (E2EE) ativa em todas as salas
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    E2EE Ativo
                  </span>
                </div>

                {/* Chat Threads List */}
                <div className="space-y-2">
                  {usersList.slice(0, 4).map((user) => (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUserForChat(user)}
                      className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-rose-500/50 cursor-pointer flex items-center justify-between gap-3 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-neutral-700"
                          />
                          {user.isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-neutral-900" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <h4 className="text-xs font-bold text-white truncate">{user.name}</h4>
                            {user.role === 'companion' && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                                VIP
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-400 truncate">
                            {user.role === 'companion'
                              ? 'Olá! Vi seu perfil no radar Rendezvous. Se estiver buscando companhia...'
                              : 'E aí, vi que você está pertinho pelo radar! Curte tomar um drink mais tarde?'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[10px] text-neutral-500">{user.lastActive}</div>
                        <span className="text-[10px] font-semibold text-rose-400">{user.distanceKm} km</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'companion' && (
              <motion.div
                key="companion"
                custom={tabDirection}
                variants={tabVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={tabTransition}
                className="flex-1 flex flex-col h-full bg-neutral-950 p-4 overflow-y-auto space-y-4 text-xs w-full"
              >
                {/* Companion Hero Strip */}
                <div className="p-4 rounded-3xl bg-gradient-to-r from-neutral-900 via-amber-950/30 to-neutral-900 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold border border-amber-500/40">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Central do Acompanhante VIP</h3>
                        <p className="text-[11px] text-neutral-400">
                          Garantia de recebimento seguro, agenda e suítes parceiras
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsCompanionManagerOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors shadow-sm"
                    >
                      Gerenciar Perfil
                    </button>
                  </div>

                  {/* Financial Summary */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-800">
                    <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
                      <div className="text-[10px] text-neutral-400">Saldo Disponível</div>
                      <div className="text-lg font-bold text-white font-mono mt-0.5">
                        R$ {currentUser.companionData?.walletBalance.toFixed(2) || '2450.00'}
                      </div>
                      <div className="text-[10px] text-emerald-400 font-medium">Saque PIX liberado</div>
                    </div>

                    <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
                      <div className="text-[10px] text-neutral-400">Em Custódia Garantida</div>
                      <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">
                        R$ {currentUser.companionData?.pendingBalance.toFixed(2) || '700.00'}
                      </div>
                      <div className="text-[10px] text-neutral-400">1 agendamento pendente</div>
                    </div>
                  </div>
                </div>

                {/* Preference & Rates Showcase */}
                <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                    Suas Tarifas Ativas para Contratação
                  </h4>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                      <div className="text-[10px] text-neutral-400">1 Hora</div>
                      <div className="text-sm font-bold text-rose-400 font-mono mt-0.5">
                        R$ {currentUser.companionData?.hourlyRate || 350}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                      <div className="text-[10px] text-neutral-400">2 Horas</div>
                      <div className="text-sm font-bold text-rose-400 font-mono mt-0.5">
                        R$ {currentUser.companionData?.twoHourRate || 600}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                      <div className="text-[10px] text-neutral-400">Pernoite</div>
                      <div className="text-sm font-bold text-rose-400 font-mono mt-0.5">
                        R$ {currentUser.companionData?.overnightRate || 1800}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-[11px] font-semibold text-neutral-200">Chave PIX de Recebimento</div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        {currentUser.companionData?.bankAccount.pixKey || '342.***.***-09'} (Nubank)
                      </div>
                    </div>
                    <button
                      onClick={() => setIsCompanionManagerOpen(true)}
                      className="text-[11px] text-rose-400 hover:text-rose-300 font-medium underline"
                    >
                      Editar
                    </button>
                  </div>
                </div>

                {/* Escrow Protection Explanation */}
                <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Segurança Financeira Garantida por Escrow</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    O cliente realiza o pagamento antecipado na plataforma. O valor fica 100% garantido e bloqueado. Você atende com tranquilidade sabendo que o cachê já está depositado e será liberado via PIX imediatamente.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                custom={tabDirection}
                variants={tabVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={tabTransition}
                className="flex-1 flex flex-col h-full bg-neutral-950 p-4 overflow-y-auto space-y-4 text-xs w-full"
              >
                {/* User Identity Card */}
                <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-rose-500"
                    />
                    {currentUser.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 text-neutral-950 flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white truncate">{currentUser.name}, {currentUser.age}</h3>
                      {currentUser.isVerified && (
                        <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                          VERIFICADO
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {currentUser.tribe} · {currentUser.height} · {currentUser.weight}
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">
                      {currentUser.prepStatus}
                    </div>
                  </div>
                </div>

                {/* Rendezvous Club Card */}
                <div 
                  onClick={() => setIsLoyaltyOpen(true)}
                  className="cursor-pointer p-4 rounded-3xl bg-gradient-to-r from-neutral-900 via-amber-950/40 to-neutral-900 border border-neutral-800 hover:border-amber-500/50 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold border border-amber-500/40">
                      <Crown className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Rendezvous Club</span>
                        <span className="text-[10px] text-amber-400 font-mono font-bold">({loyaltyPoints} pts)</span>
                      </div>
                      <p className="text-[10px] text-neutral-400">Descontos exclusivos no Guia de Motéis</p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </div>

                {/* Full Booking & Appointment History Section */}
                <div className="p-4 sm:p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-xl">
                  <BookingHistorySection
                    companionBookings={companionBookingsHistory}
                    motelBookings={motelBookingsHistory}
                    onOpenTransactionDetails={setSelectedTransactionForDetails}
                    onRepeatCompanionBooking={handleRepeatCompanionBooking}
                    onRepeatMotelBooking={handleRepeatMotelBooking}
                  />
                </div>

                {/* Action Buttons Hub */}
                <div className="space-y-2">
                  {/* Photo Verification Trigger */}
                  <button
                    onClick={() => setIsVerificationOpen(true)}
                    className="w-full p-3 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="font-semibold text-white">Selo de Verificação por Selfie</div>
                        <div className="text-[10px] text-neutral-400">
                          {currentUser.isVerified ? 'Identidade confirmada com sucesso' : 'Validar biometria facial'}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-cyan-400 font-semibold">
                      {currentUser.isVerified ? 'Ativo' : 'Verificar'}
                    </span>
                  </button>

                  {/* Biometric Passkey Unlock test */}
                  <button
                    onClick={() => setIsBiometricOpen(true)}
                    className="w-full p-3 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Fingerprint className="w-4 h-4 text-rose-400" />
                      <div>
                        <div className="font-semibold text-white">Bloqueio por Biometria / FaceID</div>
                        <div className="text-[10px] text-neutral-400">Proteção biométrica para transações financeiras</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-semibold">Ativado</span>
                  </button>

                  {/* Safety & SOS */}
                  <button
                    onClick={() => setIsSafetyOpen(true)}
                    className="w-full p-3 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="font-semibold text-white">Central de Segurança & LGPD</div>
                        <div className="text-[10px] text-neutral-400">Denúncia, botão SOS e direitos de privacidade</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </button>

                  {/* Admin Dashboard */}
                  <button
                    onClick={() => setIsAdminOpen(true)}
                    className="w-full p-3 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-rose-400" />
                      <div>
                        <div className="font-semibold text-white">Painel Administrativo & Métricas</div>
                        <div className="text-[10px] text-neutral-400">Moderação em tempo real e exportação PDF/Excel</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </button>

                  {/* PHP Backend Architecture */}
                  <button
                    onClick={() => setIsBackendOpen(true)}
                    className="w-full p-3 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Code2 className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="font-semibold text-white">Arquitetura PHP 8.3 & WebSockets</div>
                        <div className="text-[10px] text-neutral-400">Código do servidor Swoole, Escrow e API Guia de Motéis</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation Bar with Spring Touch Feedback & Active Pill */}
        <nav className="h-16 bg-neutral-900/95 border-t border-neutral-800/80 backdrop-blur-md px-2 grid grid-cols-5 items-center shrink-0 z-30 relative">
          <motion.button
            whileTap={{ scale: 0.90 }}
            onClick={() => setActiveTab('radar')}
            className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
              activeTab === 'radar' ? 'text-rose-500 font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {activeTab === 'radar' && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute -top-2 w-8 h-1 bg-rose-500 rounded-full"
                transition={{ type: 'spring', stiffness: 480, damping: 32 }}
              />
            )}
            <motion.div
              animate={{ scale: activeTab === 'radar' ? 1.1 : 1, y: activeTab === 'radar' ? -1 : 0 }}
              transition={{ duration: 0.18 }}
            >
              <Radio className="w-5 h-5" />
            </motion.div>
            <span className="text-[10px] font-medium tracking-tight mt-1">Radar</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.90 }}
            onClick={() => setActiveTab('moteis')}
            className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
              activeTab === 'moteis' ? 'text-rose-500 font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {activeTab === 'moteis' && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute -top-2 w-8 h-1 bg-rose-500 rounded-full"
                transition={{ type: 'spring', stiffness: 480, damping: 32 }}
              />
            )}
            <motion.div
              animate={{ scale: activeTab === 'moteis' ? 1.1 : 1, y: activeTab === 'moteis' ? -1 : 0 }}
              transition={{ duration: 0.18 }}
            >
              <BedDouble className="w-5 h-5" />
            </motion.div>
            <span className="text-[10px] font-medium tracking-tight mt-1">Motéis</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.90 }}
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
              activeTab === 'chat' ? 'text-rose-500 font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {activeTab === 'chat' && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute -top-2 w-8 h-1 bg-rose-500 rounded-full"
                transition={{ type: 'spring', stiffness: 480, damping: 32 }}
              />
            )}
            <motion.div
              animate={{ scale: activeTab === 'chat' ? 1.1 : 1, y: activeTab === 'chat' ? -1 : 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageCircle className="w-5 h-5" />
            </motion.div>
            <span className="text-[10px] font-medium tracking-tight mt-1">Conversas</span>
            <span className="absolute top-1 right-1/4 w-2 h-2 rounded-full bg-rose-500" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.90 }}
            onClick={() => setActiveTab('companion')}
            className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
              activeTab === 'companion' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {activeTab === 'companion' && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute -top-2 w-8 h-1 bg-amber-400 rounded-full"
                transition={{ type: 'spring', stiffness: 480, damping: 32 }}
              />
            )}
            <motion.div
              animate={{ scale: activeTab === 'companion' ? 1.1 : 1, y: activeTab === 'companion' ? -1 : 0 }}
              transition={{ duration: 0.18 }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            <span className="text-[10px] font-medium tracking-tight mt-1">Acompanhante</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.90 }}
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
              activeTab === 'profile' ? 'text-rose-500 font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {activeTab === 'profile' && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute -top-2 w-8 h-1 bg-rose-500 rounded-full"
                transition={{ type: 'spring', stiffness: 480, damping: 32 }}
              />
            )}
            <motion.div
              animate={{ scale: activeTab === 'profile' ? 1.1 : 1, y: activeTab === 'profile' ? -1 : 0 }}
              transition={{ duration: 0.18 }}
            >
              <User className="w-5 h-5" />
            </motion.div>
            <span className="text-[10px] font-medium tracking-tight mt-1">Perfil</span>
          </motion.button>
        </nav>
      </div>

      {/* Interactive Modals */}
      <PushNotificationToast
        notification={currentNotification}
        onDismiss={() => setCurrentNotification(null)}
        onClick={(notif) => {
          if (notif.type === 'match' || notif.type === 'message') {
            setActiveTab('chat');
          } else if (notif.type === 'promotion') {
            setActiveTab('moteis');
          } else if (notif.type === 'payout' || notif.type === 'booking') {
            setActiveTab('companion');
          }
        }}
      />

      <BiometricModal
        isOpen={isBiometricOpen}
        onSuccess={() => setIsBiometricOpen(false)}
        onCancel={() => setIsBiometricOpen(false)}
      />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onUpdateFilters={setFilters}
        onResetFilters={() =>
          setFilters({
            maxDistance: 25,
            minAge: 18,
            maxAge: 65,
            selectedTribes: [],
            roleFilter: 'all',
            verifiedOnly: false,
            onlineOnly: false,
            prepOnly: false
          })
        }
      />

      <MotelBookingCheckoutModal
        isOpen={!!checkoutMotel && !!checkoutSuite}
        onClose={() => {
          setCheckoutMotel(null);
          setCheckoutSuite(null);
        }}
        motel={checkoutMotel}
        suite={checkoutSuite}
        onConfirmBooking={handleConfirmMotelBooking}
      />

      <MotelReviewModal
        isOpen={!!reviewMotel}
        onClose={() => setReviewMotel(null)}
        motel={reviewMotel}
        onSubmitReview={(rating, comment) => {
          setLoyaltyPoints((p) => p + 50);
        }}
      />

      <CompanionProfileManagerModal
        isOpen={isCompanionManagerOpen}
        onClose={() => setIsCompanionManagerOpen(false)}
        currentUser={currentUser}
        onUpdateCompanionProfile={handleUpdateCompanionProfile}
        onRequestWithdrawal={handleWithdrawalRequest}
      />

      <CompanionBookingModal
        isOpen={!!selectedUserForBooking}
        onClose={() => setSelectedUserForBooking(null)}
        companion={selectedUserForBooking}
        partnerMotels={motelsList}
        onConfirmBooking={handleConfirmCompanionBooking}
      />

      <E2EEChatDrawer
        isOpen={!!selectedUserForChat}
        onClose={() => setSelectedUserForChat(null)}
        currentUser={currentUser}
        peerUser={selectedUserForChat}
        partnerMotels={motelsList}
        onOpenBookingModal={(peer) => {
          setSelectedUserForChat(null);
          setSelectedUserForBooking(peer);
        }}
        onOpenMotelModal={() => {
          setSelectedUserForChat(null);
          setActiveTab('moteis');
        }}
      />

      <LoyaltyClubModal
        isOpen={isLoyaltyOpen}
        onClose={() => setIsLoyaltyOpen(false)}
        points={loyaltyPoints}
        onRedeemReward={handleRedeemReward}
      />

      <PhotoVerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        onVerificationComplete={handleVerificationComplete}
      />

      <SafetyReportModal
        isOpen={isSafetyOpen}
        onClose={() => setIsSafetyOpen(false)}
        targetUser={selectedUserForReport}
        onSubmitReport={handleReportUser}
        onBlockUser={handleBlockUser}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        auditLogs={auditLogs}
        reports={reportsList}
        onModerateUser={handleModerateUser}
      />

      <BackendArchitectureViewer
        isOpen={isBackendOpen}
        onClose={() => setIsBackendOpen(false)}
      />

      <SupportChatModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      <TransactionDetailModal
        isOpen={!!selectedTransactionForDetails}
        onClose={() => setSelectedTransactionForDetails(null)}
        companionBooking={selectedTransactionForDetails?.companion}
        motelBooking={selectedTransactionForDetails?.motel}
      />
    </DeviceFrameWrapper>
  );
}
