import React, { useState } from 'react';
import { 
  BedDouble, 
  MapPin, 
  Star, 
  Sparkles, 
  SlidersHorizontal, 
  ShieldCheck, 
  Flame, 
  Waves, 
  Tv, 
  Car, 
  Check, 
  Clock, 
  ChevronRight,
  PhoneCall
} from 'lucide-react';
import { PartnerMotel, MotelSuite } from '../../types';

interface GuiaMoteisCatalogProps {
  motels: PartnerMotel[];
  onSelectSuite: (motel: PartnerMotel, suite: MotelSuite) => void;
  onOpenReviews: (motel: PartnerMotel) => void;
}

export const GuiaMoteisCatalog: React.FC<GuiaMoteisCatalogProps> = ({
  motels,
  onSelectSuite,
  onOpenReviews
}) => {
  const [selectedAmenityFilter, setSelectedAmenityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMotels = motels.filter((motel) => {
    const matchesQuery = 
      motel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      motel.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesQuery) return false;

    if (selectedAmenityFilter === 'hydro') {
      return motel.suites.some((s) => s.hasHydro);
    }
    if (selectedAmenityFilter === 'pool') {
      return motel.suites.some((s) => s.hasPool);
    }
    if (selectedAmenityFilter === 'darkroom') {
      return motel.suites.some((s) => s.hasDarkRoom);
    }
    if (selectedAmenityFilter === 'sauna') {
      return motel.suites.some((s) => s.hasSauna);
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-neutral-950 text-neutral-100 p-3 sm:p-4 space-y-4">
      {/* Guia de Motéis Brand Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-neutral-900 via-rose-950/40 to-neutral-900 border border-neutral-800 p-4 overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold uppercase tracking-wider">
                API Oficial GuiadeMoteis Partner
              </span>
              <span className="text-[11px] text-neutral-400">·</span>
              <span className="text-[11px] text-emerald-400 font-semibold">Reserva Instantânea com Desconto</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Suítes de Luxo & Motéis Próximos
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5 max-w-xl">
              Fotos reais inspecionadas, privacidade blindada, check-in discreto por QR Code e acúmulo de pontos no Rendezvous Club.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-2 rounded-xl bg-neutral-950/80 border border-neutral-800 text-center">
              <div className="text-[10px] text-neutral-400">Economia Média</div>
              <div className="text-xs font-bold text-rose-400">Até 25% OFF</div>
            </div>
          </div>
        </div>
      </div>

      {/* Amenity Filter Quick Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          { id: 'all', label: 'Todos os Estabelecimentos' },
          { id: 'pool', label: '🏊 Piscina Aquecida Privativa' },
          { id: 'hydro', label: '🛁 Hidromassagem / Ofurô' },
          { id: 'darkroom', label: '🖤 Dark Room & Fetiche' },
          { id: 'sauna', label: '🔥 Sauna Integrada' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedAmenityFilter(tab.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-xl border font-medium transition-colors ${
              selectedAmenityFilter === tab.id
                ? 'bg-rose-600 border-rose-500 text-white shadow-xs'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Motéis List */}
      <div className="space-y-4">
        {filteredMotels.map((motel) => (
          <div
            key={motel.id}
            className="rounded-3xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-xl hover:border-neutral-700 transition-colors"
          >
            {/* Motel Header Overview */}
            <div className="p-4 sm:p-5 border-b border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-rose-400">{motel.brand}</span>
                  <span className="text-neutral-600">·</span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{motel.rating}</span>
                    <button 
                      onClick={() => onOpenReviews(motel)}
                      className="text-neutral-400 hover:text-white underline font-normal ml-1 text-[11px]"
                    >
                      ({motel.reviewCount} avaliações)
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white">{motel.name}</h3>

                <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{motel.address} - {motel.neighborhood}</span>
                  <span className="text-neutral-500">·</span>
                  <span className="text-rose-400 font-semibold">{motel.distanceKm} km de distância</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-bold text-xs">
                  {motel.discountBadge}
                </span>
              </div>
            </div>

            {/* Suites Display for this Motel */}
            <div className="p-4 sm:p-5 space-y-4">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Suítes Disponíveis para Reserva Imediata
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {motel.suites.map((suite) => (
                  <div
                    key={suite.id}
                    className="rounded-2xl bg-neutral-950 border border-neutral-800/80 hover:border-rose-500/40 p-3.5 flex flex-col justify-between transition-all group"
                  >
                    <div>
                      {/* Real Suite Photo */}
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-3 bg-neutral-900">
                        <img
                          src={suite.photoUrl}
                          alt={suite.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                          Disponível Agora
                        </div>
                        {suite.hasPool && (
                          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-blue-950/80 backdrop-blur-md text-[10px] font-semibold text-blue-300 border border-blue-500/30 flex items-center gap-1">
                            <Waves className="w-3 h-3" />
                            Piscina Térmica
                          </div>
                        )}
                      </div>

                      {/* Suite Name & Description */}
                      <h5 className="text-sm font-bold text-white mb-1">{suite.name}</h5>
                      <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed mb-3">
                        {suite.description}
                      </p>

                      {/* Suite Amenities badges */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {suite.amenities.slice(0, 4).map((amenity, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Suite Rates & Book Button */}
                    <div className="pt-3 border-t border-neutral-900 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] text-neutral-400">A partir de</div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-bold text-white font-mono">
                            R$ {suite.pricePerHour}
                          </span>
                          <span className="text-[10px] text-neutral-400">/ período</span>
                        </div>
                        <div className="text-[10px] text-rose-400">
                          Pernoite: R$ {suite.priceOvernight}
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectSuite(motel, suite)}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shadow-md shadow-rose-900/30 flex items-center gap-1.5 active:scale-95"
                      >
                        <BedDouble className="w-3.5 h-3.5" />
                        <span>Reservar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
