import React from 'react';
import { useTasks } from '../context/TaskContext';
import { 
  Calendar, CheckCircle2, Clock, MoreVertical, 
  Edit3, Trash2, CheckSquare, AlertTriangle, ArrowRight 
} from 'lucide-react';

export const TaskCard = ({ task, onDragStart, compact = false }) => {
  const { openEditModal, deleteTask, patchTaskStatus } = useTasks();

  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'in_progress';

  // Calculate overdue status
  let dueDateInfo = null;
  if (task.due_date) {
    const due = new Date(task.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0 && !isCompleted) {
      dueDateInfo = { text: `Overdue by ${Math.abs(diffDays)}d`, type: 'overdue' };
    } else if (diffDays === 0) {
      dueDateInfo = { text: 'Due today', type: 'today' };
    } else if (diffDays === 1) {
      dueDateInfo = { text: 'Due tomorrow', type: 'tomorrow' };
    } else {
      dueDateInfo = { text: task.due_date, type: 'normal' };
    }
  }

  const handleToggleStatus = (e) => {
    e.stopPropagation();
    const nextStatus = isCompleted ? 'pending' : 'completed';
    patchTaskStatus(task.id, nextStatus);
  };

  const handleStatusChange = (e) => {
    e.stopPropagation();
    patchTaskStatus(task.id, e.target.value);
  };

  const totalSubtasks = task.subtask_count || (task.subtasks ? task.subtasks.length : 0);
  const completedSubtasks = task.completed_subtasks || (task.subtasks ? task.subtasks.filter(s => s.completed == 1).length : 0);
  const subtaskPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <div 
      className="glass-card"
      draggable={!!onDragStart}
      onDragStart={(e) => onDragStart && onDragStart(e, task.id)}
      style={{
        padding: compact ? '0.85rem' : '1.1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        cursor: onDragStart ? 'grab' : 'default',
        position: 'relative',
        opacity: isCompleted ? 0.75 : 1,
        borderLeft: isCompleted 
          ? '3px solid #10b981' 
          : (task.priority === 'urgent' ? '3px solid #ef4444' : '3px solid transparent')
      }}
    >
      {/* Top row: Category, Priority, and Quick Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {task.category_name && (
            <span className="cat-tag">
              <span className="cat-dot" style={{ backgroundColor: task.category_color || '#6366f1' }} />
              {task.category_name}
            </span>
          )}
          <span className={`priority-pill priority-${task.priority}`}>
            {task.priority}
          </span>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <button 
            onClick={() => openEditModal(task)}
            className="btn-ghost btn-icon"
            style={{ padding: '4px', color: 'var(--text-muted)' }}
            title="Edit task"
          >
            <Edit3 size={14} />
          </button>
          <button 
            onClick={() => deleteTask(task.id)}
            className="btn-ghost btn-icon"
            style={{ padding: '4px', color: 'var(--text-muted)' }}
            title="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Title & Description */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
          <button 
            onClick={handleToggleStatus}
            style={{
              marginTop: '3px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              border: isCompleted ? '1px solid #10b981' : '1px solid var(--border-medium)',
              backgroundColor: isCompleted ? '#10b981' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            title={isCompleted ? 'Mark pending' : 'Mark completed'}
          >
            {isCompleted && <CheckCircle2 size={14} color="#fff" />}
          </button>

          <div style={{ flex: 1 }}>
            <h3 
              onClick={() => openEditModal(task)}
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                textDecoration: isCompleted ? 'line-through' : 'none',
                cursor: 'pointer',
                lineHeight: 1.3
              }}
            >
              {task.title}
            </h3>

            {task.description && !compact && (
              <p style={{
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                marginTop: '0.35rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.4
              }}>
                {task.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Subtasks Progress Bar (if any) */}
      {totalSubtasks > 0 && (
        <div style={{ marginTop: '0.1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckSquare size={13} />
              <span>{completedSubtasks}/{totalSubtasks} subtasks</span>
            </div>
            <span>{subtaskPercent}%</span>
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ width: `${subtaskPercent}%`, height: '100%', backgroundColor: subtaskPercent === 100 ? '#10b981' : '#6366f1' }} />
          </div>
        </div>
      )}

      {/* Bottom Row: Due Date & Status Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.4rem',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '0.75rem'
      }}>
        {/* Due Date Indicator */}
        {dueDateInfo ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: dueDateInfo.type === 'overdue' 
              ? '#ef4444' 
              : (dueDateInfo.type === 'today' ? '#eab308' : 'var(--text-muted)'),
            fontWeight: dueDateInfo.type !== 'normal' ? 600 : 400
          }}>
            {dueDateInfo.type === 'overdue' ? <AlertTriangle size={13} /> : <Calendar size={13} />}
            <span>{dueDateInfo.text}</span>
          </div>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>No due date</span>
        )}

        {/* Status Dropdown */}
        <select 
          value={task.status}
          onChange={handleStatusChange}
          style={{
            fontSize: '0.75rem',
            padding: '0.2rem 0.4rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-tertiary)',
            color: task.status === 'completed' 
              ? 'var(--status-completed-text)' 
              : (task.status === 'in_progress' ? 'var(--status-progress-text)' : 'var(--status-pending-text)'),
            fontWeight: 600,
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer'
          }}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
};
