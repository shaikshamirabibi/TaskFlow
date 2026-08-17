import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { 
  User, Mail, Lock, KeyRound, CheckCircle2, 
  AlertCircle, Shield, Calendar, LogOut, Check 
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { stats, addToast } = useTasks();

  const [name, setName] = useState(user?.name || '');
  const [profileSaving, setProfileSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setProfileSaving(true);
    try {
      await updateProfile(name.trim());
      addToast('Profile updated successfully', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordSaving(true);
    setPasswordError('');

    try {
      await changePassword(currentPassword, newPassword);
      addToast('Password changed successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="page-body" style={{ maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
          User Profile & Security
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Manage your account settings, personal details, and credentials.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '1.75rem',
            fontWeight: 800,
            boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)'
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{user?.name}</h2>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
              <Mail size={14} />
              <span>{user?.email}</span>
            </div>
            {user?.created_at && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                <Calendar size={13} />
                <span>Joined {user.created_at.split(' ')[0]}</span>
              </div>
            )}
          </div>

          {/* Quick Stats Pills */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-tertiary)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>{stats?.total_tasks || 0}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Tasks</div>
            </div>
            <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-tertiary)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4ade80' }}>{stats?.completed_tasks || 0}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Completed</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {/* Personal Details Form */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <User size={18} color="#818cf8" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Personal Details</h2>
          </div>

          <form onSubmit={handleUpdateName}>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-control"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Email Address (Read Only)</label>
              <input 
                type="email"
                value={user?.email || ''}
                disabled
                className="input-control"
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={profileSaving || name === user?.name}
              style={{ marginTop: '0.5rem' }}
            >
              {profileSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <KeyRound size={18} color="#818cf8" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Change Password</h2>
          </div>

          {passwordError && (
            <div style={{
              padding: '0.65rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.8125rem',
              marginBottom: '1rem'
            }}>
              {passwordError}
            </div>
          )}

          <form onSubmit={handleChangePassword}>
            <div className="input-group">
              <label className="input-label">Current Password</label>
              <input 
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input-control"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">New Password</label>
              <input 
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-control"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Confirm New Password</label>
              <input 
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-control"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-secondary"
              disabled={passwordSaving}
              style={{ marginTop: '0.5rem', width: '100%' }}
            >
              {passwordSaving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
