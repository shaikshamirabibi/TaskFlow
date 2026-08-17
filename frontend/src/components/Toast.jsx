import React from 'react';
import { useTasks } from '../context/TaskContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toasts, removeToast } = useTasks();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.type === 'success' && <CheckCircle2 size={18} color="#10b981" />}
          {toast.type === 'error' && <AlertCircle size={18} color="#ef4444" />}
          {toast.type === 'info' && <Info size={18} color="#3b82f6" />}
          
          <span style={{ flex: 1, fontSize: '0.875rem' }}>{toast.message}</span>
          
          <button 
            onClick={() => removeToast(toast.id)} 
            style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
