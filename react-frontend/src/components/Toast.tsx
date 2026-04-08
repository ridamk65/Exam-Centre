import { useState, useCallback } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  X
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

const ICONS: Record<ToastType, any> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const COLORS: Record<ToastType, string> = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6',
    warning: '#f59e0b',
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const ToastContainer = () => (
    <div style={{
      position: 'fixed', 
      top: 90, 
      right: 32, 
      zIndex: 1000,
      display: 'flex', 
      flexDirection: 'column', 
      gap: 12,
    }}>
      {toasts.map(t => {
        const Icon = ICONS[t.type];
        return (
          <div key={t.id} style={{
            background: '#fff', 
            borderRadius: '12px', 
            padding: '14px 20px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
            border: '1px solid var(--border-color)',
            borderLeft: `5px solid ${COLORS[t.type]}`,
            display: 'flex', 
            alignItems: 'center', 
            gap: 12, 
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--secondary)',
            minWidth: 320, 
            maxWidth: 440,
            animation: 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Icon size={20} color={COLORS[t.type]} />
            <span style={{ flex: 1 }}>{t.message}</span>
            <button 
                onClick={() => removeToast(t.id)}
                style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', display: 'flex', padding: 4 }}
            >
                <X size={16} />
            </button>
            <div style={{ 
                position: 'absolute', bottom: 0, left: 0, height: 3, width: '100%', 
                background: COLORS[t.type], opacity: 0.1, animation: 'toastProgress 4s linear' 
            }} />
          </div>
        );
      })}
      <style>{`
        @keyframes toastSlideIn { from { transform: translateX(60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes toastProgress { from { width: 100%; } to { width: 0%; } }
      `}</style>
    </div>
  );

  return { showToast, ToastContainer };
}
