import { useState, useCallback } from 'react';
import type { ToastType } from '../utils/data';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

const ICONS: Record<ToastType, string> = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️',
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const ToastContainer = () => (
    <div style={{
      position: 'fixed', top: 70, right: 20, zIndex: 300,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: '#fff', borderRadius: 5, padding: '11px 16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          borderLeft: `4px solid ${t.type === 'success' ? '#27ae60' : t.type === 'error' ? '#c0392b' : t.type === 'warning' ? '#f39c12' : '#3a9fa8'}`,
          display: 'flex', alignItems: 'center', gap: 9, fontSize: 13,
          minWidth: 240, animation: 'toastIn 0.3s ease',
        }}>
          <span>{ICONS[t.type]}</span>
          <span>{t.message}</span>
        </div>
      ))}
      <style>{`@keyframes toastIn { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  );

  return { showToast, ToastContainer };
}
