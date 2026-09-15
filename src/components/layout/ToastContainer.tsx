import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = usePartner();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '24px',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      pointerEvents: 'none'
    }}>
      {toasts.map(t => {
        const isSuccess = t.type === 'success';
        const isWarn = t.type === 'warning';
        const isError = t.type === 'error';

        return (
          <div
            key={t.id}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--card)',
              color: 'var(--txt)',
              border: `1px solid ${isSuccess ? 'var(--green)' : isWarn ? 'var(--warn)' : isError ? 'var(--danger)' : 'var(--acc)'}`,
              boxShadow: 'var(--shadow-lg)',
              minWidth: '280px',
              maxWidth: '420px',
              animation: 'slideUp 0.2s ease-out'
            }}
          >
            {isSuccess && <CheckCircle2 size={18} color="var(--green)" />}
            {isWarn && <AlertTriangle size={18} color="var(--warn)" />}
            {isError && <AlertCircle size={18} color="var(--danger)" />}
            {!isSuccess && !isWarn && !isError && <Info size={18} color="var(--acc)" />}

            <span style={{ fontSize: '13.5px', fontWeight: 500, flex: 1 }}>
              {t.message}
            </span>

            <button
              onClick={() => removeToast(t.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--mut)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
