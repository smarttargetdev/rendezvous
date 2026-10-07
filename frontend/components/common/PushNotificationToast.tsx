import React, { useEffect } from 'react';
import { Bell, Heart, Sparkles, Shield, DollarSign, X } from 'lucide-react';
import { PushNotification } from '../../types';

interface PushNotificationToastProps {
  notification: PushNotification | null;
  onDismiss: () => void;
  onClick?: (notification: PushNotification) => void;
}

export const PushNotificationToast: React.FC<PushNotificationToastProps> = ({
  notification,
  onDismiss,
  onClick
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 6000);
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'match':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case 'promotion':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'booking':
        return <Shield className="w-4 h-4 text-emerald-400" />;
      case 'payout':
        return <DollarSign className="w-4 h-4 text-cyan-400" />;
      default:
        return <Bell className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm animate-in slide-in-from-top duration-300">
      <div 
        onClick={() => onClick && onClick(notification)}
        className="cursor-pointer rounded-2xl bg-neutral-900/95 border border-rose-500/30 backdrop-blur-xl p-3.5 shadow-2xl shadow-rose-950/40 flex items-start gap-3 hover:border-rose-500/50 transition-colors relative"
      >
        <div className="w-9 h-9 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-700">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <h4 className="text-xs font-bold text-white truncate">{notification.title}</h4>
            <span className="text-[10px] text-neutral-400 whitespace-nowrap">{notification.timestamp}</span>
          </div>
          <p className="text-[11px] text-neutral-300 leading-snug line-clamp-2">{notification.body}</p>
          <div className="mt-1 flex items-center gap-1.5 text-[9px] text-rose-400 font-medium">
            <span>Rendezvous Push Engine</span>
            <span>·</span>
            <span>Toque para abrir</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="absolute top-2.5 right-2.5 p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
