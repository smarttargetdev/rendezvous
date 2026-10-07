import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  Lock, 
  CreditCard, 
  Calendar, 
  MapPin, 
  BedDouble, 
  Sparkles,
  FileText
} from 'lucide-react';
import { CompanionBooking, MotelBooking } from '../../types';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  companionBooking?: CompanionBooking | null;
  motelBooking?: MotelBooking | null;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  isOpen,
  onClose,
  companionBooking,
  motelBooking
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || (!companionBooking && !motelBooking)) return null;

  const isCompanion = !!companionBooking;
  const transactionId = isCompanion ? companionBooking.id : motelBooking!.id;
  const createdAt = isCompanion ? companionBooking.createdAt : motelBooking!.createdAt;
  const totalAmount = isCompanion ? companionBooking.totalAmount : motelBooking!.totalPrice;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(`TX-${transactionId}-HASH-9FA84210B`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReceipt = () => {
    alert(`Comprovante fiscal cifrado referente à transação #${transactionId} gerado com sucesso!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-rose-500">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Comprovante de Transação</h3>
              <p className="text-[10px] text-neutral-400 font-mono">#{transactionId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Status Badge & Amount Card */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-emerald-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Transação Registrada e Liquidada</span>
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              R$ {totalAmount.toFixed(2)}
            </div>
            <div className="text-[10px] text-neutral-400">
              {isCompanion 
                ? 'Custódia Escrow Protegida Rendezvous'
                : 'Reserva Direta Guia de Motéis'
              }
            </div>
          </div>

          {/* Details Block */}
          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
            <h4 className="font-bold text-neutral-200 uppercase tracking-wider text-[10px]">
              Dados da Operação
            </h4>

            {isCompanion ? (
              <>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">Acompanhante Contratado:</span>
                  <span className="font-bold text-white">{companionBooking.companionName}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">Data e Duração:</span>
                  <span className="text-neutral-200">{companionBooking.dateTime} ({companionBooking.durationHours}h)</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">Local de Atendimento:</span>
                  <span className="text-rose-400 font-medium truncate max-w-[200px]">
                    {companionBooking.locationAddress}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">Forma de Pagamento:</span>
                  <span className="font-mono text-neutral-200 uppercase">
                    {companionBooking.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">Status da Custódia:</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                    {companionBooking.escrowStatus === 'retido_plataforma' ? 'RETIDO EM GARANTIA' : 'LIBERADO COM SUCESSO'}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">Estabelecimento Parceiro:</span>
                  <span className="font-bold text-white">{motelBooking!.motelName}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">Suíte Selecionada:</span>
                  <span className="text-neutral-200">{motelBooking!.suiteName}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">Período Contratado:</span>
                  <span className="text-neutral-200">{motelBooking!.periodHours} horas</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">Desconto Exclusivo Aplicado:</span>
                  <span className="text-emerald-400 font-mono font-bold">- R$ {motelBooking!.discountApplied.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">Pontos Creditados no Clube:</span>
                  <span className="text-amber-400 font-mono font-bold">+{motelBooking!.pointsEarned} pts</span>
                </div>
              </>
            )}

            <div className="pt-2.5 border-t border-neutral-900 flex items-center justify-between text-[10px]">
              <span className="text-neutral-500">Hash Imutável SHA-256:</span>
              <button
                onClick={handleCopyHash}
                className="text-neutral-400 hover:text-white flex items-center gap-1 font-mono"
              >
                <span>9FA8...4210B</span>
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Privacy Descriptor Note */}
          <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>Descrição Sigilosa na Fatura</span>
            </div>
            <p>
              Identificador no extrato bancário: <span className="font-mono text-white font-semibold">"RDV SERVICOS CORP"</span>. Discrição absoluta garantida em conformidade com as diretrizes de privacidade.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between gap-2">
          <button
            onClick={handleDownloadReceipt}
            className="flex-1 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar Recibo PDF</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
