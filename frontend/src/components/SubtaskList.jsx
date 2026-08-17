import React, { useState } from 'react';
import { Plus, Check, Trash2, ListChecks } from 'lucide-react';

export const SubtaskList = ({ 
  subtasks = [], 
  onAddSubtask, 
  onToggleSubtask, 
  onDeleteSubtask,
  isDraft = false 
}) => {
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddSubtask(newTitle.trim());
    setNewTitle('');
  };

  const total = subtasks.length;
  const completed = subtasks.filter(s => s.completed == 1 || s.completed === true).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          <ListChecks size={16} color="#818cf8" />
          <span>Subtasks</span>
          {total > 0 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ({completed}/{total})
            </span>
          )}
        </div>
        {total > 0 && (
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: percent === 100 ? '#10b981' : '#818cf8' }}>
            {percent}%
          </span>
        )}
      </div>

      {/* Progress Bar */}
      {total > 0 && (
        <div style={{
          width: '100%',
          height: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          marginBottom: '0.75rem'
        }}>
          <div style={{
            width: `${percent}%`,
            height: '100%',
            backgroundColor: percent === 100 ? '#10b981' : '#6366f1',
            transition: 'width 0.3s ease'
          }} />
        </div>
      )}

      {/* Subtask Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.75rem' }}>
        {subtasks.map((st, index) => {
          const isDone = st.completed == 1 || st.completed === true;
          return (
            <div 
              key={st.id || index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.45rem 0.65rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                transition: 'background var(--transition-fast)'
              }}
            >
              <div 
                onClick={() => onToggleSubtask(st.id || index)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  border: isDone ? '1px solid #10b981' : '1px solid var(--border-medium)',
                  backgroundColor: isDone ? '#10b981' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isDone && <Check size={12} color="#fff" strokeWidth={3} />}
                </div>
                <span style={{
                  fontSize: '0.8125rem',
                  color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
                  textDecoration: isDone ? 'line-through' : 'none'
                }}>
                  {st.title}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onDeleteSubtask(st.id || index)}
                className="btn-ghost"
                style={{ padding: '2px', color: 'var(--text-muted)' }}
                title="Remove subtask"
              >
                <Trash2 size={13} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Subtask Input */}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.4rem' }}>
        <input 
          type="text"
          placeholder="Add a step or subtask..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="input-control"
          style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem', height: '34px' }}
        />
        <button 
          type="submit" 
          className="btn btn-secondary btn-sm"
          style={{ height: '34px', padding: '0 0.75rem' }}
        >
          <Plus size={14} />
          <span>Add</span>
        </button>
      </form>
    </div>
  );
};
