import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { 
  Search, Plus, Bell, User, LogOut, CheckCircle2, 
  AlertTriangle, Calendar, Layers, Menu, X 
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, toggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery, openCreateModal, stats, tasks } = useTasks();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Derive notifications from tasks: overdue + due today
  const overdueTasks = tasks.filter(t => {
    if (!t.due_date || t.status === 'completed') return false;
    const due = new Date(t.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  });

  const dueSoonTasks = tasks.filter(t => {
    if (!t.due_date || t.status === 'completed') return false;
    const due = new Date(t.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 2;
  });

  const totalAlerts = overdueTasks.length + dueSoonTasks.length;

  return (
    <header style={{
      height: '70px',
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-glass)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem'
    }}>
      {/* Left: Mobile Toggle & Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={toggleMobileSidebar}
          className="btn-icon btn-ghost"
          style={{ display: 'none' }}
          id="mobile-nav-toggle"
          title="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <div 
          onClick={() => setActiveTab('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(79, 70, 229, 0.4)'
          }}>
            <Layers size={18} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
            Task<span style={{ color: '#818cf8' }}>Flow</span>
          </span>
        </div>
      </div>

      {/* Middle: Live Search Bar */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '400px',
        margin: '0 1.5rem'
      }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text"
          placeholder="Search tasks, descriptions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-control"
          style={{
            paddingLeft: '36px',
            paddingRight: searchQuery ? '32px' : '12px',
            height: '38px',
            fontSize: '0.85rem'
          }}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* New Task Button */}
        <button 
          onClick={() => openCreateModal()}
          className="btn btn-primary"
          style={{ height: '38px' }}
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>

        {/* Notifications Popover */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
            className="btn-icon btn-secondary"
            style={{ position: 'relative', height: '38px', width: '38px' }}
            title="Notifications"
          >
            <Bell size={18} />
            {totalAlerts > 0 && (
              <span style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#ef4444',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-primary)'
              }}>
                {totalAlerts}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="glass-card" style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '320px',
              backgroundColor: '#161f36',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 100,
              padding: '1rem',
              borderRadius: 'var(--radius-lg)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Notifications</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{totalAlerts} alerts</span>
              </div>

              <div style={{ maxHeight: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {overdueTasks.length > 0 && overdueTasks.map(t => (
                  <div key={t.id} style={{
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'flex-start'
                  }}>
                    <AlertTriangle size={15} color="#ef4444" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ fontSize: '0.8rem' }}>
                      <div style={{ fontWeight: 600, color: '#fca5a5' }}>Overdue: {t.title}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Due date was {t.due_date}</div>
                    </div>
                  </div>
                ))}

                {dueSoonTasks.length > 0 && dueSoonTasks.map(t => (
                  <div key={t.id} style={{
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(234, 179, 8, 0.1)',
                    border: '1px solid rgba(234, 179, 8, 0.2)',
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'flex-start'
                  }}>
                    <Calendar size={15} color="#eab308" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ fontSize: '0.8rem' }}>
                      <div style={{ fontWeight: 600, color: '#fde047' }}>Due Soon: {t.title}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Due on {t.due_date}</div>
                    </div>
                  </div>
                ))}

                {totalAlerts === 0 && (
                  <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <CheckCircle2 size={24} color="#10b981" style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                    All tasks are up to date!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.35rem 0.6rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#4f46e5',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 500, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'User'}
            </span>
          </button>

          {showUserMenu && (
            <div className="glass-card" style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '200px',
              backgroundColor: '#161f36',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 100,
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)'
            }}>
              <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.35rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
              </div>
              <button 
                onClick={() => { setActiveTab('profile'); setShowUserMenu(false); }}
                className="btn-ghost"
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', textAlign: 'left' }}
              >
                <User size={15} />
                Profile Settings
              </button>
              <button 
                onClick={logout}
                className="btn-ghost"
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: '#ef4444', textAlign: 'left' }}
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
