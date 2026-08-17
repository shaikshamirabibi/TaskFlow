import React from 'react';
import { useTasks } from '../context/TaskContext';
import { 
  Filter, Grid, List, ArrowUpDown, X, CheckCircle2, 
  Clock, AlertCircle, Sparkles 
} from 'lucide-react';

export const FilterBar = () => {
  const { 
    statusFilter, setStatusFilter,
    priorityFilter, setPriorityFilter,
    categoryFilter, setCategoryFilter,
    categories,
    sortBy, setSortBy,
    sortOrder, setSortOrder,
    viewMode, setViewMode,
    searchQuery, setSearchQuery
  } = useTasks();

  const statuses = [
    { id: 'all', label: 'All Status' },
    { id: 'pending', label: 'To Do' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
  ];

  const priorities = [
    { id: 'all', label: 'All Priorities' },
    { id: 'urgent', label: 'Urgent' },
    { id: 'high', label: 'High' },
    { id: 'medium', label: 'Medium' },
    { id: 'low', label: 'Low' },
  ];

  const sorts = [
    { id: 'created_at', label: 'Date Created' },
    { id: 'due_date', label: 'Due Date' },
    { id: 'priority', label: 'Priority' },
    { id: 'title', label: 'Title' },
  ];

  const hasActiveFilters = statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all' || searchQuery !== '';

  const handleReset = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setSearchQuery('');
  };

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.75rem',
      padding: '0.85rem 1rem',
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      marginBottom: '1.5rem'
    }}>
      {/* Left: Status Filter Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
        {statuses.map((s) => {
          const isActive = statusFilter === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setStatusFilter(s.id)}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                fontWeight: isActive ? 600 : 500,
                backgroundColor: isActive ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                transition: 'all var(--transition-fast)'
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Right: Dropdowns & View Mode */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {/* Priority Filter */}
        <select 
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="input-control"
          style={{ width: 'auto', padding: '0.4rem 0.65rem', fontSize: '0.8125rem', height: '34px' }}
        >
          {priorities.map(p => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>

        {/* Category Filter */}
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="input-control"
          style={{ width: 'auto', padding: '0.4rem 0.65rem', fontSize: '0.8125rem', height: '34px' }}
        >
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Sort By Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-control"
            style={{ width: 'auto', padding: '0.4rem 0.65rem', fontSize: '0.8125rem', height: '34px' }}
          >
            {sorts.map(s => (
              <option key={s.id} value={s.id}>Sort: {s.label}</option>
            ))}
          </select>

          <button 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="btn-secondary btn-icon"
            style={{ height: '34px', width: '34px' }}
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            <ArrowUpDown size={14} />
          </button>
        </div>

        {/* Reset Filters button */}
        {hasActiveFilters && (
          <button 
            onClick={handleReset}
            className="btn-ghost btn-sm"
            style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.3rem', height: '34px' }}
          >
            <X size={14} />
            <span>Reset</span>
          </button>
        )}

        {/* View Toggle (Grid / List) */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '2px'
        }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '0.35rem 0.55rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: viewMode === 'grid' ? '#4f46e5' : 'transparent',
              color: viewMode === 'grid' ? '#fff' : 'var(--text-muted)'
            }}
            title="Grid View"
          >
            <Grid size={15} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '0.35rem 0.55rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: viewMode === 'list' ? '#4f46e5' : 'transparent',
              color: viewMode === 'list' ? '#fff' : 'var(--text-muted)'
            }}
            title="List View"
          >
            <List size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
