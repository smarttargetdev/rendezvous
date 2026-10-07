import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  ShieldCheck, 
  Lock, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Activity, 
  Wifi, 
  Radio, 
  Info, 
  X 
} from 'lucide-react';
import { UserProfile } from '../../types';

interface WebRTCCallModalProps {
  isOpen: boolean;
  callType: 'audio' | 'video';
  currentUser: UserProfile;
  peerUser: UserProfile;
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onEndCall: (durationSeconds: number, type: 'audio' | 'video', status: 'completed' | 'missed') => void;
}

export const WebRTCCallModal: React.FC<WebRTCCallModalProps> = ({
  isOpen,
  callType,
  currentUser,
  peerUser,
  isMinimized,
  onToggleMinimize,
  onEndCall
}) => {
  const [callStatus, setCallStatus] = useState<'calling' | 'ringing' | 'connected' | 'ended'>('calling');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'video');
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [showCryptoDetails, setShowCryptoDetails] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [hasRealCamera, setHasRealCamera] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerIntervalRef = useRef<any>(null);

  // Synthesize WebRTC tones using native Web Audio API
  const playTone = (freq1: number, freq2: number, durationMs: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(freq1, ctx.currentTime);
      osc2.frequency.setValueAtTime(freq2, ctx.currentTime);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + durationMs / 1000);
      osc2.stop(ctx.currentTime + durationMs / 1000);
    } catch (e) {
      // AudioContext fallback without crashing
    }
  };

  // Attempt real getUserMedia stream with fallback to simulation
  useEffect(() => {
    if (!isOpen) {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }
      return;
    }

    setCallStatus('calling');
    setCallDuration(0);
    setIsVideoEnabled(callType === 'video');

    let streamInstance: MediaStream | null = null;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: callType === 'video',
        audio: true
      })
      .then((stream) => {
        streamInstance = stream;
        setLocalStream(stream);
        setHasRealCamera(true);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        // Fallback to simulated media if camera is blocked/denied in iframe
        setHasRealCamera(false);
      });
    }

    // Call progression simulation
    const ringingTimeout = setTimeout(() => {
      setCallStatus('ringing');
      playTone(440, 480, 800);
    }, 1200);

    const connectTimeout = setTimeout(() => {
      setCallStatus('connected');
      playTone(523.25, 659.25, 400); // Friendly major connection chime
    }, 3200);

    return () => {
      clearTimeout(ringingTimeout);
      clearTimeout(connectTimeout);
      if (streamInstance) {
        streamInstance.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, callType]);

  // Duration counter once connected
  useEffect(() => {
    if (callStatus === 'connected') {
      timerIntervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [callStatus]);

  if (!isOpen) return null;

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEnd = () => {
    playTone(420, 420, 250);
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    const finalDuration = callDuration;
    const finalStatus = callStatus === 'connected' ? 'completed' : 'missed';
    setCallStatus('ended');
    setTimeout(() => {
      onEndCall(finalDuration, callType, finalStatus);
    }, 300);
  };

  // Toggle local video track
  const handleToggleVideo = () => {
    const next = !isVideoEnabled;
    setIsVideoEnabled(next);
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = next;
      });
    }
  };

  // Toggle local mic track
  const handleToggleMic = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !next;
      });
    }
  };

  // MINIMIZED PICTURE-IN-PICTURE (PiP) WIDGET
  if (isMinimized) {
    return (
      <div className="fixed bottom-24 right-4 z-50 bg-neutral-900/95 border border-rose-500/50 rounded-2xl p-2.5 shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
        <div className="relative">
          <img
            src={peerUser.avatar}
            alt={peerUser.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-neutral-900 animate-pulse" />
        </div>

        <div className="min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white truncate max-w-[100px]">{peerUser.name}</span>
            <span className="px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
              {callType === 'video' ? 'Vídeo' : 'Voz'} E2EE
            </span>
          </div>
          <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
            {callStatus === 'connected' ? formatDuration(callDuration) : 'Chamando...'}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleToggleMic}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              isMuted ? 'bg-rose-500 text-white' : 'bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
            title={isMuted ? 'Desmutar' : 'Mutar'}
          >
            {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onToggleMinimize}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
            title="Expandir Chamada"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleEnd}
            className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors"
            title="Encerrar"
          >
            <PhoneOff className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // FULLSCREEN / DRAWER OVERLAY CALL MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md h-full sm:h-[88vh] bg-neutral-950 border border-neutral-800 rounded-none sm:rounded-3xl flex flex-col overflow-hidden relative shadow-2xl">
        
        {/* Top Floating Control Bar */}
        <div className="absolute top-0 inset-x-0 p-4 z-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCryptoDetails(!showCryptoDetails)}
              className="px-2.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1.5 transition-colors"
              title="Detalhes da Criptografia WebRTC"
            >
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>WebRTC DTLS-SRTP</span>
              <Info className="w-3 h-3 opacity-70" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMinimize}
              className="p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white backdrop-blur-sm border border-neutral-700/60 transition-colors"
              title="Minimizar chamada para continuar digitando"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* E2EE Cryptographic Details Banner (Modal Popover) */}
        {showCryptoDetails && (
          <div className="absolute top-16 inset-x-4 z-30 p-3.5 rounded-2xl bg-neutral-900/95 border border-emerald-500/50 shadow-2xl backdrop-blur-xl space-y-2 text-xs">
            <div className="flex items-center justify-between pb-1 border-b border-neutral-800">
              <span className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Auditoria de Segurança da Chamada WebRTC
              </span>
              <button
                onClick={() => setShowCryptoDetails(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-300 pt-1">
              <div>
                <span className="text-neutral-500 block text-[10px]">Criptografia de Fluxo:</span>
                <span className="font-mono text-emerald-400">SRTP (AES-256-GCM)</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">Handshake de Chaves:</span>
                <span className="font-mono text-white">DTLS 1.3 (ECDH P-256)</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">Topologia de Rede:</span>
                <span className="text-white">P2P Mesh (Direto sem Relay)</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">Codec / Latência:</span>
                <span className="font-mono text-cyan-400">Opus/VP9 • 19ms ping</span>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-[9px] text-neutral-400 break-all">
              Fingerprint SHA-256: 4C:98:2E:FA:01:BC:90:34:F1:82:1D:6E:9A:88:51:70:C4:2E:DF
            </div>
          </div>
        )}

        {/* Video / Audio Stage */}
        <div className="flex-1 relative flex flex-col items-center justify-center overflow-hidden bg-neutral-950">
          
          {/* VIDEO MODE */}
          {callType === 'video' ? (
            <div className="w-full h-full relative flex items-center justify-center">
              {/* Remote Peer Video Stream / Simulation */}
              <div className="w-full h-full relative overflow-hidden bg-neutral-900">
                <img
                  src={peerUser.photos?.[0] || peerUser.avatar}
                  alt={peerUser.name}
                  className="w-full h-full object-cover filter brightness-90 contrast-105"
                />
                
                {/* Live stream badge & watermark */}
                <div className="absolute top-16 left-4 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold">{peerUser.name} (Remoto)</span>
                  <span className="text-neutral-400">1080p 60fps</span>
                </div>

                {/* Subtitle status overlay if still ringing */}
                {callStatus !== 'connected' && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <div className="relative">
                      <img
                        src={peerUser.avatar}
                        alt={peerUser.name}
                        className="w-24 h-24 rounded-full object-cover ring-4 ring-rose-500 shadow-2xl animate-pulse"
                      />
                      <span className="absolute inset-0 rounded-full ring-8 ring-rose-500/20 animate-ping" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white">{peerUser.name}</h3>
                      <p className="text-xs text-neutral-400 mt-1">
                        {callStatus === 'calling' ? 'Iniciando handshake WebRTC seguro...' : 'Chamando via P2P criptografado...'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-medium border border-rose-500/20">
                      <Radio className="w-3.5 h-3.5 animate-spin" />
                      <span>Aguardando resposta</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Local Video Picture-in-Picture Preview Window */}
              {isVideoEnabled && (
                <div className="absolute bottom-28 right-4 w-28 h-38 sm:w-32 sm:h-44 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-neutral-900 z-10 transition-transform hover:scale-105">
                  {hasRealCamera ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${cameraFacing === 'user' ? 'scale-x-[-1]' : ''}`}
                    />
                  ) : (
                    <div className="w-full h-full relative">
                      <img
                        src={currentUser.avatar}
                        alt="Você"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[9px] font-bold text-white bg-black/50 px-1.5 py-0.5 rounded">Você</span>
                      </div>
                    </div>
                  )}

                  {/* Flip camera shortcut */}
                  <button
                    onClick={() => setCameraFacing((prev) => (prev === 'user' ? 'environment' : 'user'))}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
                    title="Inverter Câmera"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* AUDIO ONLY CALL STAGE */
            <div className="flex-1 w-full flex flex-col items-center justify-center p-6 text-center space-y-6">
              
              {/* Glowing Avatar with Soundwave Ripple Rings */}
              <div className="relative my-4">
                <div className="w-32 h-32 rounded-full relative z-10 p-1 bg-gradient-to-tr from-rose-600 via-amber-500 to-rose-400">
                  <img
                    src={peerUser.avatar}
                    alt={peerUser.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>

                {/* Animated pulsating soundwave rings */}
                {callStatus === 'connected' && (
                  <>
                    <span className="absolute inset-0 rounded-full ring-4 ring-rose-500/40 animate-ping opacity-60 pointer-events-none" />
                    <span className="absolute -inset-4 rounded-full ring-2 ring-amber-500/30 animate-pulse pointer-events-none" />
                  </>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">{peerUser.name}</h3>
                <p className="text-xs text-neutral-400">
                  {callStatus === 'connected' ? (
                    <span className="text-emerald-400 font-medium flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Chamada de Voz Segura em Andamento
                    </span>
                  ) : callStatus === 'ringing' ? (
                    'Chamando...'
                  ) : (
                    'Conectando criptografia P2P...'
                  )}
                </p>
                <div className="font-mono text-sm font-bold text-white pt-1">
                  {callStatus === 'connected' ? formatDuration(callDuration) : '--:--'}
                </div>
              </div>

              {/* Dynamic Sound Frequency Bars Visualizer */}
              {callStatus === 'connected' && (
                <div className="flex items-center gap-1.5 h-8">
                  {[24, 40, 16, 48, 60, 32, 54, 20, 44, 30].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 rounded-full bg-rose-500/80 animate-pulse"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 0.12}s`,
                        animationDuration: '0.8s'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Connected Floating Duration Badge (Video Mode) */}
          {callType === 'video' && callStatus === 'connected' && (
            <div className="absolute top-16 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono font-bold text-white z-10 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              {formatDuration(callDuration)}
            </div>
          )}
        </div>

        {/* Bottom Floating Control Bar */}
        <div className="p-4 sm:p-6 bg-gradient-to-t from-black via-black/90 to-transparent flex items-center justify-around shrink-0 z-20">
          
          {/* Mute Mic Toggle */}
          <button
            onClick={handleToggleMic}
            className={`p-3.5 rounded-2xl flex flex-col items-center gap-1 transition-all ${
              isMuted
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/60'
                : 'bg-neutral-800/90 text-neutral-200 hover:text-white hover:bg-neutral-700/90'
            }`}
            title={isMuted ? 'Ativar Microfone' : 'Silenciar Microfone'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span className="text-[9px] font-medium">{isMuted ? 'Mudo' : 'Mic'}</span>
          </button>

          {/* Video Camera Toggle */}
          {callType === 'video' && (
            <button
              onClick={handleToggleVideo}
              className={`p-3.5 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                !isVideoEnabled
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/60'
                  : 'bg-neutral-800/90 text-neutral-200 hover:text-white hover:bg-neutral-700/90'
              }`}
              title={isVideoEnabled ? 'Desligar Câmera' : 'Ligar Câmera'}
            >
              {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              <span className="text-[9px] font-medium">{isVideoEnabled ? 'Vídeo' : 'Desligado'}</span>
            </button>
          )}

          {/* Speaker Toggle */}
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`p-3.5 rounded-2xl flex flex-col items-center gap-1 transition-all ${
              !isSpeakerOn
                ? 'bg-neutral-800 text-neutral-500'
                : 'bg-neutral-800/90 text-neutral-200 hover:text-white hover:bg-neutral-700/90'
            }`}
            title={isSpeakerOn ? 'Alto-falante Ativo' : 'Alto-falante Desligado'}
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            <span className="text-[9px] font-medium">{isSpeakerOn ? 'Viva-voz' : 'Fones'}</span>
          </button>

          {/* Flip Camera (Video Mode) */}
          {callType === 'video' && (
            <button
              onClick={() => setCameraFacing((prev) => (prev === 'user' ? 'environment' : 'user'))}
              className="p-3.5 rounded-2xl bg-neutral-800/90 text-neutral-200 hover:text-white hover:bg-neutral-700/90 flex flex-col items-center gap-1 transition-all"
              title="Alternar Câmera Frontal / Traseira"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="text-[9px] font-medium">Inverter</span>
            </button>
          )}

          {/* Red End Call Button */}
          <button
            onClick={handleEnd}
            className="p-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-900/50 hover:scale-105 active:scale-95 transition-all"
            title="Encerrar Chamada"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>

      </div>
    </div>
  );
};
