import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, CheckSquare, Trello, BarChart2, 
  User, Plus, Trash2, Folder, Tag, ChevronRight, LogOut 
} from 'lucide-react';

const PALETTE = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#64748b'];

export const Sidebar = ({ activeTab, setActiveTab, mobileOpen, closeMobileSidebar }) => {
  const { categories, categoryFilter, setCategoryFilter, createCategory, deleteCategory, stats } = useTasks();
  const { user, logout } = useAuth();

  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState(PALETTE[0]);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (closeMobileSidebar) closeMobileSidebar();
  };

  const handleCategoryClick = (catId) => {
    setActiveTab('tasks');
    setCategoryFilter(String(catId));
    if (closeMobileSidebar) closeMobileSidebar();
  };

  const handleAddCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await createCategory(newCatName.trim(), newCatColor);
    setNewCatName('');
    setShowAddCat(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'All Tasks', icon: CheckSquare, count: stats?.total_tasks },
    { id: 'kanban', label: 'Kanban Board', icon: Trello },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <aside 
      className={`sidebar ${mobileOpen ? 'sidebar-mobile-open' : ''}`}
      style={{
        width: '260px',
        backgroundColor: '#0d1322',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        height: 'calc(100vh - 70px)',
        position: 'sticky',
        top: '70px',
        padding: '1.25rem 0.85rem',
        overflowY: 'auto'
      }}
    >
      {/* Navigation Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', padding: '0 0.75rem 0.5rem' }}>
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'rgba(79, 70, 229, 0.18)' : 'transparent',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} color={isActive ? '#818cf8' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.1rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                  background: isActive ? '#4f46e5' : 'var(--bg-tertiary)',
                  color: isActive ? '#fff' : 'var(--text-muted)'
                }}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Categories Section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 0.75rem 0.5rem',
          fontSize: '0.7rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--text-muted)'
        }}>
          <span>Categories</span>
          <button 
            onClick={() => setShowAddCat(!showAddCat)}
            className="btn-ghost btn-icon"
            style={{ padding: '2px', color: 'var(--text-muted)' }}
            title="Add Category"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Inline Add Category Form */}
        {showAddCat && (
          <form onSubmit={handleAddCategorySubmit} style={{
            padding: '0.75rem',
            margin: '0.25rem 0 0.75rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-medium)'
          }}>
            <input 
              type="text"
              placeholder="Category Name"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="input-control"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem', marginBottom: '0.5rem' }}
              autoFocus
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.6rem' }}>
              {PALETTE.map((c) => (
                <div
                  key={c}
                  onClick={() => setNewCatColor(c)}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: c,
                    cursor: 'pointer',
                    border: newCatColor === c ? '2px solid #fff' : '1px solid transparent'
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
              <button 
                type="button" 
                onClick={() => setShowAddCat(false)}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
              >
                Save
              </button>
            </div>
          </form>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', overflowY: 'auto' }}>
          {/* All Categories Option */}
          <button
            onClick={() => { setCategoryFilter('all'); setActiveTab('tasks'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              color: categoryFilter === 'all' && activeTab === 'tasks' ? '#fff' : 'var(--text-secondary)',
              backgroundColor: categoryFilter === 'all' && activeTab === 'tasks' ? 'rgba(255, 255, 255, 0.07)' : 'transparent',
              transition: 'background var(--transition-fast)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Folder size={15} color="var(--text-muted)" />
              <span>All Categories</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {stats?.total_tasks || 0}
            </span>
          </button>

          {categories.map((cat) => {
            const isSelected = categoryFilter === String(cat.id) && activeTab === 'tasks';
            return (
              <div
                key={cat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.07)' : 'transparent',
                  group: 'cat-item'
                }}
              >
                <div 
                  onClick={() => handleCategoryClick(cat.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, cursor: 'pointer' }}
                >
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: cat.color || '#6366f1' }} />
                  <span style={{
                    fontSize: '0.8125rem',
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? '#fff' : 'var(--text-secondary)'
                  }}>
                    {cat.name}
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {cat.task_count || 0}
                  </span>
                  {/* Delete category for custom categories */}
                  {cat.task_count === 0 && !['Work', 'Study', 'Personal', 'Project', 'Other'].includes(cat.name) && (
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="btn-ghost"
                      style={{ padding: '2px', color: 'var(--text-muted)' }}
                      title="Delete category"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom User Card */}
      <div style={{
        marginTop: 'auto',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div 
          onClick={() => handleNavClick('profile')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', overflow: 'hidden' }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '0.85rem',
            fontWeight: 700,
            flexShrink: 0
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.name || 'User'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {stats?.completed_tasks || 0} tasks done
            </div>
          </div>
        </div>

        <button 
          onClick={logout}
          className="btn-ghost btn-icon"
          title="Logout"
          style={{ color: 'var(--text-muted)' }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};
