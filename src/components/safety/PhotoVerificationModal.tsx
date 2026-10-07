import React, { useState } from 'react';
import { 
  X, 
  Camera, 
  CheckCircle2, 
  Scan, 
  Sparkles, 
  ShieldCheck, 
  Smile, 
  Eye,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PhotoVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete: () => void;
}

export const PhotoVerificationModal: React.FC<PhotoVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerificationComplete
}) => {
  const [step, setStep] = useState<'intro' | 'scanning' | 'complete'>('intro');
  const [livenessStage, setLivenessStage] = useState(0);

  if (!isOpen) return null;

  const startScan = () => {
    setStep('scanning');
    setLivenessStage(1);

    setTimeout(() => {
      setLivenessStage(2);
      setTimeout(() => {
        setLivenessStage(3);
        setTimeout(() => {
          setStep('complete');
          onVerificationComplete();
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.5 }
            });
          } catch (e) {}
        }, 1200);
      }, 1200);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col overflow-hidden text-center p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'intro' && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/40">
              <Camera className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-1">Verificação de Perfil por Foto</h3>
              <p className="text-xs text-neutral-400 leading-relaxed px-2">
                Garanta o selo azul de autenticidade para comprovar que você é você mesmo. Perfis com selo verificado recebem 4x mais matches e prioridade.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-left text-xs space-y-1.5 text-neutral-300">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Como funciona o Liveness Check</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                A câmera irá solicitar um movimento rápido de cabeça para validar que não se trata de uma foto estática ou perfil clonado.
              </p>
            </div>

            <button
              onClick={startScan}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/40 transition-colors active:scale-95"
            >
              Iniciar Verificação Facial Agora
            </button>
          </div>
        )}

        {step === 'scanning' && (
          <div className="space-y-5 py-2">
            {/* Camera oval overlay simulator */}
            <div className="relative w-48 h-60 mx-auto rounded-[60px] bg-neutral-950 border-2 border-cyan-500/60 overflow-hidden flex flex-col items-center justify-center shadow-2xl">
              <div className="absolute inset-2 rounded-[52px] border border-dashed border-cyan-500/30 animate-pulse pointer-events-none" />

              {/* Simulated Face Outline */}
              <div className="w-28 h-36 rounded-[45px] border-2 border-cyan-400/50 flex flex-col items-center justify-center text-cyan-400">
                <Smile className="w-12 h-12 stroke-1" />
              </div>

              {/* Liveness Scanning Beam */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bounce top-1/3" />
            </div>

            {/* Instruction prompts based on stage */}
            <div className="space-y-1">
              <div className="text-xs font-bold text-white flex items-center justify-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>
                  {livenessStage === 1 && 'Posicione o rosto dentro do círculo...'}
                  {livenessStage === 2 && 'Vire levemente o rosto para a esquerda...'}
                  {livenessStage === 3 && 'Dê um sorriso para confirmar a vivacidade!'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">Mantenha a iluminação estável</p>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="space-y-4 py-2">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/40">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-1">Perfil Verificado com Sucesso!</h3>
              <p className="text-xs text-neutral-300 px-2">
                O selo oficial azul foi ativado no seu perfil e já está visível para todas as pessoas no radar.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs font-semibold text-cyan-400 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>+100 Pontos Rendezvous Club creditados!</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors"
            >
              Concluir & Voltar ao Radar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
