import { UserProfile, PartnerMotel, AuditLog, ReportedUserTicket, PushNotification } from '../types';

export const INITIAL_CURRENT_USER: UserProfile = {
  id: 'usr_me_01',
  name: 'Lucas Rossi',
  age: 28,
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  distanceKm: 0,
  bio: 'Arquiteto paulistano, apaixonado por design, viagens e noites memoráveis. Apreciador de bons vinhos e discrição.',
  role: 'client',
  tribe: 'Sarado',
  isOnline: true,
  isVerified: true,
  lastActive: 'Agora',
  height: '1.84m',
  weight: '82kg',
  prepStatus: 'Em uso de PrEP',
  tags: ['Design', 'Gastronomia', 'Vinho', 'Academia', 'Teatro'],
  lat: -23.5615,
  lng: -46.6560,
  photos: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80'
  ],
  companionData: {
    hourlyRate: 350,
    twoHourRate: 600,
    overnightRate: 1800,
    services: ['Jantar romântico', 'Massagem relaxante', 'Companhia para eventos', 'Suíte privativa'],
    boundaries: ['Sem fotos sem consentimento', 'Respeito mútuo', 'Pagamento via plataforma'],
    availableSchedule: 'Seg a Sex após as 19h | Fins de semana 24h',
    suitePhotos: [
      '/src/assets/images/suite_luxury_motel_1791333366683.jpg',
      '/src/assets/images/suite_presidential_pool_1791333383456.jpg'
    ],
    meetingLocations: ['motel', 'hotel'],
    bankAccount: {
      pixKeyType: 'cpf',
      pixKey: '342.***.***-09',
      bankName: 'Nubank (260)',
      agency: '0001',
      accountNumber: '8947291-3',
      accountType: 'corrente',
      fullName: 'Lucas R. M.',
      payoutFrequency: 'instantaneo'
    },
    walletBalance: 2450.00,
    pendingBalance: 700.00,
    totalEarned: 14200.00,
    completedBookings: 18,
    verifiedIdentity: true
  },
  rating: 4.95,
  reviewCount: 22
};

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'usr_02',
    name: 'Matheus Becker',
    age: 26,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    distanceKm: 0.4,
    bio: 'Personal trainer e modelo fitness. Procuro boas conversas ou companhia exclusiva para a noite. Alto nível.',
    role: 'companion',
    tribe: 'Sarado',
    isOnline: true,
    isVerified: true,
    lastActive: 'Agora',
    height: '1.87m',
    weight: '86kg',
    prepStatus: 'Em uso de PrEP',
    tags: ['Fitness', 'Massagem', 'Acompanhante VIP', 'Praia', 'Balada'],
    lat: -23.5630,
    lng: -46.6540,
    photos: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80'
    ],
    companionData: {
      hourlyRate: 400,
      twoHourRate: 700,
      overnightRate: 2200,
      services: ['Jantar', 'Massagem tântrica/relaxante', 'Final de semana em suíte', 'Eventos VIP'],
      boundaries: ['Uso obrigatório de preservativo', 'Ambiente seguro', 'Pontualidade'],
      availableSchedule: 'Todos os dias 14h às 04h',
      suitePhotos: [
        '/src/assets/images/suite_luxury_motel_1791333366683.jpg'
      ],
      meetingLocations: ['motel', 'hotel', 'domicilio'],
      bankAccount: {
        pixKeyType: 'email',
        pixKey: 'matheus.becker@rendezvous.app',
        bankName: 'Banco Itaú (341)',
        agency: '1540',
        accountNumber: '48392-1',
        accountType: 'corrente',
        fullName: 'Matheus Becker',
        payoutFrequency: 'instantaneo'
      },
      walletBalance: 4600.00,
      pendingBalance: 1200.00,
      totalEarned: 28400.00,
      completedBookings: 34,
      verifiedIdentity: true
    },
    rating: 4.98,
    reviewCount: 31
  },
  {
    id: 'usr_03',
    name: 'Rodrigo Fontes',
    age: 34,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    distanceKm: 0.9,
    bio: 'Advogado corporativo na Faria Lima. Curto encontros descontraídos após o trabalho, barzinho e discrição total.',
    role: 'client',
    tribe: 'Daddy',
    isOnline: true,
    isVerified: true,
    lastActive: '5 min atrás',
    height: '1.80m',
    weight: '79kg',
    prepStatus: 'Testado recente',
    tags: ['Negócios', 'Vinho', 'Jazz', 'Discrição', 'Viagens'],
    lat: -23.5680,
    lng: -46.6590,
    photos: [
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 5.0,
    reviewCount: 9
  },
  {
    id: 'usr_04',
    name: 'Gabriel Siqueira',
    age: 23,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    distanceKm: 1.2,
    bio: 'Estudante de artes visuais e modelo. Espontâneo, divertido e aberto a conexões autênticas.',
    role: 'companion',
    tribe: 'Twink',
    isOnline: false,
    isVerified: true,
    lastActive: '20 min atrás',
    height: '1.75m',
    weight: '64kg',
    prepStatus: 'Em uso de PrEP',
    tags: ['Arte', 'Música Indie', 'Fotografia', 'Suíte Romântica'],
    lat: -23.5550,
    lng: -46.6620,
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80'
    ],
    companionData: {
      hourlyRate: 300,
      twoHourRate: 500,
      overnightRate: 1500,
      services: ['Conversa amigável', 'Pernoite', 'Jantar', 'Companhia artística'],
      boundaries: ['Respeito total', 'Sem drogas', 'Higienização'],
      availableSchedule: 'Tardes e noites a combinar',
      suitePhotos: [
        '/src/assets/images/suite_presidential_pool_1791333383456.jpg'
      ],
      meetingLocations: ['motel', 'hotel'],
      bankAccount: {
        pixKeyType: 'cpf',
        pixKey: '419.***.***-81',
        bankName: 'Inter (077)',
        agency: '0001',
        accountNumber: '1928374-0',
        accountType: 'corrente',
        fullName: 'Gabriel Siqueira',
        payoutFrequency: 'instantaneo'
      },
      walletBalance: 1800.00,
      pendingBalance: 500.00,
      totalEarned: 9500.00,
      completedBookings: 14,
      verifiedIdentity: true
    },
    rating: 4.88,
    reviewCount: 17
  },
  {
    id: 'usr_05',
    name: 'Bruno Fagundes',
    age: 39,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    distanceKm: 1.8,
    bio: 'Barba cerrada, estilo urso, bem resolvido. Gosto de homens decididos, uma boa cerveja artesanal e momentos intensos.',
    role: 'client',
    tribe: 'Urso',
    isOnline: true,
    isVerified: true,
    lastActive: 'Agora',
    height: '1.82m',
    weight: '94kg',
    prepStatus: 'Indetectável',
    tags: ['Urso', 'Cerveja Artesanal', 'Churrasco', 'Direto ao Ponto'],
    lat: -23.5700,
    lng: -46.6500,
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    reviewCount: 14
  },
  {
    id: 'usr_06',
    name: 'Thiago Martins',
    age: 31,
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    distanceKm: 2.5,
    bio: 'Médico residente. Tempo livre escasso, por isso valorizo objetividade, higiene e discrição.',
    role: 'client',
    tribe: 'Versátil',
    isOnline: false,
    isVerified: true,
    lastActive: '1h atrás',
    height: '1.78m',
    weight: '76kg',
    prepStatus: 'Em uso de PrEP',
    tags: ['Medicina', 'Café', 'Cinema', 'Discrição'],
    lat: -23.5500,
    lng: -46.6700,
    photos: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.95,
    reviewCount: 8
  }
];

