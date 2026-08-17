import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from '../components/TaskCard';
import { Plus, Trello, Sparkles, Filter } from 'lucide-react';

export const KanbanPage = () => {
  const { tasks, patchTaskStatus, openCreateModal, categories, categoryFilter, setCategoryFilter } = useTasks();
  const [dragOverCol, setDragOverCol] = useState(null);

  const columns = [
    {
      id: 'pending',
      title: 'TO DO',
      badgeClass: 'badge-pending',
      accentColor: '#facc15',
      tasks: tasks.filter(t => t.status === 'pending')
    },
    {
      id: 'in_progress',
      title: 'IN PROGRESS',
      badgeClass: 'badge-in_progress',
      accentColor: '#60a5fa',
      tasks: tasks.filter(t => t.status === 'in_progress')
    },
    {
      id: 'completed',
      title: 'COMPLETED',
      badgeClass: 'badge-completed',
      accentColor: '#4ade80',
      tasks: tasks.filter(t => t.status === 'completed')
    }
  ];

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', String(taskId));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colId) {
      setDragOverCol(colId);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      await patchTaskStatus(parseInt(taskId), targetStatus);
    }
  };

  return (
    <div className="page-body" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 70px)' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Kanban Board
            </h1>
            <span style={{
              fontSize: '0.8125rem',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(79, 70, 229, 0.15)',
              color: '#818cf8',
              fontWeight: 600
            }}>
              Drag & Drop Enabled
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Seamlessly drag tasks between columns to update their lifecycle status.
          </p>
        </div>

        {/* Category filter quick selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-control"
            style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button 
            onClick={() => openCreateModal()}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.25rem',
        overflowX: 'auto',
        minHeight: 0
      }}>
        {columns.map(col => {
          const isOver = dragOverCol === col.id;
          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              style={{
                backgroundColor: isOver ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.65)',
                border: isOver ? `2px dashed ${col.accentColor}` : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
                transition: 'all var(--transition-fast)'
              }}
            >
              {/* Column Header */}
              <div style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(255, 255, 255, 0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff', letterSpacing: '0.03em' }}>
                    {col.title}
                  </span>
                  <span className={`badge ${col.badgeClass}`}>
                    {col.tasks.length}
                  </span>
                </div>

                <button 
                  onClick={() => openCreateModal({ status: col.id })}
                  className="btn-ghost btn-icon"
                  style={{ padding: '4px', color: 'var(--text-muted)' }}
                  title={`Add task to ${col.title}`}
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Column Task Cards Scroll Area */}
              <div style={{
                flex: 1,
                padding: '1rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}>
                {col.tasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onDragStart={handleDragStart}
                    compact={true}
                  />
                ))}

                {col.tasks.length === 0 && (
                  <div style={{
                    border: '1px dashed var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '2.5rem 1rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.8125rem'
                  }}>
                    Drag tasks here or click + above to add
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
