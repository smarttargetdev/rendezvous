import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ThumbsUp, 
  BedDouble 
} from 'lucide-react';
import { PartnerMotel } from '../../types';

interface MotelReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  motel: PartnerMotel | null;
  onSubmitReview: (rating: number, comment: string) => void;
}

export const MotelReviewModal: React.FC<MotelReviewModalProps> = ({
  isOpen,
  onClose,
  motel,
  onSubmitReview
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hygieneRating, setHygieneRating] = useState(5);
  const [privacyRating, setPrivacyRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !motel) return null;

  const handleSubmit = () => {
    onSubmitReview(rating, comment);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <h3 className="text-sm font-bold text-white">Avaliação Pós-Estadia</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 text-xs">
          {submitted ? (
            <div className="p-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-white text-base">Avaliação Publicada com Sucesso!</h4>
              <p className="text-neutral-400 text-xs">
                Obrigado por fortalecer a comunidade e a transparência no Guia de Motéis.
              </p>
              <div className="text-amber-400 font-bold text-xs pt-2">
                +50 Pontos Rendezvous Club creditados!
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
                <img
                  src={motel.heroPhoto}
                  alt={motel.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">{motel.name}</h4>
                  <p className="text-neutral-400 text-[11px]">{motel.address}</p>
                  <span className="text-emerald-400 text-[10px] font-semibold">
                    Avaliação Anônima & Verificada
                  </span>
                </div>
              </div>

              {/* Star Rating Selector */}
              <div className="text-center py-2">
                <div className="text-neutral-300 font-semibold mb-2">Nota Geral da Experiência</div>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          rating >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-neutral-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific criteria: Hygiene & Privacy */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="text-neutral-400 text-[11px] mb-1">Higiene & Limpeza</div>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setHygieneRating(n)}
                        className={`text-xs ${hygieneRating >= n ? 'text-amber-400' : 'text-neutral-700'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="text-neutral-400 text-[11px] mb-1">Discrição & Acústica</div>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setPrivacyRating(n)}
                        className={`text-xs ${privacyRating >= n ? 'text-amber-400' : 'text-neutral-700'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comment text */}
              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Comentário Detalhado</label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Conte como foi o atendimento, a banheira, o cardápio e o conforto da suíte..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-xs transition-colors shadow-md shadow-amber-950/40"
              >
                Enviar Avaliação Transparente
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
