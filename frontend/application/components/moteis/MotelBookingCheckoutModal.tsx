import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  BedDouble, 
  QrCode, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  CreditCard, 
  Smartphone,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PartnerMotel, MotelSuite, MotelBooking } from '../../types';

interface MotelBookingCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  motel: PartnerMotel | null;
  suite: MotelSuite | null;
  onConfirmBooking: (booking: MotelBooking) => void;
}

export const MotelBookingCheckoutModal: React.FC<MotelBookingCheckoutModalProps> = ({
  isOpen,
  onClose,
  motel,
  suite,
  onConfirmBooking
}) => {
  const [periodType, setPeriodType] = useState<'period' | 'overnight'>('period');
  const [selectedPayment, setSelectedPayment] = useState<'pix' | 'credit' | 'apple_pay'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<MotelBooking | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  if (!isOpen || !motel || !suite) return null;

  const basePrice = periodType === 'period' ? suite.pricePerHour : suite.priceOvernight;
  const discountAmount = Math.round(basePrice * (motel.exclusiveDiscountPercent / 100));
  const finalPrice = basePrice - discountAmount;
  const pointsEarned = Math.round(finalPrice * 1.5);

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const newBooking: MotelBooking = {
        id: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
        motelId: motel.id,
        motelName: motel.name,
        suiteName: suite.name,
        suitePhoto: suite.photoUrl,
        date: 'Hoje, 2026-10-06',
        timeSlot: '21:30',
        periodHours: periodType === 'period' ? 4 : 12,
        totalPrice: finalPrice,
        discountApplied: discountAmount,
        pointsEarned: pointsEarned,
        status: 'confirmada',
        qrCodeToken: `RDV-VOUCHER-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        createdAt: new Date().toISOString()
      };

      setConfirmedBooking(newBooking);
      onConfirmBooking(newBooking);
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    }, 1500);
  };

  const handleCopyPix = () => {
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-white">
              {confirmedBooking ? 'Reserva Confirmada!' : 'Finalizar Reserva de Suíte'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
          {confirmedBooking ? (
            /* Confirmation Voucher Screen */
            <div className="text-center py-2 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-0.5">Voucher de Check-in Ativo</h4>
                <p className="text-neutral-400 text-xs">Apresente este voucher ou informe o código na recepção discreta.</p>
              </div>

              {/* QR Code Voucher Card */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-left space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5">
                  <div>
                    <div className="text-[10px] text-neutral-400">Código da Reserva</div>
                    <div className="font-mono font-bold text-white text-sm">{confirmedBooking.id}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    PAGO & CONFIRMADO
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0">
                    <QrCode className="w-full h-full text-black" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-white">{motel.name}</div>
                    <div className="text-neutral-400">{suite.name}</div>
                    <div className="text-[11px] text-rose-400 font-semibold">
                      Período de {confirmedBooking.periodHours} horas
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">Pontos Acumulados:</span>
                  <span className="font-bold text-amber-400">+{confirmedBooking.pointsEarned} pts Rendezvous</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-left text-neutral-400 text-[11px] space-y-1">
                <div className="font-semibold text-neutral-300">Privacidade Blindada</div>
                <div>Não há menção ao aplicativo na fatura ou comprovante bancário (Razão social corporativa neutra).</div>
              </div>

              <button
                onClick={onClose}
                className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors"
              >
                Concluir e Voltar
              </button>
            </div>
          ) : (
            /* Checkout Flow */
            <>
              {/* Suite Summary Header */}
              <div className="flex gap-3 p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
                <img
                  src={suite.photoUrl}
                  alt={suite.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] text-rose-400 font-semibold">{motel.name}</div>
                  <h4 className="text-sm font-bold text-white truncate">{suite.name}</h4>
                  <p className="text-[11px] text-neutral-400 line-clamp-1">{suite.description}</p>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Cancelamento flexível grátis</span>
                  </div>
                </div>
              </div>

              {/* Select Period: Standard 4h or Overnight */}
              <div>
                <label className="font-semibold text-neutral-300 block mb-2">Duração da Reserva</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPeriodType('period')}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      periodType === 'period'
                        ? 'bg-rose-600/20 border-rose-500 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <div className="font-bold text-xs">Período Padrão (4h)</div>
                    <div className="text-rose-400 font-mono font-bold mt-1">R$ {suite.pricePerHour}</div>
                  </button>

                  <button
                    onClick={() => setPeriodType('overnight')}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      periodType === 'overnight'
                        ? 'bg-rose-600/20 border-rose-500 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <div className="font-bold text-xs">Pernoite (12h)</div>
                    <div className="text-rose-400 font-mono font-bold mt-1">R$ {suite.priceOvernight}</div>
                  </button>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="font-semibold text-neutral-300 block mb-2">Forma de Pagamento Integrada</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'pix', label: 'PIX Instantâneo', sub: 'Aprovação 1s' },
                    { id: 'credit', label: 'Cartão de Crédito', sub: 'Até 3x s/ juros' },
                    { id: 'apple_pay', label: 'Apple / Google Pay', sub: '1 Toque' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedPayment(m.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-colors ${
                        selectedPayment === m.id
                          ? 'bg-rose-600/20 border-rose-500 text-white font-semibold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <div className="text-[11px] font-bold">{m.label}</div>
                      <div className="text-[9px] text-neutral-500 mt-0.5">{m.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing breakdown & Loyalty points */}
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex justify-between text-neutral-400">
                  <span>Valor Regular da Suíte:</span>
                  <span className="font-mono">R$ {basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Desconto Rendezvous ({motel.exclusiveDiscountPercent}% OFF):</span>
                  <span className="font-mono">- R$ {discountAmount.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-neutral-800 flex justify-between items-center text-sm font-bold text-white">
                  <span>Total Final a Pagar:</span>
                  <span className="text-rose-400 font-mono text-base">R$ {finalPrice.toFixed(2)}</span>
                </div>

                <div className="mt-2 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Você ganhará no Rendezvous Club:
                  </span>
                  <span className="font-bold text-amber-400">+{pointsEarned} pontos</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processando Pagamento Seguro...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirmar & Pagar R$ {finalPrice.toFixed(2)}</span>
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
