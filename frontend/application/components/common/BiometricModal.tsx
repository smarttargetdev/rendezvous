import React, { useState } from 'react';
import { ShieldCheck, Fingerprint, Scan, CheckCircle2, Lock } from 'lucide-react';

interface BiometricModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
}

export const BiometricModal: React.FC<BiometricModalProps> = ({
  isOpen,
  onSuccess,
  onCancel,
  title = 'Autenticação Biométrica',
  description = 'Toque no sensor biométrico ou use FaceID para autenticar com segurança máxima.'
}) => {
  const [scanning, setScanning] = useState(false);
  const [verified, setVerified] = useState(false);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setVerified(true);
      setTimeout(() => {
        setVerified(false);
        onSuccess();
      }, 700);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-neutral-900 border border-neutral-800 p-6 text-center shadow-2xl relative overflow-hidden">
        {/* Subtle glow header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-rose-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="mx-auto w-16 h-16 rounded-2xl bg-neutral-800/80 border border-neutral-700/80 flex items-center justify-center mb-4 text-rose-500 relative">
          {verified ? (
            <CheckCircle2 className="w-9 h-9 text-emerald-400 animate-in zoom-in-75" />
          ) : scanning ? (
            <Scan className="w-9 h-9 animate-pulse text-rose-400" />
          ) : (
            <Fingerprint className="w-9 h-9" />
          )}

          {scanning && (
            <span className="absolute inset-0 rounded-2xl border-2 border-rose-500 animate-ping opacity-60" />
          )}
        </div>

        <h3 className="text-xl font-bold text-white mb-1.5">{title}</h3>
        <p className="text-xs text-neutral-400 leading-relaxed mb-6 px-2">{description}</p>

        <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 mb-6 text-left flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-200">Proteção Criptográfica Passkey</div>
            <div className="text-[11px] text-neutral-400">Chave privada isolada no Secure Enclave</div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleSimulateScan}
            disabled={scanning || verified}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {scanning ? (
              <>
                <Scan className="w-4 h-4 animate-spin" />
                <span>Verificando Biometria...</span>
              </>
            ) : verified ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Identidade Confirmada!</span>
              </>
            ) : (
              <>
                <Fingerprint className="w-4 h-4" />
                <span>Escanear Biometria / FaceID</span>
              </>
            )}
          </button>

          <button
            onClick={onCancel}
            className="w-full h-10 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors"
          >
            Cancelar ou Usar Senha PIN
          </button>
        </div>
      </div>
    </div>
  );
};
