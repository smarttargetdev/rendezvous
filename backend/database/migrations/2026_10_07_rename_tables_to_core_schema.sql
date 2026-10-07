-- =========================================================================
-- Rendezvous Migration: 2026_10_07_rename_tables_to_core_schema.sql
-- Renomeia tabelas para o esquema simplificado e unificado do Rendezvous:
--   companion_profiles       -> companions
--   companion_bank_accounts  -> accounts
--   motel_partners           -> motels
--   motel_suites             -> suites
--   motel_bookings           -> bookings
--   companion_bookings       -> schedules
-- Compatível com MySQL 8.0 e MySQL 8.4 LTS
-- =========================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Renomeação das tabelas principais
RENAME TABLE companion_profiles TO companions;
RENAME TABLE companion_bank_accounts TO accounts;
RENAME TABLE motel_partners TO motels;
RENAME TABLE motel_suites TO suites;
RENAME TABLE motel_bookings TO bookings;
RENAME TABLE companion_bookings TO schedules;

SET FOREIGN_KEY_CHECKS = 1;
