import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { SubtaskList } from './SubtaskList';
import { X, Calendar, Tag, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const PRIORITIES = [
  { id: 'low', label: 'Low', color: '#10b981' },
  { id: 'medium', label: 'Medium', color: '#3b82f6' },
  { id: 'high', label: 'High', color: '#f97316' },
  { id: 'urgent', label: 'Urgent', color: '#ef4444' }
];

const STATUSES = [
  { id: 'pending', label: 'To Do / Pending' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' }
];

export const TaskModal = () => {
  const { modalState, closeModal, categories, createTask, updateTask, addSubtask, toggleSubtask, deleteSubtask } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [draftSubtasks, setDraftSubtasks] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEdit = modalState.mode === 'edit';
  const task = modalState.task;

  useEffect(() => {
    if (modalState.isOpen) {
      if (isEdit && task) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setStatus(task.status || 'pending');
        setPriority(task.priority || 'medium');
        setDueDate(task.due_date ? task.due_date.split('T')[0] : '');
        setCategoryId(task.category_id ? String(task.category_id) : '');
        setDraftSubtasks(task.subtasks || []);
      } else {
        setTitle('');
        setDescription('');
        setStatus(modalState.defaultStatus || 'pending');
        setPriority('medium');
        setDueDate('');
        setCategoryId(modalState.defaultCategory ? String(modalState.defaultCategory) : (categories[0]?.id ? String(categories[0].id) : ''));
        setDraftSubtasks([]);
      }
      setError('');
    }
  }, [modalState, isEdit, task, categories]);

  if (!modalState.isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        due_date: dueDate || null,
        category_id: categoryId ? parseInt(categoryId) : null,
      };

      if (isEdit) {
        await updateTask(task.id, payload);
      } else {
        payload.subtasks = draftSubtasks;
        await createTask(payload);
      }
      closeModal();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  // Subtask actions inside modal
  const handleAddDraftSubtask = async (subtaskTitle) => {
    if (isEdit && task) {
      const added = await addSubtask(task.id, subtaskTitle);
      if (added) setDraftSubtasks(prev => [...prev, added]);
    } else {
      setDraftSubtasks(prev => [...prev, { title: subtaskTitle, completed: 0 }]);
    }
  };

  const handleToggleDraftSubtask = async (idOrIndex) => {
    if (isEdit && task) {
      const toggled = await toggleSubtask(task.id, idOrIndex);
      if (toggled) {
        setDraftSubtasks(prev => prev.map(s => s.id === idOrIndex ? toggled : s));
      }
    } else {
      setDraftSubtasks(prev => prev.map((s, idx) => idx === idOrIndex ? { ...s, completed: s.completed ? 0 : 1 } : s));
    }
  };

  const handleDeleteDraftSubtask = async (idOrIndex) => {
    if (isEdit && task) {
      await deleteSubtask(task.id, idOrIndex);
      setDraftSubtasks(prev => prev.map(s => s.id !== idOrIndex));
    } else {
      setDraftSubtasks(prev => prev.filter((_, idx) => idx !== idOrIndex));
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit Task' : 'Create New Task'}</h2>
          <button onClick={closeModal} className="btn-ghost btn-icon" style={{ color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{
                padding: '0.65rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '0.8125rem',
                marginBottom: '1rem'
              }}>
                {error}
              </div>
            )}

            {/* Task Title */}
            <div className="input-group">
              <label className="input-label">Task Title *</label>
              <input 
                type="text"
                placeholder="e.g. Learn React Fundamentals"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-control"
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="input-group">
              <label className="input-label">Description</label>
              <textarea 
                rows={3}
                placeholder="Provide notes, acceptance criteria, or context..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-control"
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Category & Status Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label">Category</label>
                <select 
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="input-control"
                >
                  <option value="">No Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="input-control"
                >
                  {STATUSES.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Priority & Due Date Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', alignItems: 'flex-start' }}>
              <div className="input-group">
                <label className="input-label">Priority</label>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {PRIORITIES.map((p) => {
                    const isSelected = priority === p.id;
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => setPriority(p.id)}
                        style={{
                          flex: 1,
                          padding: '0.45rem 0.2rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: isSelected ? p.color : 'var(--bg-tertiary)',
                          color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                          border: isSelected ? `1px solid ${p.color}` : '1px solid var(--border-subtle)',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Due Date</label>
                <input 
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="input-control"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            {/* Subtasks Section */}
            <SubtaskList 
              subtasks={draftSubtasks}
              onAddSubtask={handleAddDraftSubtask}
              onToggleSubtask={handleToggleDraftSubtask}
              onDeleteSubtask={handleDeleteDraftSubtask}
              isDraft={!isEdit}
            />
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" onClick={closeModal} className="btn btn-secondary" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
