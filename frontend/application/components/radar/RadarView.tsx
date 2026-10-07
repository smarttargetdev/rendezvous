import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  EyeOff, 
  Eye, 
  SlidersHorizontal, 
  CheckCircle, 
  Sparkles, 
  BedDouble, 
  Lock, 
  ShieldCheck, 
  Navigation,
  MessageCircle,
  Calendar,
  Layers,
  Grid3X3,
  Map as MapIcon,
  Radio
} from 'lucide-react';
import { UserProfile, PartnerMotel } from '../../types';
import { InteractiveRadarMap } from './InteractiveRadarMap';

interface RadarViewProps {
  users: UserProfile[];
  motels: PartnerMotel[];
  currentUser?: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  onSelectMotel: (motel: PartnerMotel) => void;
  onOpenFilter: () => void;
  activeFilterCount: number;
}

export const RadarView: React.FC<RadarViewProps> = ({
  users,
  motels,
  currentUser,
  onSelectUser,
  onSelectMotel,
  onOpenFilter,
  activeFilterCount
}) => {
  const [viewMode, setViewMode] = useState<'radar' | 'map' | 'grid'>('grid');
  const [ghostMode, setGhostMode] = useState(false);
  const [radarRange, setRadarRange] = useState<number>(3.0); // km

  // Filter users by range
  const visibleUsers = users.filter((u) => u.distanceKm <= radarRange);
  const visibleMotels = motels.filter((m) => m.distanceKm <= radarRange);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-950 text-neutral-100">
      {/* Subheader Toolbar */}
      <div className="p-3 bg-neutral-900/80 border-b border-neutral-800 flex items-center justify-between gap-2 shrink-0">
        {/* View Mode Toggle: Grid, Radar, Map */}
        <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              viewMode === 'grid'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>Grade</span>
          </button>
          <button
            onClick={() => setViewMode('radar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              viewMode === 'radar'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Radar</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              viewMode === 'map'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Mapa</span>
          </button>
        </div>

        {/* Right actions: Ghost Mode & Filter trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGhostMode(!ghostMode)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 transition-colors ${
              ghostMode
                ? 'bg-purple-950/60 border-purple-800 text-purple-300'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
            title="Modo Fantasma (Ficar Invisível)"
          >
            {ghostMode ? <EyeOff className="w-3.5 h-3.5 text-purple-400" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{ghostMode ? 'Invisível' : 'Visível'}</span>
          </button>

          <button
            onClick={onOpenFilter}
            className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 transition-colors ${
              activeFilterCount > 0
                ? 'bg-rose-950/60 border-rose-700 text-rose-300 font-semibold'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtros</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area based on View Mode */}
      {viewMode === 'map' ? (
        <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col">
          {/* Ghost mode banner notification */}
          {ghostMode && (
            <div className="p-2.5 bg-purple-950/80 border-b border-purple-800/80 flex items-center justify-between text-xs text-purple-200 shrink-0">
              <div className="flex items-center gap-2">
                <EyeOff className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Modo Fantasma ativo: sua localização está oculta para outros perfis no radar e mapa.</span>
              </div>
              <button
                onClick={() => setGhostMode(false)}
                className="text-[11px] underline text-purple-400 hover:text-purple-300 ml-2"
              >
                Desativar
              </button>
            </div>
          )}

          <InteractiveRadarMap
            users={users}
            motels={motels}
            currentUser={currentUser}
            radarRange={radarRange}
            onSelectUser={onSelectUser}
            onSelectMotel={onSelectMotel}
            onSwitchToList={() => setViewMode('grid')}
            onRangeChange={(range) => setRadarRange(range)}
            ghostMode={ghostMode}
          />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 relative">
          {/* Ghost mode banner notification */}
          {ghostMode && (
            <div className="mb-3 p-2.5 rounded-2xl bg-purple-950/40 border border-purple-800/60 flex items-center justify-between text-xs text-purple-200">
              <div className="flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Modo Fantasma ativo: sua localização está oculta para outros perfis no radar.</span>
              </div>
              <button
                onClick={() => setGhostMode(false)}
                className="text-[11px] underline text-purple-400 hover:text-purple-300"
              >
                Desativar
              </button>
            </div>
          )}

          {/* 1. GRID VIEW */}
          {viewMode === 'grid' && (
            <div className="space-y-4">
              {/* Quick Guia de Motéis Spotlight Strip */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-neutral-900 to-rose-950/40 border border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                      <BedDouble className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Guia de Motéis Parceiros</h4>
                      <p className="text-[10px] text-neutral-400">Descontos exclusivos até 25% OFF para encontros</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-rose-400 font-semibold uppercase tracking-wider">
                    {visibleMotels.length} Próximos
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {visibleMotels.slice(0, 2).map((motel) => (
                    <div
                      key={motel.id}
                      onClick={() => onSelectMotel(motel)}
                      className="cursor-pointer group flex items-center gap-3 p-2 rounded-xl bg-neutral-950/60 hover:bg-neutral-950 border border-neutral-800 hover:border-rose-500/50 transition-all"
                    >
                      <img
                        src={motel.heroPhoto}
                        alt={motel.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-lg object-cover group-hover:scale-105 transition-transform shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-semibold text-white truncate">{motel.name}</span>
                          <span className="text-[10px] text-rose-400 font-bold whitespace-nowrap">
                            {motel.distanceKm} km
                          </span>
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate">{motel.neighborhood}</div>
                        <div className="mt-1 flex items-center gap-2 text-[10px]">
                          <span className="text-emerald-400 font-medium">{motel.discountBadge}</span>
                          <span className="text-neutral-500">·</span>
                          <span className="text-amber-400 font-medium">★ {motel.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Profiles Grid */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Pessoas no seu Radar</span>
                    <span className="text-neutral-500">({visibleUsers.length})</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-neutral-500">Raio de até {radarRange} km</span>
                    <button
                      onClick={() => setViewMode('map')}
                      className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                    >
                      <MapIcon className="w-3.5 h-3.5" />
                      <span>Ver no Mapa</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {visibleUsers.map((user) => {
                    const isEscort = user.role === 'companion';
                    return (
                      <div
                        key={user.id}
                        onClick={() => onSelectUser(user)}
                        className="group cursor-pointer rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-rose-500/50 overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 relative"
                      >
                        {/* Photo Container */}
                        <div className="relative aspect-[3/4] w-full bg-neutral-800 overflow-hidden">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {/* Gradient Scrim for contrast */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                          {/* Top indicators: Online & Escort Badge */}
                          <div className="absolute top-2 left-2 flex items-center gap-1.5">
                            {user.isOnline && (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-medium text-emerald-400 border border-emerald-500/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Online
                              </span>
                            )}
                          </div>

                          {/* Escort VIP Badge */}
                          {isEscort && (
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-amber-500/90 text-neutral-950 font-extrabold text-[10px] shadow-md flex items-center gap-1">
                              <Sparkles className="w-3 h-3 fill-neutral-950" />
                              ACOMPANHANTE
                            </div>
                          )}

                          {/* Distance pill */}
                          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-medium text-white flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-rose-400" />
                            <span>{user.distanceKm < 1 ? `${Math.round(user.distanceKm * 1000)}m` : `${user.distanceKm} km`}</span>
                          </div>
                        </div>

                        {/* Card Info */}
                        <div className="p-2.5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <h4 className="text-xs font-bold text-white truncate">{user.name}, {user.age}</h4>
                              {user.isVerified && (
                                <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-[11px] text-neutral-400 line-clamp-1">{user.tribe} · {user.height}</div>
                          </div>

                          {/* Companion rate or client bio */}
                          <div className="mt-2 pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                            {isEscort && user.companionData ? (
                              <div className="w-full flex items-center justify-between">
                                <span className="text-[11px] font-bold text-rose-400">
                                  R$ {user.companionData.hourlyRate}/h
                                </span>
                                <span className="text-[10px] text-neutral-400">
                                  ★ {user.rating} ({user.reviewCount})
                                </span>
                              </div>
                            ) : (
                              <div className="text-[10px] text-neutral-400 truncate">
                                {user.tags.slice(0, 2).join(' · ')}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Floating quick toggle to Map View */}
              <div className="sticky bottom-3 flex justify-center pointer-events-none pt-4 pb-2">
                <button
                  onClick={() => setViewMode('map')}
                  className="pointer-events-auto px-4 py-2.5 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs shadow-2xl shadow-rose-950/90 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 border border-white/20"
                >
                  <MapIcon className="w-4 h-4 text-white" />
                  <span>Explorar no Mapa Geográfico Interativo</span>
                  <span className="px-2 py-0.5 rounded-full bg-black/40 text-amber-200 text-[10px]">
                    {visibleUsers.length + visibleMotels.length}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* 2. RADAR VIEW (Interactive 360 Sweep) */}
          {viewMode === 'radar' && (
            <div className="h-full flex flex-col items-center justify-center py-4">
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-neutral-900/60 border border-rose-500/30 flex items-center justify-center overflow-hidden shadow-2xl shadow-rose-950/40">
                {/* Concentric distance rings */}
                <div className="absolute inset-4 rounded-full border border-neutral-800 pointer-events-none" />
                <div className="absolute inset-16 rounded-full border border-neutral-800/80 pointer-events-none" />
                <div className="absolute inset-28 rounded-full border border-rose-500/20 pointer-events-none" />
                <div className="absolute inset-40 rounded-full border border-rose-500/30 pointer-events-none" />

                {/* Crosshair axis */}
                <div className="absolute w-full h-px bg-neutral-800/60 pointer-events-none" />
                <div className="absolute h-full w-px bg-neutral-800/60 pointer-events-none" />

                {/* Sweeping Radar Scanner Line */}
                <div className="absolute inset-0 radar-sweep pointer-events-none">
                  <div 
                    className="w-1/2 h-1/2 absolute top-0 right-0 origin-bottom-left"
                    style={{
                      background: 'conic-gradient(from 0deg at 0% 100%, rgba(244, 63, 94, 0.4) 0deg, rgba(244, 63, 94, 0.05) 45deg, transparent 90deg)'
                    }}
                  />
                </div>

                {/* Center point (User Current Location) */}
                <div className="z-10 relative flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-900 border-2 border-white">
                    <Navigation className="w-4 h-4 fill-white" />
                  </div>
                  <div className="absolute w-12 h-12 rounded-full border-2 border-rose-500/50 radar-pulse" />
                </div>

                {/* Placed Users on Radar */}
                {visibleUsers.map((user, idx) => {
                  // Distribute angle based on user index
                  const angle = (idx * (360 / Math.max(visibleUsers.length, 1)) + 25) * (Math.PI / 180);
                  // Normalized radius distance (0.2 to 0.42 of radius)
                  const distanceFactor = 0.2 + (user.distanceKm / (radarRange || 1)) * 0.22;
                  const r = 160 * distanceFactor;
                  const x = Math.cos(angle) * r;
                  const y = Math.sin(angle) * r;

                  return (
                    <div
                      key={user.id}
                      onClick={() => onSelectUser(user)}
                      style={{
                        transform: `translate(${x}px, ${y}px)`
                      }}
                      className="absolute z-20 cursor-pointer group transition-transform hover:scale-125"
                      title={`${user.name} (${user.distanceKm} km)`}
                    >
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500 shadow-md group-hover:ring-white transition-all"
                        />
                        {user.role === 'companion' && (
                          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full flex items-center justify-center text-[8px] font-bold text-neutral-950">
                            ★
                          </div>
                        )}
                        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black/80 px-1.5 py-0.5 rounded text-[9px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          {user.name} ({user.distanceKm}km)
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Placed Motéis on Radar (Pink / Amber Bed icon) */}
                {visibleMotels.map((motel, idx) => {
                  const angle = ((idx + 2) * 110) * (Math.PI / 180);
                  const r = 130;
                  const x = Math.cos(angle) * r;
                  const y = Math.sin(angle) * r;

                  return (
                    <div
                      key={motel.id}
                      onClick={() => onSelectMotel(motel)}
                      style={{
                        transform: `translate(${x}px, ${y}px)`
                      }}
                      className="absolute z-20 cursor-pointer group hover:scale-125 transition-transform"
                      title={`${motel.name} (${motel.distanceKm} km)`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white ring-2 ring-amber-400 shadow-lg">
                        <BedDouble className="w-4 h-4" />
                      </div>
                      <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black/90 px-1.5 py-0.5 rounded text-[9px] text-amber-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {motel.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Radar Controls */}
              <div className="mt-4 flex items-center gap-3 bg-neutral-900/80 p-2.5 rounded-2xl border border-neutral-800 text-xs">
                <span className="text-neutral-400">Alcance do Radar:</span>
                <div className="flex items-center gap-1">
                  {[1, 3, 5, 10].map((km) => (
                    <button
                      key={km}
                      onClick={() => setRadarRange(km)}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                        radarRange === km
                          ? 'bg-rose-600 text-white'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {km} km
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
