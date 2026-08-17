import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Layers, Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles, ArrowLeft } from 'lucide-react';

export const LoginPage = ({ onSwitchToRegister, onBackToLanding }) => {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemo = async () => {
    setSubmitting(true);
    setError('');
    try {
      await demoLogin();
    } catch (err) {
      setError('Failed to connect to demo account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-primary)',
      padding: '1.5rem'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '2.5rem 2rem',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: '#121929',
        border: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Back link */}
        <button 
          onClick={onBackToLanding}
          className="btn-ghost"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem', padding: '0' }}
        >
          <ArrowLeft size={14} />
          Back to Home
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            margin: '0 auto 0.75rem',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)'
          }}>
            <Layers size={24} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Welcome Back</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            Sign in to continue to TaskFlow
          </p>
        </div>

        {/* 1-Click Demo Login Banner */}
        <button
          type="button"
          onClick={handleDemo}
          disabled={submitting}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(79, 70, 229, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            color: '#c7d2fe',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
        >
          <Sparkles size={16} color="#818cf8" />
          <span>Quick Demo Login (Alex Morgan)</span>
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          color: 'var(--text-muted)',
          fontSize: '0.75rem'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
          <span>OR SIGN IN WITH EMAIL</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
        </div>

        {error && (
          <div style={{
            padding: '0.65rem 0.9rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            fontSize: '0.8125rem',
            marginBottom: '1.25rem'
          }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-control"
                style={{ paddingLeft: '36px' }}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-control"
                style={{ paddingLeft: '36px', paddingRight: '36px' }}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontSize: '0.9rem' }}
            disabled={submitting}
          >
            {submitting ? 'Signing In...' : 'Sign In'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer link */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <button 
            onClick={onSwitchToRegister}
            style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'underline' }}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};