export const MOCK_PARTNER_MOTEIS: PartnerMotel[] = [
  {
    id: 'motel_01',
    name: 'Motel Lush (Ipiranga)',
    brand: 'Guia de Motéis Prime Partner',
    distanceKm: 2.1,
    address: 'Av. do Estado, 6600',
    neighborhood: 'Ipiranga',
    city: 'São Paulo - SP',
    rating: 4.92,
    reviewCount: 489,
    heroPhoto: '/src/assets/images/suite_luxury_motel_1791333366683.jpg',
    discountBadge: '20% OFF Rendezvous',
    exclusiveDiscountPercent: 20,
    phone: '(11) 2271-0011',
    lat: -23.5750,
    lng: -46.6210,
    guiaDeMoteisPartner: true,
    isOpen24h: true,
    suites: [
      {
        id: 'suite_lush_01',
        name: 'Suíte Lush Spa Privativo',
        photoUrl: '/src/assets/images/suite_luxury_motel_1791333366683.jpg',
        additionalPhotos: [
          '/src/assets/images/suite_presidential_pool_1791333383456.jpg',
          '/src/assets/images/rendezvous_hero_splash_1791333347900.jpg'
        ],
        pricePerHour: 180,
        priceOvernight: 540,
        amenities: ['Hidro Dupla com Cromoterapia', 'Teto Solar Retrátil', 'Som Bluetooth Surround', 'Smart TV 65"', 'Frigobar Completo', 'Garagem Privativa Automática'],
        hasHydro: true,
        hasPool: false,
        hasSauna: true,
        hasDarkRoom: false,
        hasDancePole: true,
        hasAirConditioner: true,
        hasGarage: true,
        description: 'Design contemporâneo assinado por arquitetos renomados. Banheira de hidromassagem com vista para jardim de inverno, iluminação dimerizável e privacidade absoluta.'
      },
      {
        id: 'suite_lush_02',
        name: 'Suíte Splendor com Piscina Aquecida',
        photoUrl: '/src/assets/images/suite_presidential_pool_1791333383456.jpg',
        additionalPhotos: [
          '/src/assets/images/suite_luxury_motel_1791333366683.jpg'
        ],
        pricePerHour: 260,
        priceOvernight: 780,
        amenities: ['Piscina Aquecida Privativa com Cascata', 'Sauna a Vapor', 'Pole Dance', 'Dark Room Iluminado', 'Ar Dual Zone', 'Adega de Vinhos'],
        hasHydro: true,
        hasPool: true,
        hasSauna: true,
        hasDarkRoom: true,
        hasDancePole: true,
        hasAirConditioner: true,
        hasGarage: true,
        description: 'A experiência definitiva de requinte e luxo. Piscina climatizada privativa, sauna integrada, cama super king size e cardápio gastronômico 24 horas assinado por chef executivo.'
      }
    ]
  },
  {
    id: 'motel_02',
    name: 'Harmony Motel',
    brand: 'Guia de Motéis Diamond',
    distanceKm: 3.4,
    address: 'Rod. Raposo Tavares, km 17',
    neighborhood: 'Butantã',
    city: 'São Paulo - SP',
    rating: 4.88,
    reviewCount: 312,
    heroPhoto: '/src/assets/images/suite_presidential_pool_1791333383456.jpg',
    discountBadge: '15% OFF + Champagne Grátis',
    exclusiveDiscountPercent: 15,
    phone: '(11) 3782-4400',
    lat: -23.5820,
    lng: -46.7200,
    guiaDeMoteisPartner: true,
    isOpen24h: true,
    suites: [
      {
        id: 'suite_harmony_01',
        name: 'Suíte Acqua Presidencial',
        photoUrl: '/src/assets/images/suite_presidential_pool_1791333383456.jpg',
        additionalPhotos: [
          '/src/assets/images/suite_luxury_motel_1791333366683.jpg'
        ],
        pricePerHour: 220,
        priceOvernight: 660,
        amenities: ['Piscina Térmica com Teto Abre e Fecha', 'Hidromassagem com Luzes LED', 'Pole Dance', 'Pista com Strobo', 'Home Theater JBL', 'Check-in por QR Code'],
        hasHydro: true,
        hasPool: true,
        hasSauna: true,
        hasDarkRoom: false,
        hasDancePole: true,
        hasAirConditioner: true,
        hasGarage: true,
        description: 'Ambiente espaçoso de dois andares com piscina aquecida privativa, iluminação cênica de balada e suíte com isolamento acústico premium.'
      }
    ]
  },
  {
    id: 'motel_03',
    name: 'Opium Motel Jardins',
    brand: 'Guia de Motéis Boutique',
    distanceKm: 1.1,
    address: 'Al. Lorena, 950',
    neighborhood: 'Jardins',
    city: 'São Paulo - SP',
    rating: 4.95,
    reviewCount: 220,
    heroPhoto: '/src/assets/images/rendezvous_hero_splash_1791333347900.jpg',
    discountBadge: '25% OFF Membro Obsidian',
    exclusiveDiscountPercent: 25,
    phone: '(11) 3088-9922',
    lat: -23.5650,
    lng: -46.6660,
    guiaDeMoteisPartner: true,
    isOpen24h: true,
    suites: [
      {
        id: 'suite_opium_01',
        name: 'Suíte Noir Sensual',
        photoUrl: '/src/assets/images/suite_luxury_motel_1791333366683.jpg',
        additionalPhotos: [],
        pricePerHour: 195,
        priceOvernight: 590,
        amenities: ['Espelhos Panorâmicos', 'Ofurô em Mármore Negro', 'Dark Room com Acessórios', 'Amenities Bvlgari', 'Garagem Blindada'],
        hasHydro: true,
        hasPool: false,
        hasSauna: false,
        hasDarkRoom: true,
        hasDancePole: false,
        hasAirConditioner: true,
        hasGarage: true,
        description: 'Conceito boutique no coração dos Jardins. Máxima discrição para encontros VIP com serviço de quarto de alta gastronomia e manobrista privativo.'
      }
    ]
  }
];

