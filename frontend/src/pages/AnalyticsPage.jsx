import React from 'react';
import { useTasks } from '../context/TaskContext';
import { 
  BarChart3, CheckCircle2, Clock, AlertTriangle, 
  TrendingUp, Award, Layers, Target, CheckSquare 
} from 'lucide-react';

export const AnalyticsPage = () => {
  const { stats, categories, tasks } = useTasks();

  const total = stats?.total_tasks || 0;
  const completed = stats?.completed_tasks || 0;
  const pending = stats?.pending_tasks || 0;
  const inProgress = stats?.in_progress_tasks || 0;
  const overdue = stats?.overdue_tasks || 0;
  const completionRate = stats?.completion_rate || 0;

  const priorities = [
    { key: 'urgent', label: 'Urgent', color: '#ef4444', count: stats?.priority_breakdown?.urgent?.count || 0, completed: stats?.priority_breakdown?.urgent?.completed || 0 },
    { key: 'high', label: 'High', color: '#f97316', count: stats?.priority_breakdown?.high?.count || 0, completed: stats?.priority_breakdown?.high?.completed || 0 },
    { key: 'medium', label: 'Medium', color: '#3b82f6', count: stats?.priority_breakdown?.medium?.count || 0, completed: stats?.priority_breakdown?.medium?.completed || 0 },
    { key: 'low', label: 'Low', color: '#10b981', count: stats?.priority_breakdown?.low?.count || 0, completed: stats?.priority_breakdown?.low?.completed || 0 },
  ];

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
          Productivity & Analytics
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Gain real-time insights into your task execution velocity, categories distribution, and completion rates.
        </p>
      </div>

      {/* Top 3 Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* Productivity Score */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0,
            boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)'
          }}>
            <Award size={32} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Completion Rate
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
              {completionRate}%
            </div>
            <div style={{ fontSize: '0.75rem', color: '#4ade80' }}>
              {completed} of {total} tasks resolved
            </div>
          </div>
        </div>

        {/* Subtask Execution */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10b981',
            flexShrink: 0
          }}>
            <CheckSquare size={30} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Subtask Checklist
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>
              {stats?.subtasks?.completed || 0} / {stats?.subtasks?.total || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Granular action items
            </div>
          </div>
        </div>

        {/* Overdue Watch */}
        <div className="glass-card" style={{
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          backgroundColor: overdue > 0 ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-card)',
          border: overdue > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border-subtle)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: overdue > 0 ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: overdue > 0 ? '#ef4444' : 'var(--text-muted)',
            flexShrink: 0
          }}>
            <AlertTriangle size={30} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Overdue Watch
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: overdue > 0 ? '#ef4444' : '#fff' }}>
              {overdue}
            </div>
            <div style={{ fontSize: '0.75rem', color: overdue > 0 ? '#ef4444' : '#4ade80' }}>
              {overdue > 0 ? 'Overdue tasks pending' : 'Zero overdue tasks 🎉'}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Priority Breakdown */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>
            Tasks by Priority Level
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {priorities.map(p => {
              const pPercent = total > 0 ? Math.round((p.count / total) * 100) : 0;
              const completedPercent = p.count > 0 ? Math.round((p.completed / p.count) * 100) : 0;

              return (
                <div key={p.key}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`priority-pill priority-${p.key}`}>
                        {p.label}
                      </span>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {p.count} tasks ({pPercent}%)
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                      {p.completed}/{p.count} done ({completedPercent}%)
                    </span>
                  </div>

                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: `${pPercent}%`, height: '100%', backgroundColor: p.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>
            Tasks by Category
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {categories.map(cat => {
              const catTotal = cat.task_count || 0;
              const catCompleted = cat.completed_count || 0;
              const catPercent = total > 0 ? Math.round((catTotal / total) * 100) : 0;
              const completionRateInCat = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0;

              return (
                <div key={cat.id}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: cat.color || '#6366f1' }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>{cat.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({catTotal} tasks)</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                      {catCompleted}/{catTotal} completed ({completionRateInCat}%)
                    </span>
                  </div>

                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: `${catPercent}%`, height: '100%', backgroundColor: cat.color || '#6366f1' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
