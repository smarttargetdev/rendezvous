import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Map, Overlay } from 'pigeon-maps';
import {
  MapPin,
  Navigation,
  Crosshair,
  Layers,
  ZoomIn,
  ZoomOut,
  BedDouble,
  Sparkles,
  CheckCircle,
  Star,
  List,
  EyeOff,
  ShieldCheck,
  X,
  ChevronRight,
  MessageCircle,
  ExternalLink,
  Flame,
  Clock,
  Compass
} from 'lucide-react';
import { UserProfile, PartnerMotel } from '../../types';

interface InteractiveRadarMapProps {
  users: UserProfile[];
  motels: PartnerMotel[];
  currentUser?: UserProfile;
  radarRange: number;
  onSelectUser: (user: UserProfile) => void;
  onSelectMotel: (motel: PartnerMotel) => void;
  onSwitchToList?: () => void;
  onRangeChange?: (range: number) => void;
  ghostMode?: boolean;
}

type MapLayer = 'dark' | 'voyager' | 'osm';
type MapCategoryFilter = 'all' | 'companions' | 'clients' | 'moteis' | 'online';

export const InteractiveRadarMap: React.FC<InteractiveRadarMapProps> = ({
  users,
  motels,
  currentUser,
  radarRange,
  onSelectUser,
  onSelectMotel,
  onSwitchToList,
  onRangeChange,
  ghostMode = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapSize, setMapSize] = useState<{ width: number; height: number }>({ width: 400, height: 500 });

  // Map viewport state - default centered on São Paulo (Paulista/Jardins)
  const defaultCenter: [number, number] = currentUser
    ? [currentUser.lat, currentUser.lng]
    : [-23.5615, -46.6560];

  const [center, setCenter] = useState<[number, number]>(defaultCenter);
  const [zoom, setZoom] = useState<number>(14);
  const [mapLayer, setMapLayer] = useState<MapLayer>('dark');
  const [categoryFilter, setCategoryFilter] = useState<MapCategoryFilter>('all');
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Selected item for bottom sheet preview
  const [selectedItem, setSelectedItem] = useState<{
    type: 'user' | 'motel';
    user?: UserProfile;
    motel?: PartnerMotel;
  } | null>(null);

  // ResizeObserver to ensure pigeon-maps renders with exact pixel bounds
  useEffect(() => {
    if (!containerRef.current) return;
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMapSize({
          width: Math.max(Math.floor(rect.width), 320),
          height: Math.max(Math.floor(rect.height), 380)
        });
      }
    };

    updateDimensions();
    const ro = new ResizeObserver(updateDimensions);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Tile Providers (fast, public, CDN cached)
  const tileProvider = useMemo(() => {
    if (mapLayer === 'voyager') {
      return (x: number, y: number, z: number, dpr?: number) => {
        const s = ['a', 'b', 'c', 'd'][(x + y) % 4];
        return `https://${s}.basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}${dpr && dpr >= 2 ? '@2x' : ''}.png`;
      };
    }
    if (mapLayer === 'osm') {
      return (x: number, y: number, z: number) => {
        const s = ['a', 'b', 'c'][(x + y) % 3];
        return `https://${s}.tile.openstreetmap.org/${z}/${x}/${y}.png`;
      };
    }
    // Default: CartoDB Dark Matter (Luxury Obsidian Theme)
    return (x: number, y: number, z: number, dpr?: number) => {
      const s = ['a', 'b', 'c', 'd'][(x + y) % 4];
      return `https://${s}.basemaps.cartocdn.com/dark_all/${z}/${x}/${y}${dpr && dpr >= 2 ? '@2x' : ''}.png`;
    };
  }, [mapLayer]);

  // Filter entities according to distance and category
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (u.distanceKm > radarRange) return false;
      if (categoryFilter === 'companions') return u.role === 'companion';
      if (categoryFilter === 'clients') return u.role === 'client';
      if (categoryFilter === 'online') return u.isOnline;
      if (categoryFilter === 'moteis') return false;
      return true;
    });
  }, [users, radarRange, categoryFilter]);

  const filteredMotels = useMemo(() => {
    if (categoryFilter === 'companions' || categoryFilter === 'clients' || categoryFilter === 'online') {
      return [];
    }
    return motels.filter((m) => m.distanceKm <= radarRange);
  }, [motels, radarRange, categoryFilter]);

  // Recenter to Current User
  const handleRecenterToUser = () => {
    setCenter(defaultCenter);
    setZoom(14.5);
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-neutral-950 select-none">
      {/* Top Filter and Controls Bar */}
      <div className="z-20 p-2 sm:p-2.5 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 flex items-center gap-1 ${
              categoryFilter === 'all'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <span>Todos</span>
            <span className="text-[10px] opacity-80">
              ({users.filter(u => u.distanceKm <= radarRange).length + motels.filter(m => m.distanceKm <= radarRange).length})
            </span>
          </button>

          <button
            onClick={() => setCategoryFilter('companions')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 flex items-center gap-1 ${
              categoryFilter === 'companions'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Acompanhantes</span>
            <span className="text-[10px] opacity-80">
              ({users.filter(u => u.role === 'companion' && u.distanceKm <= radarRange).length})
            </span>
          </button>

          <button
            onClick={() => setCategoryFilter('clients')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 flex items-center gap-1 ${
              categoryFilter === 'clients'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <span>Clientes</span>
            <span className="text-[10px] opacity-80">
              ({users.filter(u => u.role === 'client' && u.distanceKm <= radarRange).length})
            </span>
          </button>

          <button
            onClick={() => setCategoryFilter('moteis')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 flex items-center gap-1 ${
              categoryFilter === 'moteis'
                ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-sm'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <BedDouble className="w-3 h-3 text-rose-400" />
            <span>Motéis</span>
            <span className="text-[10px] opacity-80">
              ({motels.filter(m => m.distanceKm <= radarRange).length})
            </span>
          </button>

          <button
            onClick={() => setCategoryFilter('online')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 flex items-center gap-1 ${
              categoryFilter === 'online'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Online</span>
          </button>
        </div>

        {/* Right side controls: Radius range selector and List toggle */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          {/* Quick Range selector */}
          {onRangeChange && (
            <div className="flex items-center bg-neutral-900 p-0.5 rounded-lg border border-neutral-800 text-[11px]">
              {[1, 3, 5, 10].map((km) => (
                <button
                  key={km}
                  onClick={() => onRangeChange(km)}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    radarRange === km
                      ? 'bg-rose-600 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title={`Raio de até ${km} km`}
                >
                  {km}km
                </button>
              ))}
            </div>
          )}

          {/* Switch to List View quick button */}
          {onSwitchToList && (
            <button
              onClick={onSwitchToList}
              className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-xs flex items-center gap-1.5 transition-colors font-medium shadow-sm"
              title="Voltar para visualização em grade/lista"
            >
              <List className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Ver Lista</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Map Canvas Container */}
      <div ref={containerRef} className="flex-1 w-full h-full relative overflow-hidden bg-neutral-950">
        <Map
          center={center}
          zoom={zoom}
          width={mapSize.width}
          height={mapSize.height}
          provider={tileProvider}
          onBoundsChanged={({ center: newCenter, zoom: newZoom }) => {
            setCenter(newCenter);
            setZoom(newZoom);
          }}
          minZoom={11}
          maxZoom={18}
          attribution={false}
          attributionPrefix={false}
          metaWheelZoom={false}
          mouseEvents={true}
          touchEvents={true}
        >
          {/* 1. CURRENT USER (GPS POSITION BEACON) */}
          <Overlay anchor={defaultCenter} offset={[22, 22]}>
            <div className="relative group cursor-pointer z-30" onClick={handleRecenterToUser}>
              {/* Outer Pulsing Beacon Wave */}
              <div className="absolute -inset-3 rounded-full bg-rose-500/30 animate-ping pointer-events-none" />
              <div className="absolute -inset-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 pointer-events-none" />

              {/* Main Beacon Avatar or Icon */}
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-rose-600 to-rose-400 p-0.5 shadow-xl shadow-rose-950/80 ring-2 ring-white">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center text-white">
                    <Navigation className="w-5 h-5 fill-rose-500 text-white" />
                  </div>
                )}
              </div>

              {/* Tag Label */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-neutral-950/90 text-white text-[10px] font-bold border border-rose-500/60 shadow-lg whitespace-nowrap pointer-events-none flex items-center gap-1">
                {ghostMode ? (
                  <>
                    <EyeOff className="w-2.5 h-2.5 text-purple-400" />
                    <span className="text-purple-300">Invisível</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Você</span>
                  </>
                )}
              </div>
            </div>
          </Overlay>

          {/* 2. NEARBY USER MARKERS */}
          {filteredUsers.map((user) => {
            const isEscort = user.role === 'companion';
            const isSelected = selectedItem?.user?.id === user.id;

            return (
              <Overlay key={user.id} anchor={[user.lat, user.lng]} offset={[20, 20]}>
                <div
                  onClick={() => setSelectedItem({ type: 'user', user })}
                  className={`relative cursor-pointer group transition-transform duration-200 z-20 ${
                    isSelected ? 'scale-125 z-40' : 'hover:scale-115'
                  }`}
                  title={`${user.name} (${user.distanceKm} km)`}
                >
                  {/* Outer ring based on escort vs client */}
                  <div
                    className={`w-10 h-10 rounded-full p-0.5 shadow-lg transition-all ${
                      isSelected
                        ? 'ring-4 ring-rose-400 shadow-rose-900/60 scale-105'
                        : isEscort
                        ? 'ring-2 ring-amber-400 shadow-amber-950/50'
                        : 'ring-2 ring-rose-500 shadow-neutral-950'
                    }`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full rounded-full object-cover bg-neutral-800"
                    />
                  </div>

                  {/* Online indicator */}
                  {user.isOnline && (
                    <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-neutral-950 flex items-center justify-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                  )}

                  {/* Escort VIP Badge */}
                  {isEscort && (
                    <div className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-full bg-amber-500 text-neutral-950 text-[9px] font-extrabold shadow flex items-center justify-center">
                      ★
                    </div>
                  )}

                  {/* Distance Tooltip pill */}
                  <div
                    className={`absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[9px] font-semibold whitespace-nowrap shadow-md transition-opacity pointer-events-none ${
                      isSelected
                        ? 'bg-rose-600 text-white opacity-100'
                        : isEscort
                        ? 'bg-amber-950/90 text-amber-300 border border-amber-600/40 opacity-90 group-hover:opacity-100'
                        : 'bg-neutral-950/90 text-neutral-200 border border-neutral-700 opacity-90 group-hover:opacity-100'
                    }`}
                  >
                    {user.name.split(' ')[0]} · {user.distanceKm < 1 ? `${Math.round(user.distanceKm * 1000)}m` : `${user.distanceKm}km`}
                  </div>
                </div>
              </Overlay>
            );
          })}

          {/* 3. PARTNER MOTEIS MARKERS */}
          {filteredMotels.map((motel) => {
            const isSelected = selectedItem?.motel?.id === motel.id;

            return (
              <Overlay key={motel.id} anchor={[motel.lat, motel.lng]} offset={[18, 18]}>
                <div
                  onClick={() => setSelectedItem({ type: 'motel', motel })}
                  className={`relative cursor-pointer group transition-transform duration-200 z-20 ${
                    isSelected ? 'scale-125 z-40' : 'hover:scale-115'
                  }`}
                  title={`${motel.name} (${motel.distanceKm} km)`}
                >
                  <div
                    className={`w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-rose-600 to-rose-500 flex items-center justify-center text-white shadow-xl transition-all ${
                      isSelected
                        ? 'ring-4 ring-amber-300 scale-105'
                        : 'ring-2 ring-amber-400 group-hover:ring-white'
                    }`}
                  >
                    <BedDouble className="w-4 h-4 fill-white" />
                  </div>

                  {/* Motel Discount Badge Pill */}
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-rose-950/95 text-[9px] font-bold text-rose-300 border border-rose-500/50 shadow-md whitespace-nowrap pointer-events-none">
                    {motel.name.split(' ')[0]} · {motel.exclusiveDiscountPercent}% OFF
                  </div>
                </div>
              </Overlay>
            );
          })}
        </Map>

        {/* Floating Map Action Controls (Recenter, Layers, Zoom) */}
        <div className="absolute top-3 right-3 z-30 flex flex-col gap-2">
          {/* Recenter to User GPS */}
          <button
            onClick={handleRecenterToUser}
            className="w-9 h-9 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-rose-400 hover:text-rose-300 border border-neutral-700/80 shadow-lg backdrop-blur-md flex items-center justify-center transition-transform active:scale-90"
            title="Centralizar na Minha Localização"
          >
            <Crosshair className="w-4 h-4" />
          </button>

          {/* Zoom In */}
          <button
            onClick={() => setZoom((z) => Math.min(z + 1, 18))}
            className="w-9 h-9 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700/80 shadow-lg backdrop-blur-md flex items-center justify-center transition-transform active:scale-90"
            title="Aumentar Zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={() => setZoom((z) => Math.max(z - 1, 11))}
            className="w-9 h-9 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700/80 shadow-lg backdrop-blur-md flex items-center justify-center transition-transform active:scale-90"
            title="Diminuir Zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Map Layer Switcher Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="w-9 h-9 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700/80 shadow-lg backdrop-blur-md flex items-center justify-center transition-transform active:scale-90"
              title="Estilos de Camada do Mapa"
            >
              <Layers className="w-4 h-4" />
            </button>

            {showLayerMenu && (
              <div className="absolute right-11 top-0 w-36 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl p-1.5 flex flex-col gap-1 text-xs">
                <button
                  onClick={() => {
                    setMapLayer('dark');
                    setShowLayerMenu(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-left font-medium flex items-center justify-between ${
                    mapLayer === 'dark'
                      ? 'bg-rose-600 text-white'
                      : 'text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>Obsidian Dark</span>
                  {mapLayer === 'dark' && <CheckCircle className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setMapLayer('voyager');
                    setShowLayerMenu(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-left font-medium flex items-center justify-between ${
                    mapLayer === 'voyager'
                      ? 'bg-rose-600 text-white'
                      : 'text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>Voyager Street</span>
                  {mapLayer === 'voyager' && <CheckCircle className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setMapLayer('osm');
                    setShowLayerMenu(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-left font-medium flex items-center justify-between ${
                    mapLayer === 'osm'
                      ? 'bg-rose-600 text-white'
                      : 'text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>OpenStreetMap</span>
                  {mapLayer === 'osm' && <CheckCircle className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Location Badge (São Paulo - Jardins & Paulista) */}
        <div className="absolute top-3 left-3 z-30 pointer-events-none">
          <div className="px-3 py-1.5 rounded-xl bg-neutral-950/85 backdrop-blur-md border border-neutral-800 shadow-lg flex items-center gap-2 text-xs text-neutral-300">
            <Compass className="w-3.5 h-3.5 text-rose-500 animate-spin" style={{ animationDuration: '12s' }} />
            <div>
              <div className="font-semibold text-white text-[11px]">São Paulo · Região Central</div>
              <div className="text-[10px] text-neutral-400">Raio de radar: {radarRange} km</div>
            </div>
          </div>
        </div>

        {/* Floating Quick Action Pill: "Voltar para Grade" */}
        {onSwitchToList && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
            <button
              onClick={onSwitchToList}
              className="px-4 py-2 rounded-full bg-neutral-900/90 hover:bg-neutral-850 text-white border border-rose-500/50 shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-semibold transition-all hover:scale-105 active:scale-95 group"
            >
              <List className="w-4 h-4 text-rose-400 group-hover:rotate-12 transition-transform" />
              <span>Alternar para Lista de Perfis</span>
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px]">
                {filteredUsers.length}
              </span>
            </button>
          </div>
        )}

        {/* 4. BOTTOM SHEET PREVIEW DRAWER (When Pin is Selected) */}
        {selectedItem && (
          <div className="absolute bottom-2 left-2 right-2 sm:left-4 sm:right-auto sm:w-96 z-40 bg-neutral-900/95 border border-neutral-700/80 rounded-2xl shadow-2xl backdrop-blur-xl p-3.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Header with Close */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                {selectedItem.type === 'user' ? (
                  <>
                    <MapPin className="w-3 h-3 text-rose-400" />
                    <span>Perfil no Radar Geográfico</span>
                  </>
                ) : (
                  <>
                    <BedDouble className="w-3 h-3 text-amber-400" />
                    <span>Motel Parceiro Guia de Motéis</span>
                  </>
                )}
              </span>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-6 h-6 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* User Preview */}
            {selectedItem.type === 'user' && selectedItem.user && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 ring-2 ring-rose-500">
                    <img
                      src={selectedItem.user.avatar}
                      alt={selectedItem.user.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {selectedItem.user.isOnline && (
                      <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-black" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white truncate">
                        {selectedItem.user.name}, {selectedItem.user.age}
                      </h4>
                      {selectedItem.user.isVerified && (
                        <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-neutral-400">
                      {selectedItem.user.tribe} · {selectedItem.user.height}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px]">
                      <span className="text-rose-400 font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {selectedItem.user.distanceKm < 1
                          ? `${Math.round(selectedItem.user.distanceKm * 1000)}m de você`
                          : `${selectedItem.user.distanceKm} km de você`}
                      </span>
                      {selectedItem.user.rating && (
                        <span className="text-amber-400 font-medium flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {selectedItem.user.rating}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* If Companion Rate */}
                {selectedItem.user.role === 'companion' && selectedItem.user.companionData && (
                  <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-800/50 flex items-center justify-between text-xs">
                    <span className="text-amber-300 font-medium flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Cache por hora
                    </span>
                    <span className="font-extrabold text-amber-400 text-sm">
                      R$ {selectedItem.user.companionData.hourlyRate}
                    </span>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {selectedItem.user.tags.slice(0, 4).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-neutral-800 text-[10px] text-neutral-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action CTA */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      onSelectUser(selectedItem.user!);
                      setSelectedItem(null);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                  >
                    <span>Ver Perfil Completo</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Motel Preview */}
            {selectedItem.type === 'motel' && selectedItem.motel && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedItem.motel.heroPhoto}
                    alt={selectedItem.motel.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover shrink-0 ring-1 ring-neutral-700"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">
                      {selectedItem.motel.name}
                    </h4>
                    <div className="text-xs text-neutral-400 truncate">
                      {selectedItem.motel.neighborhood} · {selectedItem.motel.distanceKm} km
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 font-bold text-[10px] border border-emerald-800/60">
                        {selectedItem.motel.discountBadge}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-neutral-950/70 border border-neutral-800 flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Suítes a partir de</span>
                  <span className="font-bold text-white">
                    R$ {selectedItem.motel.suites[0]?.pricePerHour || 180}/h
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      onSelectMotel(selectedItem.motel!);
                      setSelectedItem(null);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                  >
                    <BedDouble className="w-3.5 h-3.5" />
                    <span>Ver Suítes & Reservar</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div className="p-2 bg-neutral-950 border-t border-neutral-900 flex flex-wrap items-center justify-between text-[11px] text-neutral-400 shrink-0 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Clientes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-1 ring-amber-300" />
            <span>Acompanhantes VIP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600" />
            <span>Motéis Parceiros</span>
          </div>
        </div>

        <span className="text-neutral-500 text-[10px] hidden sm:inline">
          Toque em qualquer marcador para abrir detalhes e rotas
        </span>
      </div>
    </div>
  );
};
