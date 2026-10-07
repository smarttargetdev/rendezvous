import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  BedDouble, 
  CreditCard, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  Info 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, CompanionBooking, PartnerMotel } from '../../types';

interface CompanionBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  companion: UserProfile | null;
  partnerMotels: PartnerMotel[];
  onConfirmBooking: (booking: CompanionBooking) => void;
}

export const CompanionBookingModal: React.FC<CompanionBookingModalProps> = ({
  isOpen,
  onClose,
  companion,
  partnerMotels,
  onConfirmBooking
}) => {
  const [duration, setDuration] = useState<1 | 2 | 12>(1);
  const [date, setDate] = useState('2026-10-07');
  const [time, setTime] = useState('21:00');
  const [locationType, setLocationType] = useState<'motel' | 'hotel' | 'domicilio'>('motel');
  const [selectedMotelId, setSelectedMotelId] = useState(partnerMotels[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao_credito' | 'apple_pay'>('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<CompanionBooking | null>(null);

  if (!isOpen || !companion || !companion.companionData) return null;

  const data = companion.companionData;
  const rate = duration === 1 ? data.hourlyRate : duration === 2 ? data.twoHourRate : data.overnightRate;
  const platformFee = 0; // VIP fee waiver
  const totalAmount = rate;

  const handleBook = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const booking: CompanionBooking = {
        id: `APPT-${Math.floor(100000 + Math.random() * 900000)}`,
        companionId: companion.id,
        companionName: companion.name,
        companionAvatar: companion.avatar,
        clientId: 'usr_me_01',
        clientName: 'Lucas Rossi',
        dateTime: `${date} às ${time}`,
        durationHours: duration,
        totalAmount: totalAmount,
        escrowStatus: 'retido_plataforma',
        locationType: locationType,
        locationAddress: locationType === 'motel' ? partnerMotels.find(m => m.id === selectedMotelId)?.name || 'Motel Parceiro' : 'Endereço Combinado Privativo',
        motelPartnerBookingId: locationType === 'motel' ? selectedMotelId : undefined,
        meetingStatus: 'agendado',
        createdAt: new Date().toISOString(),
        paymentMethod: paymentMethod
      };

      setBookingConfirmed(booking);
      onConfirmBooking(booking);
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-white">
              {bookingConfirmed ? 'Encontro Agendado com Sucesso!' : `Agendar Encontro com ${companion.name}`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
          {bookingConfirmed ? (
            <div className="text-center py-2 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-0.5">Custódia Garantida & Notificação Enviada</h4>
                <p className="text-neutral-400 text-xs">
                  Notificação push enviada para {companion.name}. O valor foi retido em conta escrow protegida.
                </p>
              </div>

              {/* Booking Summary Ticket */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-left space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                  <span className="font-mono text-neutral-400">ID: {bookingConfirmed.id}</span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                    GARANTIA ESCROW
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={companion.avatar}
                    alt={companion.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-500"
                  />
                  <div>
                    <div className="font-bold text-white text-sm">{companion.name}</div>
                    <div className="text-neutral-400">{bookingConfirmed.dateTime}</div>
                    <div className="text-rose-400 font-semibold">{bookingConfirmed.locationAddress}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-neutral-400">Valor em Garantia:</span>
                  <span className="text-base font-bold text-white font-mono">
                    R$ {bookingConfirmed.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-left text-[11px] text-neutral-400 space-y-1">
                <div className="font-semibold text-neutral-200">Como funciona a liberação?</div>
                <div>
                  O dinheiro permanece bloqueado na plataforma até a conclusão do encontro. Somente após a confirmação mútua, os fundos são transferidos via PIX para o acompanhante.
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors"
              >
                Concluir e Voltar
              </button>
            </div>
          ) : (
            <>
              {/* Companion Info Card */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
                <img
                  src={companion.avatar}
                  alt={companion.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-400 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm">{companion.name}, {companion.age}</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">VIP</span>
                  </div>
                  <div className="text-neutral-400 text-[11px]">{data.availableSchedule}</div>
                  <div className="text-amber-400 text-[11px] font-semibold mt-0.5">
                    ★ {companion.rating} ({companion.reviewCount} avaliações)
                  </div>
                </div>
              </div>

              {/* Duration Options */}
              <div>
                <label className="font-semibold text-neutral-300 block mb-2">Duração do Encontro</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { d: 1, label: '1 Hora', price: data.hourlyRate },
                    { d: 2, label: '2 Horas', price: data.twoHourRate },
                    { d: 12, label: 'Pernoite', price: data.overnightRate }
                  ].map((opt) => (
                    <button
                      key={opt.d}
                      onClick={() => setDuration(opt.d as any)}
                      className={`p-2.5 rounded-xl border text-center transition-colors ${
                        duration === opt.d
                          ? 'bg-rose-600/20 border-rose-500 text-white font-semibold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs">{opt.label}</div>
                      <div className="text-rose-400 font-mono font-bold mt-1">R$ {opt.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Data</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Horário Previsto</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Meeting Location */}
              <div>
                <label className="font-semibold text-neutral-300 block mb-2">Local de Encontro</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[
                    { id: 'motel', label: 'Motel Parceiro' },
                    { id: 'hotel', label: 'Hotel' },
                    { id: 'domicilio', label: 'Meu Local' }
                  ].map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => setLocationType(loc.id as any)}
                      className={`p-2 rounded-xl border text-center text-xs transition-colors ${
                        locationType === loc.id
                          ? 'bg-rose-600/20 border-rose-500 text-white font-semibold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      {loc.label}
                    </button>
                  ))}
                </div>

                {locationType === 'motel' && (
                  <select
                    value={selectedMotelId}
                    onChange={(e) => setSelectedMotelId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-rose-500 cursor-pointer"
                  >
                    {partnerMotels.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.neighborhood} - {m.distanceKm} km)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Payment Escrow Protection Notice */}
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Garantia Escrow Rendezvous</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  O valor de R$ {totalAmount.toFixed(2)} fica bloqueado em conta segura e só é repassado ao acompanhante após o encontro. Proteção total contra cancelamentos e imprevistos.
                </p>

                <div className="pt-2 border-t border-neutral-800 flex justify-between items-center text-sm font-bold text-white">
                  <span>Total em Custódia:</span>
                  <span className="text-rose-400 font-mono text-base">R$ {totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Confirm Booking CTA */}
              <button
                onClick={handleBook}
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Bloqueando Custódia & Notificando...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Agendar & Reter R$ {totalAmount.toFixed(2)} em Garantia</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
