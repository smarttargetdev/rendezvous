import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Lock, 
  ShieldCheck, 
  Clock, 
  Image, 
  Mic, 
  BedDouble, 
  Calendar, 
  Sparkles, 
  CheckCheck,
  Check,
  Flame,
  AlertCircle
} from 'lucide-react';
import { UserProfile, ChatMessage, PartnerMotel } from '../../types';

interface E2EEChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  peerUser: UserProfile | null;
  partnerMotels: PartnerMotel[];
  onOpenBookingModal: (peer: UserProfile) => void;
  onOpenMotelModal: () => void;
}

export const E2EEChatDrawer: React.FC<E2EEChatDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  peerUser,
  partnerMotels,
  onOpenBookingModal,
  onOpenMotelModal
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [disappearSeconds, setDisappearSeconds] = useState<number>(0);
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation with realistic encrypted messages
  useEffect(() => {
    if (!peerUser) return;

    const initialMsgs: ChatMessage[] = [
      {
        id: 'msg_01',
        senderId: peerUser.id,
        receiverId: currentUser.id,
        text: peerUser.role === 'companion' 
          ? `Olá! Vi seu perfil no radar Rendezvous. Se estiver buscando companhia exclusiva ou pernoite em suíte privativa, podemos alinhar com total discrição.`
          : `E aí, vi que você está pertinho pelo radar! Curte tomar um drink mais tarde?`,
        timestamp: '17:15',
        isEncrypted: true,
        status: 'read'
      }
    ];

    setMessages(initialMsgs);
  }, [peerUser, currentUser.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPeerTyping]);

  if (!isOpen || !peerUser) return null;

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: peerUser.id,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isEncrypted: true,
      isDisappearing: disappearSeconds > 0,
      disappearSeconds: disappearSeconds > 0 ? disappearSeconds : undefined,
      status: 'delivered'
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulate peer typing and realistic E2EE response
    setTimeout(() => {
      setIsPeerTyping(true);
      setTimeout(() => {
        setIsPeerTyping(false);
        const replyText = peerUser.role === 'companion'
          ? `Perfeito! A confirmação e garantia de custódia podem ser feitas aqui mesmo pelo app. Já reservei a suíte no Guia de Motéis ou prefere em outro local?`
          : `Gostei da ideia! A que horas você costuma estar livre?`;

        setMessages((prev) => [
          ...prev,
          {
            id: `msg_reply_${Date.now()}`,
            senderId: peerUser.id,
            receiverId: currentUser.id,
            text: replyText,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            isEncrypted: true,
            status: 'read'
          }
        ]);
      }, 1600);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end sm:justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full sm:max-w-lg h-full sm:h-[90vh] bg-neutral-900 border border-neutral-800 rounded-none sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        {/* Chat Top Header */}
        <div className="p-3.5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <img
                src={peerUser.avatar}
                alt={peerUser.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500"
              />
              {peerUser.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-neutral-950" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-white truncate">{peerUser.name}</h4>
                {peerUser.role === 'companion' && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                    VIP
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                <span className="text-rose-400 font-semibold">{peerUser.distanceKm} km</span>
                <span>·</span>
                <span className="text-emerald-400 flex items-center gap-0.5">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  E2EE Ativo
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Companion Quick Booking button in chat */}
            {peerUser.role === 'companion' && (
              <button
                onClick={() => onOpenBookingModal(peerUser)}
                className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 transition-colors"
                title="Agendar Encontro Protegido"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Agendar</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* E2EE Security & Disappearing Notice Strip */}
        <div className="px-3.5 py-1.5 bg-neutral-950/80 border-b border-neutral-800/60 flex items-center justify-between text-[10px] text-neutral-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Criptografia RSA-4096 / AES-256-GCM. Hash da sessão: 8A4F...D901</span>
          </div>

          {/* Disappearing timer selector */}
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-rose-400" />
            <select
              value={disappearSeconds}
              onChange={(e) => setDisappearSeconds(Number(e.target.value))}
              className="bg-neutral-900 border border-neutral-800 text-neutral-300 rounded px-1 py-0.5 text-[10px] focus:outline-none"
            >
              <option value="0">Permanente</option>
              <option value="30">30 seg</option>
              <option value="300">5 min</option>
              <option value="86400">24 horas</option>
            </select>
          </div>
        </div>

        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-900/60">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed relative ${
                    isMe
                      ? 'bg-rose-600 text-white rounded-br-xs shadow-md shadow-rose-950/40'
                      : 'bg-neutral-800 text-neutral-100 rounded-bl-xs border border-neutral-700/60'
                  }`}
                >
                  <p>{msg.text}</p>

                  <div
                    className={`mt-1 flex items-center justify-end gap-1 text-[9px] ${
                      isMe ? 'text-rose-200' : 'text-neutral-400'
                    }`}
                  >
                    {msg.isDisappearing && (
                      <span className="flex items-center gap-0.5 text-amber-300">
                        <Flame className="w-2.5 h-2.5" />
                        Temporária
                      </span>
                    )}
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-rose-200" />}
                  </div>
                </div>
              </div>
            );
          })}

          {isPeerTyping && (
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>{peerUser.name} está digitando...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Badges (Invite to Motel, Companion appointment) */}
        <div className="p-2 bg-neutral-950 border-t border-neutral-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={onOpenMotelModal}
            className="whitespace-nowrap px-2.5 py-1 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-300 flex items-center gap-1.5 transition-colors"
          >
            <BedDouble className="w-3.5 h-3.5 text-rose-400" />
            <span>Sugerir Suíte Guia de Motéis</span>
          </button>

          {peerUser.role === 'companion' && (
            <button
              onClick={() => onOpenBookingModal(peerUser)}
              className="whitespace-nowrap px-2.5 py-1 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/60 text-[11px] text-amber-300 flex items-center gap-1.5 transition-colors font-medium"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Agendar Encontro com Caução Escrow</span>
            </button>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2 shrink-0">
          <button
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Enviar Foto Privativa E2EE"
          >
            <Image className="w-4 h-4" />
          </button>
          <button
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Áudio Criptografado"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Mensagem criptografada de ponta a ponta..."
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
          />

          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-40 transition-colors shadow-md shadow-rose-900/40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
