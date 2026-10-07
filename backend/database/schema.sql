-- =========================================================================
-- Rendezvous Core Database Schema (MySQL 8.0 / 8.4 LTS)
-- Engine: InnoDB | Charset: utf8mb4 | Collate: utf8mb4_unicode_ci
-- Conformidade total com a LGPD (Lei nº 13.709/2018)
-- =========================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS companion_bookings;
DROP TABLE IF EXISTS motel_bookings;
DROP TABLE IF EXISTS motel_suites;
DROP TABLE IF EXISTS motel_partners;
DROP TABLE IF EXISTS companion_bank_accounts;
DROP TABLE IF EXISTS companion_profiles;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Tabela de Usuários (Clientes e Acompanhantes VIP)
CREATE TABLE users (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(120) NOT NULL,
    age SMALLINT UNSIGNED NOT NULL,
    role ENUM('client', 'companion') NOT NULL DEFAULT 'client',
    tribe VARCHAR(40) NULL, -- 'Ativo', 'Passivo', 'Versátil', 'Urso', 'Twink', 'Sarado', 'Daddy'
    bio TEXT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_photo_hash VARCHAR(128) NULL,
    biometric_public_key TEXT NULL,
    height VARCHAR(10) NULL,
    weight VARCHAR(10) NULL,
    prep_status VARCHAR(40) NOT NULL DEFAULT 'Privado',
    current_lat DECIMAL(9,6) NULL,
    current_lng DECIMAL(9,6) NULL,
    is_online BOOLEAN NOT NULL DEFAULT FALSE,
    ghost_mode BOOLEAN NOT NULL DEFAULT FALSE,
    loyalty_points INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_geo (current_lat, current_lng),
    INDEX idx_users_online (is_online, role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabela de Perfil de Acompanhantes VIP
CREATE TABLE companion_profiles (
    user_id VARCHAR(36) NOT NULL PRIMARY KEY,
    hourly_rate DECIMAL(10,2) NOT NULL,
    two_hour_rate DECIMAL(10,2) NOT NULL,
    overnight_rate DECIMAL(10,2) NOT NULL,
    services JSON NULL,
    boundaries JSON NULL,
    available_schedule TEXT NULL,
    wallet_balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    pending_escrow DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_earned DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    completed_bookings INT UNSIGNED NOT NULL DEFAULT 0,
    rating DECIMAL(3,2) NOT NULL DEFAULT 5.00,
    verified_identity BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_companion_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Dados Bancários e Chave PIX do Acompanhante para Repasses
CREATE TABLE companion_bank_accounts (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    companion_id VARCHAR(36) NOT NULL,
    pix_key_type ENUM('cpf', 'email', 'phone', 'random') NOT NULL,
    pix_key VARCHAR(255) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    agency VARCHAR(20) NOT NULL,
    account_number VARCHAR(30) NOT NULL,
    account_type ENUM('corrente', 'poupanca') NOT NULL DEFAULT 'corrente',
    full_name VARCHAR(150) NOT NULL,
    payout_frequency ENUM('instantaneo', 'semanal', 'mensal') NOT NULL DEFAULT 'instantaneo',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_bank_companion FOREIGN KEY (companion_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Estabelecimentos Parceiros do Guia de Motéis
CREATE TABLE motel_partners (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    neighborhood VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    lat DECIMAL(9,6) NOT NULL,
    lng DECIMAL(9,6) NOT NULL,
    rating DECIMAL(3,2) NOT NULL DEFAULT 4.90,
    review_count INT UNSIGNED NOT NULL DEFAULT 0,
    exclusive_discount_percent INT UNSIGNED NOT NULL DEFAULT 20,
    phone VARCHAR(30) NULL,
    is_open_24h BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_motel_geo (lat, lng)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Suítes dos Motéis Parceiros (Fotos Reais & Comodidades)
CREATE TABLE motel_suites (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    motel_id VARCHAR(64) NOT NULL,
    name VARCHAR(120) NOT NULL,
    price_per_hour DECIMAL(10,2) NOT NULL,
    price_overnight DECIMAL(10,2) NOT NULL,
    amenities JSON NULL,
    has_hydro BOOLEAN NOT NULL DEFAULT FALSE,
    has_pool BOOLEAN NOT NULL DEFAULT FALSE,
    has_sauna BOOLEAN NOT NULL DEFAULT FALSE,
    has_dark_room BOOLEAN NOT NULL DEFAULT FALSE,
    photo_url TEXT NOT NULL,
    description TEXT NULL,
    CONSTRAINT fk_suite_motel FOREIGN KEY (motel_id) REFERENCES motel_partners(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Reservas Diretas no Guia de Motéis com Check-in por QR Code
CREATE TABLE motel_bookings (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    motel_id VARCHAR(64) NOT NULL,
    suite_id VARCHAR(64) NOT NULL,
    booking_date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL,
    period_hours INT UNSIGNED NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    discount_applied DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    points_earned INT UNSIGNED NOT NULL DEFAULT 0,
    status ENUM('confirmada', 'em_andamento', 'concluida', 'cancelada') NOT NULL DEFAULT 'confirmada',
    qr_code_token VARCHAR(128) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_motel FOREIGN KEY (motel_id) REFERENCES motel_partners(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_suite FOREIGN KEY (suite_id) REFERENCES motel_suites(id) ON DELETE CASCADE,
    INDEX idx_booking_user (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Agendamento de Acompanhantes com Garantia Escrow
CREATE TABLE companion_bookings (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL,
    companion_id VARCHAR(36) NOT NULL,
    meeting_date TIMESTAMP NOT NULL,
    duration_hours SMALLINT UNSIGNED NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    escrow_status ENUM('retido_plataforma', 'liberado_ao_acompanhante', 'em_disputa', 'estornado') NOT NULL DEFAULT 'retido_plataforma',
    location_type ENUM('motel', 'hotel', 'domicilio', 'meu_local') NOT NULL,
    location_address TEXT NOT NULL,
    motel_booking_id VARCHAR(64) NULL,
    meeting_status ENUM('agendado', 'em_andamento', 'concluido', 'cancelado') NOT NULL DEFAULT 'agendado',
    payment_method ENUM('pix', 'cartao_credito', 'apple_pay', 'google_pay') NOT NULL DEFAULT 'pix',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_companion_bk_client FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_companion_bk_companion FOREIGN KEY (companion_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_companion_bk_motel FOREIGN KEY (motel_booking_id) REFERENCES motel_bookings(id) ON DELETE SET NULL,
    INDEX idx_escrow_status (escrow_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Sistema de Avaliações (Transparência Mútua)
CREATE TABLE reviews (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    target_type ENUM('motel', 'companion') NOT NULL,
    target_id VARCHAR(64) NOT NULL,
    rating TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NULL,
    hygiene_score TINYINT UNSIGNED NULL,
    privacy_score TINYINT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Logs de Auditoria & Conformidade LGPD (Imutável)
CREATE TABLE audit_logs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    actor_id VARCHAR(64) NOT NULL,
    ip_address VARCHAR(45) NOT NULL, -- Suporta IPv4 e IPv6
    category ENUM('auth', 'financial', 'moderation', 'lgpd', 'system') NOT NULL,
    action VARCHAR(80) NOT NULL,
    details JSON NOT NULL,
    status ENUM('success', 'flagged', 'blocked') NOT NULL DEFAULT 'success',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_actor_time (actor_id, created_at DESC),
    INDEX idx_audit_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
