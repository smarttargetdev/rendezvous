-- =========================================================================
-- Rendezvous Migration: 2026_10_06_optimize_indexes.sql
-- Adiciona índices de alta performance para radar geoespacial e histórico
-- Compatível com MySQL 8.0 e MySQL 8.4 LTS
-- =========================================================================

-- 1. Otimização de busca por geolocalização no radar em tempo real
ALTER TABLE users
  ADD INDEX idx_users_radar_geo (current_lat, current_lng, is_online, ghost_mode),
  ADD INDEX idx_users_radar_verified (role, is_verified, is_online, current_lat, current_lng),
  ADD INDEX idx_users_tribe_online (tribe, is_online);

-- 2. Otimização de consultas de histórico para acompanhantes e custódia escrow
ALTER TABLE companion_bookings
  ADD INDEX idx_comp_bookings_client_history (client_id, created_at DESC),
  ADD INDEX idx_comp_bookings_companion_history (companion_id, created_at DESC),
  ADD INDEX idx_comp_bookings_escrow_audit (escrow_status, meeting_status, created_at DESC),
  ADD INDEX idx_comp_bookings_meeting_date (companion_id, meeting_date, meeting_status);

-- 3. Otimização de consultas de histórico e check-in no Guia de Motéis
ALTER TABLE motel_bookings
  ADD INDEX idx_motel_bookings_user_history (user_id, created_at DESC),
  ADD INDEX idx_motel_bookings_partner (motel_id, status, booking_date),
  ADD INDEX idx_motel_bookings_token (qr_code_token);