export const MOCK_NOTIFICATIONS: PushNotification[] = [
  {
    id: 'notif_01',
    title: 'Novo Match no Radar!',
    body: 'Você e Matheus Becker curtiram o perfil um do outro. Que tal puxar conversa?',
    type: 'match',
    timestamp: 'Há 4 min',
    read: false
  },
  {
    id: 'notif_02',
    title: 'Guia de Motéis: 20% OFF Relâmpago',
    body: 'Suíte Lush Spa com desconto exclusivo até a meia-noite para membros Rendezvous.',
    type: 'promotion',
    timestamp: 'Há 32 min',
    read: false
  },
  {
    id: 'notif_03',
    title: 'Pagamento Seguro Confirmado (Escrow)',
    body: 'R$ 700,00 retidos em garantia para a sessão com Matheus Becker. Liberação após o encontro.',
    type: 'booking',
    timestamp: 'Hoje, 14:20',
    read: true
  },
  {
    id: 'notif_04',
    title: 'Pontos Rendezvous Club Creditados',
    body: '+240 pontos acumulados pela sua última reserva. Você está a 60 pontos do nível Diamond!',
    type: 'loyalty',
    timestamp: 'Ontem',
    read: true
  }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud_891',
    timestamp: '2026-10-06 17:30:12',
    actor: 'usr_me_01 (Lucas)',
    ipAddress: '189.40.112.54 (São Paulo, BR)',
    action: 'BIOMETRIC_AUTH_SUCCESS',
    category: 'auth',
    details: 'Autenticação biométrica FaceID validada via WebAuthn API',
    status: 'success'
  },
  {
    id: 'aud_890',
    timestamp: '2026-10-06 17:15:40',
    actor: 'sistema_gateway',
    ipAddress: '10.0.4.12',
    action: 'ESCROW_FUNDS_HELD',
    category: 'financial',
    details: 'Depósito em garantia de R$ 700,00 para agendamento #BK-9842 processado via PIX',
    status: 'success'
  },
  {
    id: 'aud_889',
    timestamp: '2026-10-06 16:44:02',
    actor: 'usr_02 (Matheus)',
    ipAddress: '177.18.204.11',
    action: 'BANK_DATA_UPDATED',
    category: 'financial',
    details: 'Chave PIX atualizada e validada pelo SPB (Sistema de Pagamentos Brasileiro)',
    status: 'success'
  },
  {
    id: 'aud_888',
    timestamp: '2026-10-06 15:10:00',
    actor: 'mod_admin_01',
    ipAddress: '200.189.50.2',
    action: 'CONTENT_MODERATION_APPROVE',
    category: 'moderation',
    details: 'Selo de perfil verificado emitido após biometria facial com liveness detection',
    status: 'success'
  },
  {
    id: 'aud_887',
    timestamp: '2026-10-06 14:02:18',
    actor: 'usr_anon_94',
    ipAddress: '45.168.10.99',
    action: 'LGPD_CONSENT_REVOKE_PREVIEW',
    category: 'lgpd',
    details: 'Usuário solicitou exportação de dados em conformidade com art. 18 LGPD',
    status: 'success'
  }
];

export const MOCK_REPORTS: ReportedUserTicket[] = [
  {
    id: 'rep_102',
    reportedUserId: 'usr_fake_09',
    reportedUserName: 'Carlos M.',
    reportedUserAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    reporterId: 'usr_me_01',
    reason: 'perfil_falso',
    comment: 'Fotos de celebridade internacional tiradas do Instagram, pedindo adiantamento fora do app.',
    createdAt: 'Há 15 min',
    status: 'pendente'
  },
  {
    id: 'rep_101',
    reportedUserId: 'usr_spam_33',
    reportedUserName: 'Anônimo SP',
    reportedUserAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    reporterId: 'usr_03',
    reason: 'fraude_financeira',
    comment: 'Tentativa de phishing com link falso de motel.',
    createdAt: 'Há 2 horas',
    status: 'em_analise'
  }
];
