import React from 'react';
import { X, Check, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Tribe, UserRole } from '../../types';

export interface FilterState {
  maxDistance: number;
  minAge: number;
  maxAge: number;
  selectedTribes: Tribe[];
  roleFilter: 'all' | 'client' | 'companion';
  verifiedOnly: boolean;
  onlineOnly: boolean;
  prepOnly: boolean;
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onUpdateFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
}

const TRIBES_LIST: Tribe[] = ['Ativo', 'Passivo', 'Versátil', 'Urso', 'Twink', 'Sarado', 'Daddy', 'Discreto'];

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
  onResetFilters
}) => {
  if (!isOpen) return null;

  const toggleTribe = (tribe: Tribe) => {
    if (filters.selectedTribes.includes(tribe)) {
      onUpdateFilters({
        ...filters,
        selectedTribes: filters.selectedTribes.filter((t) => t !== tribe)
      });
    } else {
      onUpdateFilters({
        ...filters,
        selectedTribes: [...filters.selectedTribes, tribe]
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-white">Filtros Avançados de Busca</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Filters Body */}
        <div className="p-4 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Account Category Filter */}
          <div>
            <label className="font-semibold text-neutral-300 block mb-2">Tipo de Perfil</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'client', label: 'Encontros' },
                { id: 'companion', label: 'Acompanhante VIP' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onUpdateFilters({ ...filters, roleFilter: opt.id as any })}
                  className={`py-2 px-2.5 rounded-xl text-center font-medium transition-colors border ${
                    filters.roleFilter === opt.id
                      ? 'bg-rose-600 border-rose-500 text-white shadow-xs'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Maximum Distance Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-neutral-300">Distância Máxima</label>
              <span className="font-mono text-rose-400 font-bold">{filters.maxDistance} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={filters.maxDistance}
              onChange={(e) => onUpdateFilters({ ...filters, maxDistance: Number(e.target.value) })}
              className="w-full accent-rose-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
              <span>1 km</span>
              <span>25 km</span>
              <span>50 km</span>
            </div>
          </div>

          {/* Tribes & Roles */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-neutral-300">Tribos & Posição</label>
              {filters.selectedTribes.length > 0 && (
                <span className="text-[10px] text-neutral-400">
                  {filters.selectedTribes.length} selecionada(s)
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TRIBES_LIST.map((tribe) => {
                const isSelected = filters.selectedTribes.includes(tribe);
                return (
                  <button
                    key={tribe}
                    onClick={() => toggleTribe(tribe)}
                    className={`py-1.5 px-3 rounded-xl border font-medium transition-colors ${
                      isSelected
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-semibold'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {tribe}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Verification & Safety Toggles */}
          <div className="space-y-2.5 pt-2 border-t border-neutral-800">
            <label className="font-semibold text-neutral-300 block mb-1">Critérios de Verificação & Status</label>
            
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
              <span className="text-neutral-300 font-medium">Apenas Perfis Verificados com Selo</span>
              <input
                type="checkbox"
                checked={filters.verifiedOnly}
                onChange={(e) => onUpdateFilters({ ...filters, verifiedOnly: e.target.checked })}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 accent-rose-500"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
              <span className="text-neutral-300 font-medium">Online Agora no Radar</span>
              <input
                type="checkbox"
                checked={filters.onlineOnly}
                onChange={(e) => onUpdateFilters({ ...filters, onlineOnly: e.target.checked })}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 accent-rose-500"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
              <span className="text-neutral-300 font-medium">Saúde Sexual Informada (PrEP / Testagem)</span>
              <input
                type="checkbox"
                checked={filters.prepOnly}
                onChange={(e) => onUpdateFilters({ ...filters, prepOnly: e.target.checked })}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 accent-rose-500"
              />
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-800 flex items-center justify-between gap-3 bg-neutral-950/60">
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-neutral-400 hover:text-white text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar Filtros</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shadow-md shadow-rose-900/30"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};
