import { LanguageCode } from '../types';

export const TRANSLATIONS: Record<LanguageCode, {
  appName: string;
  tagline: string;
  radar: string;
  moteis: string;
  messages: string;
  companion: string;
  profile: string;
  admin: string;
  support: string;
  searchPlaceholder: string;
  filterTitle: string;
  distance: string;
  onlineNow: string;
  verifiedOnly: string;
  companionOnly: string;
  bookMeeting: string;
  bookSuite: string;
  hourlyRate: string;
  services: string;
  bankAccount: string;
  pixKey: string;
  escrowProtected: string;
  escrowNotice: string;
  loyaltyPoints: string;
  e2eeEncrypted: string;
  disappearingMessages: string;
  reportUser: string;
  emergencySafety: string;
  biometricUnlock: string;
  auditLogs: string;
  exportPdf: string;
  exportExcel: string;
}> = {
  pt: {
    appName: 'Rendezvous',
    tagline: 'Encontros Exclusivos, Radar & Guia de Motéis',
    radar: 'Radar',
    moteis: 'Guia de Motéis',
    messages: 'Conversas',
    companion: 'Acompanhante',
    profile: 'Meu Perfil',
    admin: 'Painel Admin',
    support: 'Suporte 24h',
    searchPlaceholder: 'Buscar pessoas, tribos ou motéis...',
    filterTitle: 'Filtros Avançados',
    distance: 'Distância',
    onlineNow: 'Online Agora',
    verifiedOnly: 'Apenas Verificados',
    companionOnly: 'Apenas Acompanhantes',
    bookMeeting: 'Agendar Encontro',
    bookSuite: 'Reservar Suíte',
    hourlyRate: 'Valor por Hora',
    services: 'Preferências & Serviços',
    bankAccount: 'Dados Bancários para Recebimento',
    pixKey: 'Chave PIX',
    escrowProtected: 'Pagamento 100% Protegido em Custódia (Escrow)',
    escrowNotice: 'O valor só é repassado ao acompanhante após a confirmação mútua do término do encontro.',
    loyaltyPoints: 'Rendezvous Club - Pontos & Recompensas',
    e2eeEncrypted: 'Criptografia de Ponta a Ponta Ativa (E2EE)',
    disappearingMessages: 'Mensagens Temporárias',
    reportUser: 'Denunciar Usuário',
    emergencySafety: 'Central de Segurança & SOS',
    biometricUnlock: 'Autenticação Biométrica',
    auditLogs: 'Logs de Auditoria & LGPD',
    exportPdf: 'Exportar Relatório PDF',
    exportExcel: 'Exportar para Excel (XLSX)'
  },
  en: {
    appName: 'Rendezvous',
    tagline: 'Exclusive Gay Encounters, Radar & Motel Guide',
    radar: 'Radar',
    moteis: 'Motel Guide',
    messages: 'Chats',
    companion: 'Escort VIP',
    profile: 'My Profile',
    admin: 'Admin Panel',
    support: '24/7 Support',
    searchPlaceholder: 'Search people, tribes, or suites...',
    filterTitle: 'Advanced Filters',
    distance: 'Distance',
    onlineNow: 'Online Now',
    verifiedOnly: 'Verified Only',
    companionOnly: 'Escorts Only',
    bookMeeting: 'Book Appointment',
    bookSuite: 'Book Suite',
    hourlyRate: 'Hourly Rate',
    services: 'Preferences & Services',
    bankAccount: 'Bank Payout Information',
    pixKey: 'PIX / Bank Key',
    escrowProtected: '100% Escrow Protected Payment',
    escrowNotice: 'Funds are only released to companion upon mutual confirmation after the meeting.',
    loyaltyPoints: 'Rendezvous Club - Points & Rewards',
    e2eeEncrypted: 'End-to-End Encrypted (E2EE)',
    disappearingMessages: 'Disappearing Messages',
    reportUser: 'Report Profile',
    emergencySafety: 'Safety Center & SOS',
    biometricUnlock: 'Biometric Authentication',
    auditLogs: 'Audit Logs & Privacy',
    exportPdf: 'Export PDF Report',
    exportExcel: 'Export to Excel (XLSX)'
  },
  es: {
    appName: 'Rendezvous',
    tagline: 'Encuentros Exclusivos, Radar & Guía de Moteles',
    radar: 'Radar',
    moteis: 'Guía de Moteles',
    messages: 'Mensajes',
    companion: 'Acompañante VIP',
    profile: 'Mi Perfil',
    admin: 'Panel Admin',
    support: 'Soporte 24h',
    searchPlaceholder: 'Buscar personas o suites...',
    filterTitle: 'Filtros Avanzados',
    distance: 'Distancia',
    onlineNow: 'En Línea Ahora',
    verifiedOnly: 'Solo Verificados',
    companionOnly: 'Solo Acompañantes',
    bookMeeting: 'Reservar Cita',
    bookSuite: 'Reservar Suite',
    hourlyRate: 'Tarifa por Hora',
    services: 'Preferencias y Servicios',
    bankAccount: 'Datos Bancarios para Cobro',
    pixKey: 'Clave Bancaria / PIX',
    escrowProtected: 'Pago 100% Protegido en Garantía (Escrow)',
    escrowNotice: 'El dinero se libera al acompañante tras confirmación mutua del servicio.',
    loyaltyPoints: 'Rendezvous Club - Puntos',
    e2eeEncrypted: 'Encriptación de Extremo a Extremo (E2EE)',
    disappearingMessages: 'Mensajes Temporales',
    reportUser: 'Denunciar Perfil',
    emergencySafety: 'Centro de Seguridad SOS',
    biometricUnlock: 'Autenticación Biométrica',
    auditLogs: 'Registros de Auditoría',
    exportPdf: 'Exportar Reporte PDF',
    exportExcel: 'Exportar a Excel (XLSX)'
  },
  fr: {
    appName: 'Rendezvous',
    tagline: 'Rencontres Exclusives, Radar & Guide des Motels',
    radar: 'Radar',
    moteis: 'Guide Motels',
    messages: 'Discussions',
    companion: 'Escorte VIP',
    profile: 'Mon Profil',
    admin: 'Panneau Admin',
    support: 'Support 24/7',
    searchPlaceholder: 'Rechercher profils ou suites...',
    filterTitle: 'Filtres Avancés',
    distance: 'Distance',
    onlineNow: 'En Ligne',
    verifiedOnly: 'Profils Vérifiés',
    companionOnly: 'Escortes VIP',
    bookMeeting: 'Prendre Rendez-vous',
    bookSuite: 'Réserver Suite',
    hourlyRate: 'Tarif Horaire',
    services: 'Préférences & Services',
    bankAccount: 'Coordonnées Bancaires',
    pixKey: 'Clé Virement / PIX',
    escrowProtected: 'Paiement Sécurisé avec Séquestre',
    escrowNotice: 'Fonds débloqués pour l’escorte après validation mutuelle du rendez-vous.',
    loyaltyPoints: 'Rendezvous Club - Points',
    e2eeEncrypted: 'Chiffrement de Bout en Bout (E2EE)',
    disappearingMessages: 'Messages Éphémères',
    reportUser: 'Signaler Profil',
    emergencySafety: 'Centre de Sécurité & SOS',
    biometricUnlock: 'Authentification Biométrique',
    auditLogs: 'Journaux d’Audit & RGPD',
    exportPdf: 'Exporter Rapport PDF',
    exportExcel: 'Exporter vers Excel (XLSX)'
  }
};
