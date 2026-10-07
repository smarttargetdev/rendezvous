import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Award, 
  Crown, 
  Zap, 
  Gift, 
  Check, 
  ArrowRight, 
  Percent, 
  BedDouble, 
  ShieldCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoyaltyClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  points: number;
  onRedeemReward: (rewardName: string, cost: number) => void;
}

export const LoyaltyClubModal: React.FC<LoyaltyClubModalProps> = ({
  isOpen,
  onClose,
  points,
  onRedeemReward
}) => {
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentTier = points >= 3000 ? 'VIP Obsidian' : points >= 1500 ? 'Diamond' : points >= 500 ? 'Gold' : 'Silver';
  const nextTierPoints = points >= 3000 ? 5000 : points >= 1500 ? 3000 : points >= 500 ? 1500 : 500;
  const progressPercent = Math.min(100, Math.round((points / nextTierPoints) * 100));

  const rewards = [
    {
      id: 'cupom_50',
      title: 'Cupom R$ 50 OFF no Guia de Motéis',
      cost: 400,
      description: 'Válido em qualquer suíte com banheira ou piscina nos motéis parceiros.',
      tag: 'Mais Popular'
    },
    {
      id: 'champagne_free',
      title: 'Champagne Cortesia na Chegada',
      cost: 650,
      description: 'Garrafa de espumante Chandon Brut servida diretamente na sua suíte.',
      tag: 'Exclusivo'
    },
    {
      id: 'boost_radar',
      title: 'Radar Boost 24h (Destaque VIP)',
      cost: 300,
      description: 'Apareça no topo de todos os radares da sua região com selo brilhante.',
      tag: 'Engajamento'
    },
    {
      id: 'vip_zero_fee',
      title: 'Isenção Total de Taxas por 30 Dias',
      cost: 1200,
      description: 'Taxa zero para contratação e recebimento de acompanhantes.',
      tag: 'VIP Obsidian'
    }
  ];

  const handleClaim = (reward: typeof rewards[0]) => {
    if (points < reward.cost) return;
    onRedeemReward(reward.title, reward.cost);
    setRedeemedCode(`RDV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 }
      });
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* Header with Luxury Obsidian Gradient */}
        <div className="p-5 bg-gradient-to-r from-neutral-950 via-rose-950/40 to-neutral-950 border-b border-neutral-800 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold border border-amber-500/40">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-white">Rendezvous Club</h3>
                <span className="px-2 py-0.5 rounded-md bg-amber-500 text-neutral-950 text-[10px] font-black">
                  {currentTier}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">Programa de fidelidade & benefícios exclusivos</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Points Balance Card */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 font-semibold">Seu Saldo Atual</span>
              <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                Pontos não expiram
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">{points}</span>
              <span className="text-amber-400 font-bold text-sm">pontos acumulados</span>
            </div>

            {/* Tier Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] text-neutral-400">
                <span>Progresso para o próximo nível</span>
                <span className="font-mono text-neutral-300">{points} / {nextTierPoints} pts</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Success Code Banner if redeemed */}
          {redeemedCode && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Recompensa Resgatada com Sucesso!</span>
              </div>
              <p className="text-[11px]">Seu voucher exclusivo é:</p>
              <div className="p-2 rounded-lg bg-neutral-950 font-mono text-sm font-bold text-amber-300 text-center tracking-wider">
                {redeemedCode}
              </div>
            </div>
          )}

          {/* How to accumulate points */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-amber-400 font-bold text-sm">+10 pts</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">A cada R$ 1 gasto no Guia de Motéis</div>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-rose-400 font-bold text-sm">+250 pts</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Por encontro seguro com acompanhante</div>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-cyan-400 font-bold text-sm">+100 pts</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Ao verificar selfie com selo azul</div>
            </div>
          </div>

          {/* Catalog of Redeemable Rewards */}
          <div className="space-y-3">
            <h4 className="font-bold text-neutral-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-rose-400" />
              Recompensas & Vouchers Disponíveis
            </h4>

            <div className="space-y-2.5">
              {rewards.map((reward) => {
                const canAfford = points >= reward.cost;
                return (
                  <div
                    key={reward.id}
                    className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-neutral-700 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{reward.title}</span>
                        <span className="px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-300 text-[9px] font-bold">
                          {reward.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed max-w-sm">
                        {reward.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-sm font-bold font-mono text-amber-400">{reward.cost}</span>
                        <span className="text-[10px] text-neutral-500 ml-1">pts</span>
                      </div>

                      <button
                        onClick={() => handleClaim(reward)}
                        disabled={!canAfford}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors shadow-xs ${
                          canAfford
                            ? 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer active:scale-95'
                            : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? 'Resgatar' : 'Pontos Insuficientes'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/60 flex items-center justify-between">
          <span className="text-[11px] text-neutral-400">
            Membros Obsidian têm acesso antecipado a suítes concorridas no fim de semana.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
