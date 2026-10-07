import React, { useState } from 'react';
import { 
  X, 
  Headphones, 
  Send, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';

interface SupportChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SupportMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

export const SupportChatModal: React.FC<SupportChatModalProps> = ({
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: 'sup_01',
      sender: 'agent',
      text: 'Olá! Sou o Concierge Rendezvous 24h. Como posso ajudar você hoje com sua reserva de motel, garantia de acompanhante ou segurança do perfil?',
      time: 'Agora'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: SupportMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setIsAgentTyping(true);
    setTimeout(() => {
      setIsAgentTyping(false);
      const agentReply: SupportMessage = {
        id: `agent_${Date.now()}`,
        sender: 'agent',
        text: 'Compreendo perfeitamente. Sua solicitação foi protocolada sob o ticket #RDV-SUP-8921. O valor em custódia está 100% resguardado e nosso mediador já verificou os detalhes. Precisa de algo mais?',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, agentReply]);
    }, 1500);
  };

  const handleQuickTopic = (topic: string) => {
    setInputText(topic);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md h-[88vh] rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Support Header */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center font-bold shadow-md">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Suporte Concierge 24/7</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-neutral-400">Atendimento humano & mediação de disputas</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dispute Resolution Status Strip */}
        <div className="px-4 py-2 bg-neutral-950/80 border-b border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400 shrink-0">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Mediação de Custódia Prioritária
          </span>
          <span className="text-neutral-500">Tempo de resposta: &lt; 2 min</span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-900/60 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-rose-600 text-white rounded-br-xs shadow-md'
                    : 'bg-neutral-800 text-neutral-200 rounded-bl-xs border border-neutral-700/60'
                }`}
              >
                <p>{m.text}</p>
                <div
                  className={`mt-1 text-[9px] text-right ${
                    m.sender === 'user' ? 'text-rose-200' : 'text-neutral-400'
                  }`}
                >
                  {m.time}
                </div>
              </div>
            </div>
          ))}

          {isAgentTyping && (
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>Concierge está digitando uma resposta...</span>
            </div>
          )}
        </div>

        {/* Quick Question Buttons */}
        <div className="p-2 bg-neutral-950 border-t border-neutral-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-[11px]">
          <button
            onClick={() => handleQuickTopic('Como cancelar uma reserva de suíte no Guia de Motéis?')}
            className="whitespace-nowrap px-2.5 py-1 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300"
          >
            🏨 Cancelar Suíte
          </button>
          <button
            onClick={() => handleQuickTopic('Meu encontro com o acompanhante não ocorreu, quero estorno do escrow.')}
            className="whitespace-nowrap px-2.5 py-1 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300"
          >
            🛡️ Abrir Disputa Escrow
          </button>
          <button
            onClick={() => handleQuickTopic('Como atualizar minha chave PIX de recebimento?')}
            className="whitespace-nowrap px-2.5 py-1 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300"
          >
            💰 Dúvida de Saque PIX
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua dúvida ou disputa..."
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-40 transition-colors shadow-md shadow-rose-900/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
