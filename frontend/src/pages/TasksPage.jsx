import React from 'react';
import { useTasks } from '../context/TaskContext';
import { FilterBar } from '../components/FilterBar';
import { TaskCard } from '../components/TaskCard';
import { Plus, CheckSquare, Inbox, Sparkles } from 'lucide-react';

export const TasksPage = () => {
  const { tasks, openCreateModal, viewMode, categoryFilter, categories, statusFilter, priorityFilter, searchQuery } = useTasks();

  // Find active category name if filtered
  const activeCategory = categories.find(c => String(c.id) === categoryFilter);

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              {activeCategory ? activeCategory.name : 'All Tasks'}
            </h1>
            <span style={{
              fontSize: '0.8125rem',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
              fontWeight: 600
            }}>
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Create, filter, organize, and manage your daily tasks and milestones.
          </p>
        </div>

        <button 
          onClick={() => openCreateModal({ categoryId: activeCategory?.id })}
          className="btn btn-primary"
        >
          <Plus size={16} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Filter and View Toolbar */}
      <FilterBar />

      {/* Tasks View: Grid or List */}
      {tasks.length === 0 ? (
        <div className="glass-card" style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          borderRadius: 'var(--radius-lg)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: 'var(--text-muted)'
          }}>
            <Inbox size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
            No tasks found
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all'
              ? 'No tasks match your current filter criteria. Try resetting your filters.'
              : 'You have no tasks created yet. Click below to add your first task.'}
          </p>
          <button 
            onClick={() => openCreateModal({ categoryId: activeCategory?.id })}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Create New Task</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} compact={false} />
          ))}
        </div>
      )}
    </div>
  );
};
