import React, { useState } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Globe, 
  Wifi, 
  WifiOff, 
  Battery, 
  ShieldCheck, 
  Code2, 
  SlidersHorizontal,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { PlatformMode, AppTheme, LanguageCode } from '../../types';

interface DeviceFrameWrapperProps {
  children: React.ReactNode;
  platform: PlatformMode;
  onPlatformChange: (platform: PlatformMode) => void;
  theme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  onOpenBackendModal: () => void;
  onOpenAdminModal: () => void;
  onOpenSupportModal: () => void;
  onTriggerPushSample: () => void;
  onBiometricCheck: () => void;
}

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({
  children,
  platform,
  onPlatformChange,
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  isOffline,
  onToggleOffline,
  onOpenBackendModal,
  onOpenAdminModal,
  onOpenSupportModal,
  onTriggerPushSample,
  onBiometricCheck
}) => {
  const [batteryLevel] = useState(94);
  const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`min-h-screen w-full flex flex-col bg-neutral-950 text-neutral-100 theme-${theme}`}>
      {/* Top Universal Cross-Platform Control & Developer Bar */}
      <header className="w-full bg-neutral-900/90 border-b border-neutral-800/80 backdrop-blur-md px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 z-40 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-rose-900/40">
              R
            </div>
            <span className="font-display font-bold text-sm tracking-tight text-white hidden sm:inline">
              Rendezvous
            </span>
          </div>

          <div className="h-4 w-px bg-neutral-800 hidden md:block" />

          {/* Platform Switcher Buttons */}
          <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
            <button
              onClick={() => onPlatformChange('ios')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                platform === 'ios'
                  ? 'bg-neutral-800 text-rose-400 font-semibold shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Visualizar como iOS (iPhone 16 Pro)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">iOS</span>
            </button>

            <button
              onClick={() => onPlatformChange('android')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                platform === 'android'
                  ? 'bg-neutral-800 text-rose-400 font-semibold shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Visualizar como Android (Pixel 9)"
            >
              <Smartphone className="w-3.5 h-3.5 rotate-180" />
              <span className="hidden sm:inline">Android</span>
            </button>

            <button
              onClick={() => onPlatformChange('macos')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                platform === 'macos' || platform === 'windows'
                  ? 'bg-neutral-800 text-rose-400 font-semibold shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Desktop Multi-Platform (macOS / Windows / Linux)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>

            <button
              onClick={() => onPlatformChange('web')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                platform === 'web'
                  ? 'bg-neutral-800 text-rose-400 font-semibold shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Web Responsivo & PWA"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Web PWA</span>
            </button>
          </div>
        </div>

        {/* Action Controls & Testing Hub */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Offline simulator toggle */}
          <button
            onClick={onToggleOffline}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs flex items-center gap-1.5 border transition-colors ${
              isOffline
                ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
            title="Alternar Modo Offline PWA"
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden lg:inline">{isOffline ? 'Offline' : 'Online'}</span>
          </button>

          {/* Test Push alert */}
          <button
            onClick={onTriggerPushSample}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs flex items-center gap-1 bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
            title="Disparar Notificação Push de Teste"
          >
            <span className="text-[11px] hidden sm:inline">🔔 Testar Push</span>
          </button>

          {/* Biometrics Test */}
          <button
            onClick={onBiometricCheck}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs flex items-center gap-1 bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
            title="Testar Verificação Biométrica"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden md:inline">Biometria</span>
          </button>

          {/* Backend PHP Architecture Viewer */}
          <button
            onClick={onOpenBackendModal}
            className="px-2.5 py-1 rounded-xl text-xs font-medium flex items-center gap-1.5 bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 transition-colors"
            title="Ver Arquitetura Backend PHP & WebSockets"
          >
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Backend PHP</span>
          </button>

          {/* Language Switcher */}
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
            className="bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs rounded-xl px-2 py-1 focus:outline-none focus:border-rose-500 cursor-pointer"
          >
            <option value="pt">🇧🇷 PT</option>
            <option value="en">🇺🇸 EN</option>
            <option value="es">🇪🇸 ES</option>
            <option value="fr">🇫🇷 FR</option>
          </select>
        </div>
      </header>

      {/* Offline Alert Strip */}
      {isOffline && (
        <div className="w-full bg-amber-500 text-neutral-950 text-xs font-semibold py-1 px-4 text-center flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Modo Offline Ativo: cache local SQLite/IndexedDB garantindo funcionamento contínuo sem rede.</span>
        </div>
      )}

      {/* Main Viewport Content according to chosen Platform */}
      <main className="flex-1 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden bg-neutral-950/60">
        {platform === 'ios' && (
          <div className="w-full max-w-[430px] h-[92vh] max-h-[890px] rounded-[52px] bg-black p-3.5 ring-12 ring-neutral-900 border border-neutral-800 shadow-2xl relative flex flex-col overflow-hidden">
            {/* iOS Dynamic Island & Status Bar */}
            <div className="w-full pt-1 pb-1.5 px-6 flex items-center justify-between text-xs text-neutral-300 select-none z-30 shrink-0">
              <span className="font-semibold text-[13px]">{currentTime}</span>
              
              {/* Dynamic Island */}
              <div className="w-28 h-6 bg-black rounded-full border border-neutral-900 flex items-center justify-between px-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-800" />
                <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
              </div>

              <div className="flex items-center gap-1.5 text-[11px]">
                <Wifi className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold">5G</span>
                <div className="flex items-center gap-0.5">
                  <span className="text-[10px]">{batteryLevel}%</span>
                  <Battery className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Inner App Container */}
            <div className="flex-1 rounded-[40px] bg-neutral-950 overflow-hidden flex flex-col relative border border-neutral-900">
              {children}
            </div>

            {/* iOS Home Indicator Bar */}
            <div className="w-full pt-2 pb-0.5 flex justify-center shrink-0">
              <div className="w-32 h-1 bg-neutral-600 rounded-full" />
            </div>
          </div>
        )}

        {platform === 'android' && (
          <div className="w-full max-w-[412px] h-[92vh] max-h-[880px] rounded-[44px] bg-neutral-950 p-2.5 ring-8 ring-neutral-900 border border-neutral-800 shadow-2xl relative flex flex-col overflow-hidden">
            {/* Android Status Bar with Punch hole */}
            <div className="w-full pt-1 pb-1 px-5 flex items-center justify-between text-xs text-neutral-300 select-none z-30 shrink-0">
              <span className="font-medium text-[12px]">{currentTime}</span>
              
              {/* Camera Punchhole */}
              <div className="w-3.5 h-3.5 rounded-full bg-black border border-neutral-800" />

              <div className="flex items-center gap-2 text-[11px]">
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Inner App Container */}
            <div className="flex-1 rounded-[36px] bg-neutral-950 overflow-hidden flex flex-col relative border border-neutral-900">
              {children}
            </div>

            {/* Android Navigation Bar gesture pill */}
            <div className="w-full pt-2 pb-1 flex justify-center shrink-0">
              <div className="w-20 h-1 bg-neutral-500 rounded-full" />
            </div>
          </div>
        )}

        {platform === 'macos' && (
          <div className="w-full max-w-6xl h-[92vh] rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl flex flex-col overflow-hidden">
            {/* macOS Window Titlebar */}
            <div className="h-10 bg-neutral-900/90 border-b border-neutral-800 px-4 flex items-center justify-between select-none shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 cursor-pointer" />
              </div>
              <div className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <span className="text-rose-500 font-bold">Rendezvous</span>
                <span className="text-neutral-500">·</span>
                <span>Desktop Native (macOS / Windows / Linux)</span>
              </div>
              <div className="text-xs text-neutral-500 font-mono">
                v2.6.4-prod
              </div>
            </div>

            {/* Inner App Container */}
            <div className="flex-1 overflow-hidden relative">
              {children}
            </div>
          </div>
        )}

        {platform === 'web' && (
          <div className="w-full h-full min-h-[92vh] flex-1 flex flex-col">
            {children}
          </div>
        )}
      </main>
    </div>
  );
};
