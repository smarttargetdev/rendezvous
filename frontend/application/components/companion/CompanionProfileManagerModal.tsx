import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  DollarSign, 
  ShieldCheck, 
  Building2, 
  Clock, 
  Upload, 
  Check, 
  Wallet, 
  ArrowUpRight, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { UserProfile, CompanionProfile, BankAccount } from '../../types';

interface CompanionProfileManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateCompanionProfile: (updatedData: CompanionProfile) => void;
  onRequestWithdrawal: (amount: number) => void;
}

export const CompanionProfileManagerModal: React.FC<CompanionProfileManagerModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateCompanionProfile,
  onRequestWithdrawal
}) => {
  if (!isOpen) return null;

  const currentData = currentUser.companionData || {
    hourlyRate: 350,
    twoHourRate: 600,
    overnightRate: 1800,
    services: ['Jantar romântico', 'Massagem relaxante', 'Companhia para eventos', 'Suíte privativa'],
    boundaries: ['Sem fotos sem consentimento', 'Respeito mútuo', 'Pagamento via plataforma'],
    availableSchedule: 'Seg a Sex após as 19h | Fins de semana 24h',
    suitePhotos: [
      '/src/assets/images/suite_luxury_motel_1791333366683.jpg'
    ],
    meetingLocations: ['motel', 'hotel'],
    bankAccount: {
      pixKeyType: 'cpf',
      pixKey: '342.***.***-09',
      bankName: 'Nubank (260)',
      agency: '0001',
      accountNumber: '8947291-3',
      accountType: 'corrente',
      fullName: currentUser.name,
      payoutFrequency: 'instantaneo'
    },
    walletBalance: 2450.00,
    pendingBalance: 700.00,
    totalEarned: 14200.00,
    completedBookings: 18,
    verifiedIdentity: true
  };

  const [hourlyRate, setHourlyRate] = useState(currentData.hourlyRate);
  const [overnightRate, setOvernightRate] = useState(currentData.overnightRate);
  const [pixKey, setPixKey] = useState(currentData.bankAccount.pixKey);
  const [bankName, setBankName] = useState(currentData.bankAccount.bankName);
  const [payoutFrequency, setPayoutFrequency] = useState(currentData.bankAccount.payoutFrequency);
  const [schedule, setSchedule] = useState(currentData.availableSchedule);
  const [isSaved, setIsSaved] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const handleSave = () => {
    const updated: CompanionProfile = {
      ...currentData,
      hourlyRate,
      overnightRate,
      availableSchedule: schedule,
      bankAccount: {
        ...currentData.bankAccount,
        pixKey,
        bankName,
        payoutFrequency: payoutFrequency as any
      }
    };
    onUpdateCompanionProfile(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleWithdraw = () => {
    if (currentData.walletBalance <= 0) return;
    onRequestWithdrawal(currentData.walletBalance);
    setWithdrawSuccess(true);
    setTimeout(() => setWithdrawSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Painel do Acompanhante VIP</h3>
              <p className="text-[10px] text-neutral-400">Gerenciamento de cachês, preferências e recebimentos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Financial Balance Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-neutral-950 via-amber-950/20 to-neutral-950 border border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-neutral-400">
                <Wallet className="w-4 h-4 text-amber-400" />
                <span className="font-semibold">Saldo Disponível para Saque</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                CUSTÓDIA SEGURA
              </span>
            </div>

            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="text-2xl font-bold text-white font-mono">
                  R$ {currentData.walletBalance.toFixed(2)}
                </span>
                <span className="text-[10px] text-neutral-400 ml-2">
                  (+ R$ {currentData.pendingBalance.toFixed(2)} retido em encontros agendados)
                </span>
              </div>
            </div>

            {withdrawSuccess ? (
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-[11px] flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Saque PIX de R$ {currentData.walletBalance.toFixed(2)} enviado com sucesso!</span>
              </div>
            ) : (
              <button
                onClick={handleWithdraw}
                disabled={currentData.walletBalance <= 0}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/40 transition-colors disabled:opacity-50"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Solicitar Saque Imediato via PIX</span>
              </button>
            )}
          </div>

          {/* Rates Settings */}
          <div className="space-y-3">
            <h4 className="font-bold text-neutral-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-rose-400" />
              Tabela de Valores & Honorários
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <label className="text-neutral-400 block mb-1">Valor por Hora (R$)</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 font-mono text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <label className="text-neutral-400 block mb-1">Pernoite (R$)</label>
                <input
                  type="number"
                  value={overnightRate}
                  onChange={(e) => setOvernightRate(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 font-mono text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className="font-bold text-neutral-200 block mb-1 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              Disponibilidade de Horários
            </label>
            <input
              type="text"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Bank Account Settings */}
          <div className="space-y-3">
            <h4 className="font-bold text-neutral-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              Dados Bancários para Repasse
            </h4>

            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2.5">
              <div>
                <label className="text-neutral-400 block mb-1">Chave PIX (CPF, E-mail ou Aleatória)</label>
                <input
                  type="text"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-neutral-400 block mb-1">Instituição Bancária</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Frequência de Pagamento</label>
                  <select
                    value={payoutFrequency}
                    onChange={(e) => setPayoutFrequency(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-rose-500 cursor-pointer"
                  >
                    <option value="instantaneo">Instantâneo após Encontro</option>
                    <option value="semanal">Semanal (Toda Sexta)</option>
                    <option value="mensal">Mensal (Último dia)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Photos of Preferred Suites */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-neutral-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-rose-400" />
                Fotos de Suítes Parceiras Preferidas
              </h4>
              <span className="text-[10px] text-neutral-500">Exibidas no seu perfil</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {currentData.suitePhotos.map((photo, i) => (
                <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-neutral-800">
                  <img src={photo} alt="Suíte" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] text-neutral-300">
                    Suíte Guia de Motéis
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between gap-3">
          {isSaved ? (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-4 h-4" /> Alterações salvas com sucesso!
            </span>
          ) : (
            <span className="text-[11px] text-neutral-500">
              Taxa da plataforma: 0% para membros VIP
            </span>
          )}

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-md shadow-rose-900/30"
          >
            Salvar Preferências
          </button>
        </div>
      </div>
    </div>
  );
};
