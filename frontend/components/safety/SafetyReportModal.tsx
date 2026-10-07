import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  UserX, 
  PhoneCall, 
  FileText, 
  Trash2, 
  Check, 
  Download,
  Lock,
  HeartHandshake
} from 'lucide-react';
import { UserProfile } from '../../types';

interface SafetyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser?: UserProfile | null;
  onSubmitReport: (reason: string, comment: string) => void;
  onBlockUser: (userId: string) => void;
}

export const SafetyReportModal: React.FC<SafetyReportModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  onSubmitReport,
  onBlockUser
}) => {
  const [activeTab, setActiveTab] = useState<'report' | 'sos' | 'lgpd'>('report');
  const [selectedReason, setSelectedReason] = useState('perfil_falso');
  const [comment, setComment] = useState('');
  const [reportedSubmitted, setReportedSubmitted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  if (!isOpen) return null;

  const handleReport = () => {
    onSubmitReport(selectedReason, comment);
    setReportedSubmitted(true);
    setTimeout(() => {
      setReportedSubmitted(false);
      onClose();
    }, 1800);
  };

  const handleBlock = () => {
    if (targetUser) {
      onBlockUser(targetUser.id);
      setIsBlocked(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-white">Segurança, Denúncia & LGPD</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex p-2 bg-neutral-950 border-b border-neutral-800 text-xs">
          <button
            onClick={() => setActiveTab('report')}
            className={`flex-1 py-1.5 rounded-xl font-medium transition-colors ${
              activeTab === 'report' ? 'bg-neutral-800 text-rose-400 font-bold' : 'text-neutral-400'
            }`}
          >
            Denunciar
          </button>
          <button
            onClick={() => setActiveTab('sos')}
            className={`flex-1 py-1.5 rounded-xl font-medium transition-colors ${
              activeTab === 'sos' ? 'bg-neutral-800 text-amber-400 font-bold' : 'text-neutral-400'
            }`}
          >
            Botão SOS
          </button>
          <button
            onClick={() => setActiveTab('lgpd')}
            className={`flex-1 py-1.5 rounded-xl font-medium transition-colors ${
              activeTab === 'lgpd' ? 'bg-neutral-800 text-cyan-400 font-bold' : 'text-neutral-400'
            }`}
          >
            Direitos LGPD
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
          {activeTab === 'report' && (
            <>
              {targetUser && (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <img
                    src={targetUser.avatar}
                    alt={targetUser.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-white">{targetUser.name}, {targetUser.age}</div>
                    <div className="text-[11px] text-neutral-400">Denunciando este perfil</div>
                  </div>
                </div>
              )}

              {reportedSubmitted ? (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-700 text-center space-y-2">
                  <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-white text-sm">Denúncia Recebida com Prioridade</h4>
                  <p className="text-[11px] text-emerald-200">
                    Nossa equipe de moderação 24/7 já colocou o perfil em análise preventiva. Obrigado por manter a comunidade segura.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="font-semibold text-neutral-300 block mb-2">Motivo da Denúncia</label>
                    <div className="space-y-1.5">
                      {[
                        { id: 'perfil_falso', label: 'Perfil Falso ou Fotos de Terceiros (Catfish)' },
                        { id: 'fraude_financeira', label: 'Tentativa de Golpe ou Pagamento Externo' },
                        { id: 'assedio', label: 'Assédio, Comportamento Tóxico ou Ameaças' },
                        { id: 'foto_explicita_publica', label: 'Foto Explícita Pública no Perfil' }
                      ].map((item) => (
                        <label
                          key={item.id}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                            selectedReason === item.id
                              ? 'bg-rose-950/40 border-rose-600 text-rose-200'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="report_reason"
                            checked={selectedReason === item.id}
                            onChange={() => setSelectedReason(item.id)}
                            className="accent-rose-500"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-300 block mb-1">
                      Detalhes Adicionais (Confidencial)
                    </label>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Descreva o que ocorreu para que os moderadores tomem providências..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  {targetUser && (
                    <div className="pt-2 border-t border-neutral-800">
                      <button
                        onClick={handleBlock}
                        className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                          isBlocked
                            ? 'bg-neutral-800 border-neutral-700 text-neutral-400'
                            : 'bg-neutral-950 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
                        }`}
                      >
                        <UserX className="w-4 h-4 text-rose-400" />
                        <span>{isBlocked ? 'Usuário Bloqueado' : `Bloquear ${targetUser.name} Imediatamente`}</span>
                      </button>
                    </div>
                  )}

                  <button
                    onClick={handleReport}
                    className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-md shadow-rose-900/30"
                  >
                    Enviar Denúncia para Moderação
                  </button>
                </>
              )}
            </>
          )}

          {activeTab === 'sos' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/80 text-amber-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-white">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Central de Emergência e SOS</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Se você estiver em perigo imediato durante um encontro, use os botões rápidos abaixo para ligar para as autoridades ou compartilhar sua localização GPS criptografada.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href="tel:190"
                  className="p-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-center flex flex-col items-center justify-center gap-1 transition-colors"
                >
                  <PhoneCall className="w-5 h-5" />
                  <span>Polícia Militar (190)</span>
                </a>

                <a
                  href="tel:192"
                  className="p-3.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-center flex flex-col items-center justify-center gap-1 transition-colors"
                >
                  <HeartHandshake className="w-5 h-5 text-rose-400" />
                  <span>SAMU Emergência (192)</span>
                </a>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="font-semibold text-neutral-200">Compartilhar Rota em Tempo Real</div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Envie um link temporário com seu GPS ao vivo para um amigo de confiança. O link expira automaticamente em 3 horas.
                </p>
                <button
                  onClick={() => alert('Link de localização ao vivo copiado para a área de transferência!')}
                  className="w-full py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs font-medium hover:bg-neutral-800"
                >
                  Gerar Link de Rastreio Seguro
                </button>
              </div>
            </div>
          )}

          {activeTab === 'lgpd' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Lock className="w-4 h-4" />
                  <span>Conformidade com a LGPD (Lei nº 13.709/2018)</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Você tem controle irrestrito sobre todos os seus dados pessoais, metadados de geolocalização e histórico financeiro.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => alert('Download do arquivo JSON/PDF com todos os seus dados iniciado!')}
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 hover:text-white hover:bg-neutral-800 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>Baixar Cópia Completa dos Meus Dados (JSON/PDF)</span>
                  </div>
                  <span className="text-[10px] text-neutral-500">Art. 18 LGPD</span>
                </button>

                <button
                  onClick={() => alert('Seus dados de geolocalização em segundo plano foram excluídos.')}
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 hover:text-white hover:bg-neutral-800 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-amber-400" />
                    <span>Limpar Histórico de Geolocalização Imediatamente</span>
                  </div>
                  <span className="text-[10px] text-neutral-500">Instantâneo</span>
                </button>

                <button
                  onClick={() => alert('Para excluir a conta em definitivo, confirme o código enviado ao seu e-mail cadastrado.')}
                  className="w-full p-2.5 rounded-xl bg-red-950/30 border border-red-900/60 text-red-300 hover:bg-red-950/60 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-400" />
                    <span>Exclusão Permanente da Conta & Direito ao Esquecimento</span>
                  </div>
                  <span className="text-[10px] text-red-400">Irreversível</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
