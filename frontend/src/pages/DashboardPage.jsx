import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from '../components/TaskCard';
import { 
  CheckSquare, Clock, CheckCircle2, AlertTriangle, 
  Plus, ArrowRight, BarChart2, TrendingUp, Calendar, 
  Folder, Sparkles, Flame 
} from 'lucide-react';

export const DashboardPage = ({ setActiveTab }) => {
  const { user } = useAuth();
  const { stats, tasks, openCreateModal, categories, setCategoryFilter } = useTasks();

  const total = stats?.total_tasks || 0;
  const completed = stats?.completed_tasks || 0;
  const inProgress = stats?.in_progress_tasks || 0;
  const pending = stats?.pending_tasks || 0;
  const overdue = stats?.overdue_tasks || 0;
  const completionRate = stats?.completion_rate || 0;

  // Recent tasks
  const recentTasks = tasks.slice(0, 4);

  // Urgent & high priority tasks needing attention
  const urgentTasks = tasks.filter(t => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'completed').slice(0, 3);

  return (
    <div className="page-body">
      {/* Top Banner / Greeting */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Here is your productivity overview for today. You have completed <strong style={{ color: '#4ade80' }}>{completed} of {total}</strong> tasks.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={() => openCreateModal()}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {/* Total Tasks */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Tasks</span>
            <CheckSquare size={18} color="#818cf8" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff' }}>{total}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Across {categories.length} categories
          </div>
        </div>

        {/* Completed */}
        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '3px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase' }}>Completed</span>
            <CheckCircle2 size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#4ade80' }}>{completed}</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginTop: '0.25rem' }}>
            {completionRate}% success rate
          </div>
        </div>

        {/* In Progress */}
        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '3px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase' }}>In Progress</span>
            <Clock size={18} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#60a5fa' }}>{inProgress}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Currently active
          </div>
        </div>

        {/* Pending / To Do */}
        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '3px solid #eab308' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase' }}>To Do / Pending</span>
            <Calendar size={18} color="#eab308" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#facc15' }}>{pending}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Awaiting start
          </div>
        </div>

        {/* Overdue (Highlighted if > 0) */}
        <div className="glass-card" style={{
          padding: '1.25rem',
          borderLeft: overdue > 0 ? '3px solid #ef4444' : '3px solid var(--border-subtle)',
          backgroundColor: overdue > 0 ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-card)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase' }}>Overdue</span>
            <AlertTriangle size={18} color={overdue > 0 ? '#ef4444' : 'var(--text-muted)'} />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: overdue > 0 ? '#f87171' : 'var(--text-muted)' }}>{overdue}</div>
          <div style={{ fontSize: '0.75rem', color: overdue > 0 ? '#f87171' : 'var(--text-muted)', marginTop: '0.25rem' }}>
            {overdue > 0 ? 'Needs immediate action' : 'No overdue tasks'}
          </div>
        </div>
      </div>

      {/* Main Dashboard Two-Column Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.7fr 1fr',
        gap: '1.5rem',
        alignItems: 'flex-start'
      }}>
        {/* Left Column: Recent Tasks & Urgent Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Urgent Priority Section (if any) */}
          {urgentTasks.length > 0 && (
            <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Flame size={18} color="#ef4444" />
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f87171' }}>High Priority Attention</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {urgentTasks.map(t => (
                  <TaskCard key={t.id} task={t} compact={true} />
                ))}
              </div>
            </div>
          )}

          {/* Recent Tasks List */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Recent Tasks</h2>
              <button 
                onClick={() => setActiveTab('tasks')}
                className="btn-ghost btn-sm"
                style={{ color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <span>View all</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {recentTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                No tasks yet. Create your first task to get started!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {recentTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Progress & Category Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Productivity Completion Widget */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
              Progress Tracker
            </h2>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Overall Completion</span>
                <span style={{ fontWeight: 700, color: '#fff' }}>{completionRate}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: `${completionRate}%`, height: '100%', background: 'var(--accent-gradient)', transition: 'width 0.4s ease' }} />
              </div>
            </div>

            {/* Subtasks Progress */}
            {stats?.subtasks && stats.subtasks.total > 0 && (
              <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Subtask Checklist</span>
                  <span style={{ fontWeight: 600, color: '#818cf8' }}>{stats.subtasks.completed} / {stats.subtasks.total} done</span>
                </div>
                <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.round((stats.subtasks.completed / stats.subtasks.total) * 100)}%`, height: '100%', backgroundColor: '#6366f1' }} />
                </div>
              </div>
            )}

            <button 
              onClick={() => setActiveTab('kanban')}
              className="btn btn-secondary"
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              Open Kanban Board
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Category Breakdown */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
              Categories Breakdown
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {categories.map(cat => {
                const catTotal = cat.task_count || 0;
                const catCompleted = cat.completed_count || 0;
                const catPercent = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0;

                return (
                  <div 
                    key={cat.id}
                    onClick={() => { setCategoryFilter(String(cat.id)); setActiveTab('tasks'); }}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-tertiary)',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color || '#6366f1' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{cat.name}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {catCompleted}/{catTotal} tasks
                      </span>
                    </div>

                    <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div style={{ width: `${catPercent}%`, height: '100%', backgroundColor: cat.color || '#6366f1' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
