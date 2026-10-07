export type UserRole = 'client' | 'companion';

export type Tribe = 'Ativo' | 'Passivo' | 'Versátil' | 'Urso' | 'Twink' | 'Sarado' | 'Daddy' | 'Discreto';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  distanceKm: number;
  bio: string;
  role: UserRole;
  tribe: Tribe;
  isOnline: boolean;
  isVerified: boolean;
  lastActive: string;
  height: string;
  weight: string;
  prepStatus: 'Em uso de PrEP' | 'Indetectável' | 'Testado recente' | 'Privado';
  tags: string[];
  lat: number;
  lng: number;
  photos: string[];
  // If companion
  companionData?: CompanionProfile;
  rating?: number;
  reviewCount?: number;
}

export interface BankAccount {
  pixKeyType: 'cpf' | 'email' | 'phone' | 'random';
  pixKey: string;
  bankName: string;
  agency: string;
  accountNumber: string;
  accountType: 'corrente' | 'poupanca';
  fullName: string;
  payoutFrequency: 'instantaneo' | 'semanal' | 'mensal';
}

export interface CompanionProfile {
  hourlyRate: number;
  overnightRate: number;
  twoHourRate: number;
  services: string[];
  boundaries: string[];
  availableSchedule: string;
  suitePhotos: string[];
  meetingLocations: ('motel' | 'hotel' | 'domicilio' | 'meu_local')[];
  bankAccount: BankAccount;
  walletBalance: number;
  pendingBalance: number;
  totalEarned: number;
  completedBookings: number;
  verifiedIdentity: boolean;
}

export interface MotelSuite {
  id: string;
  name: string;
  photoUrl: string;
  additionalPhotos: string[];
  pricePerHour: number;
  priceOvernight: number;
  amenities: string[];
  hasHydro: boolean;
  hasPool: boolean;
  hasSauna: boolean;
  hasDarkRoom: boolean;
  hasDancePole: boolean;
  hasAirConditioner: boolean;
  hasGarage: boolean;
  description: string;
}

export interface PartnerMotel {
  id: string;
  name: string;
  brand: string;
  distanceKm: number;
  address: string;
  neighborhood: string;
  city: string;
  rating: number;
  reviewCount: number;
  heroPhoto: string;
  discountBadge: string;
  exclusiveDiscountPercent: number;
  suites: MotelSuite[];
  phone: string;
  lat: number;
  lng: number;
  guiaDeMoteisPartner: boolean;
  isOpen24h: boolean;
}

export interface MotelBooking {
  id: string;
  motelId: string;
  motelName: string;
  suiteName: string;
  suitePhoto: string;
  date: string;
  timeSlot: string;
  periodHours: number;
  totalPrice: number;
  discountApplied: number;
  pointsEarned: number;
  status: 'confirmada' | 'em_andamento' | 'concluida' | 'cancelada';
  qrCodeToken: string;
  createdAt: string;
}

export interface CompanionBooking {
  id: string;
  companionId: string;
  companionName: string;
  companionAvatar: string;
  clientId: string;
  clientName: string;
  dateTime: string;
  durationHours: number;
  totalAmount: number;
  escrowStatus: 'retido_plataforma' | 'liberado_ao_acompanhante' | 'em_disputa' | 'estornado';
  locationType: 'motel' | 'hotel' | 'domicilio' | 'meu_local';
  locationAddress: string;
  motelPartnerBookingId?: string;
  notes?: string;
  meetingStatus: 'agendado' | 'em_andamento' | 'concluido' | 'cancelado';
  createdAt: string;
  paymentMethod: 'pix' | 'cartao_credito' | 'apple_pay' | 'google_pay';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isEncrypted: boolean;
  isDisappearing?: boolean;
  disappearSeconds?: number;
  mediaUrl?: string;
  mediaType?: 'photo' | 'audio' | 'location' | 'booking_invite' | 'call_log';
  bookingPayload?: any;
  callPayload?: {
    type: 'audio' | 'video';
    durationSeconds: number;
    status: 'completed' | 'missed' | 'declined';
  };
  status: 'sent' | 'delivered' | 'read';
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  type: 'match' | 'message' | 'booking' | 'payout' | 'promotion' | 'loyalty';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  ipAddress: string;
  action: string;
  category: 'auth' | 'financial' | 'moderation' | 'lgpd' | 'system';
  details: string;
  status: 'success' | 'flagged' | 'blocked';
}

export interface ReportedUserTicket {
  id: string;
  reportedUserId: string;
  reportedUserName: string;
  reportedUserAvatar: string;
  reporterId: string;
  reason: 'perfil_falso' | 'assedio' | 'fraude_financeira' | 'comportamento_inadequado' | 'foto_explicita_publica';
  comment: string;
  createdAt: string;
  status: 'pendente' | 'em_analise' | 'banido' | 'descartado';
}

export type PlatformMode = 'ios' | 'android' | 'macos' | 'windows' | 'web';
export type AppTheme = 'obsidian' | 'crimson' | 'amethyst' | 'sapphire';
export type LanguageCode = 'pt' | 'en' | 'es' | 'fr';
