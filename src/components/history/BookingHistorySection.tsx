import React, { useState } from 'react';
import { 
  Calendar, 
  BedDouble, 
  Sparkles, 
  RotateCcw, 
  FileText, 
  QrCode, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  Search,
  ArrowRight,
  Filter,
  DollarSign
} from 'lucide-react';
import { CompanionBooking, MotelBooking, UserProfile, PartnerMotel } from '../../types';

interface BookingHistorySectionProps {
  companionBookings: CompanionBooking[];
  motelBookings: MotelBooking[];
  onOpenTransactionDetails: (item: { companion?: CompanionBooking; motel?: MotelBooking }) => void;
  onRepeatCompanionBooking: (booking: CompanionBooking) => void;
  onRepeatMotelBooking: (booking: MotelBooking) => void;
}

export const BookingHistorySection: React.FC<BookingHistorySectionProps> = ({
  companionBookings,
  motelBookings,
  onOpenTransactionDetails,
  onRepeatCompanionBooking,
  onRepeatMotelBooking
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'companion' | 'motel'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCompanion = companionBookings.filter((b) =>
    b.companionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.locationAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMotel = motelBookings.filter((b) =>
    b.motelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.suiteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCount = 
    (activeFilter === 'all' ? filteredCompanion.length + filteredMotel.length : 
     activeFilter === 'companion' ? filteredCompanion.length : filteredMotel.length);

  return (
    <div className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-rose-500" />
            <span>Histórico Completo de Contratações & Reservas</span>
          </h3>
          <p className="text-[11px] text-neutral-400">
            Transparência total, rastreabilidade de custódia e repetição com 1 clique
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs shrink-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              activeFilter === 'all' ? 'bg-neutral-800 text-rose-400 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Todos ({companionBookings.length + motelBookings.length})
          </button>
          <button
            onClick={() => setActiveFilter('companion')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              activeFilter === 'companion' ? 'bg-neutral-800 text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Acompanhantes ({companionBookings.length})
          </button>
          <button
            onClick={() => setActiveFilter('motel')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              activeFilter === 'motel' ? 'bg-neutral-800 text-rose-400 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Motéis ({motelBookings.length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por nome do acompanhante, motel, suíte ou código ID..."
          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
        />
      </div>

      {totalCount === 0 ? (
        <div className="p-6 text-center rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs">
          Nenhum agendamento ou reserva encontrada com os filtros selecionados.
        </div>
      ) : (
        <div className="space-y-3">
          {/* Companion Appointments Cards */}
          {(activeFilter === 'all' || activeFilter === 'companion') &&
            filteredCompanion.map((booking) => (
              <div
                key={booking.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors flex flex-col justify-between gap-3 text-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={booking.companionAvatar}
                      alt={booking.companionName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-bold text-white text-sm">{booking.companionName}</span>
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                          ACOMPANHANTE VIP
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-rose-400" />
                        <span>{booking.dateTime} ({booking.durationHours}h)</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-neutral-500" />
                        <span className="truncate max-w-[220px]">{booking.locationAddress}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-white font-mono">
                      R$ {booking.totalAmount.toFixed(2)}
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold text-[10px] inline-block mt-0.5">
                      {booking.escrowStatus === 'retido_plataforma' ? 'CUSTÓDIA ATIVA' : 'CONCLUÍDO'}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="pt-2.5 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenTransactionDetails({ companion: booking })}
                    className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Detalhes da Transação (#{booking.id})</span>
                  </button>

                  <button
                    onClick={() => onRepeatCompanionBooking(booking)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                    title="Repetir este agendamento com 1 clique"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Repetir com 1 Clique</span>
                  </button>
                </div>
              </div>
            ))}

          {/* Motel Bookings Cards */}
          {(activeFilter === 'all' || activeFilter === 'motel') &&
            filteredMotel.map((booking) => (
              <div
                key={booking.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors flex flex-col justify-between gap-3 text-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={booking.suitePhoto}
                      alt={booking.suiteName}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-bold text-white text-sm">{booking.motelName}</span>
                        <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold">
                          GUIA DE MOTÉIS
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-300 font-medium">{booking.suiteName}</div>
                      <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        <span>{booking.date} · {booking.periodHours}h de estadia</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-white font-mono">
                      R$ {booking.totalPrice.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold">
                      - R$ {booking.discountApplied.toFixed(2)} OFF
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="pt-2.5 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onOpenTransactionDetails({ motel: booking })}
                      className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Detalhes da Transação (#{booking.id})</span>
                    </button>
                    <span className="text-neutral-600 hidden sm:inline">·</span>
                    <span className="text-[10px] text-amber-400 hidden sm:inline">
                      +{booking.pointsEarned} pts creditados
                    </span>
                  </div>

                  <button
                    onClick={() => onRepeatMotelBooking(booking)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                    title="Reservar esta mesma suíte novamente com 1 clique"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reservar Novamente</span>
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
