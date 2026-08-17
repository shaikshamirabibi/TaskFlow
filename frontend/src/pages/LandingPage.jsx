import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Layers, CheckCircle2, ArrowRight, Kanban, BarChart3, 
  ShieldCheck, Sparkles, Zap, Database, Server, Code2 
} from 'lucide-react';

export const LandingPage = ({ onGetStarted, onLoginClick }) => {
  const { demoLogin } = useAuth();

  const handleDemo = async () => {
    try {
      await demoLogin();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <nav style={{
        height: '70px',
        padding: '0 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'rgba(11, 15, 25, 0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 2px 10px rgba(79, 70, 229, 0.4)'
          }}>
            <Layers size={20} />
          </div>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Task<span style={{ color: '#818cf8' }}>Flow</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={onLoginClick}
            className="btn btn-ghost"
            style={{ fontSize: '0.9rem' }}
          >
            Sign In
          </button>
          <button 
            onClick={handleDemo}
            className="btn btn-secondary"
            style={{ fontSize: '0.9rem', borderColor: 'rgba(99, 102, 241, 0.4)' }}
          >
            ⚡ Quick Demo
          </button>
          <button 
            onClick={onGetStarted}
            className="btn btn-primary"
            style={{ fontSize: '0.9rem' }}
          >
            Get Started
            <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ flex: 1, padding: '4rem 2rem 5rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 4rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(79, 70, 229, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#a5b4fc',
            fontSize: '0.8125rem',
            fontWeight: 600,
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={14} color="#818cf8" />
            Full-Stack Task & Project Management
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            marginBottom: '1.5rem'
          }}>
            Manage your tasks.<br />
            <span style={{
              background: 'linear-gradient(135deg, #a5b4fc 0%, #6366f1 50%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Stay remarkably productive.
            </span>
          </h1>

          <p style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: '650px',
            margin: '0 auto 2.5rem'
          }}>
            The modern, intuitive task tracking system built with React, Python Flask, MySQL, and JWT authentication. Organize subtasks, track Kanban flow, and visualize analytics.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={onGetStarted}
              className="btn btn-primary"
              style={{ padding: '0.8rem 1.8rem', fontSize: '1rem', borderRadius: 'var(--radius-md)' }}
            >
              Get Started Free
              <ArrowRight size={18} />
            </button>
            <button 
              onClick={handleDemo}
              className="btn btn-secondary"
              style={{ padding: '0.8rem 1.8rem', fontSize: '1rem', borderRadius: 'var(--radius-md)' }}
            >
              Try Instant Demo (Alex Morgan)
            </button>
          </div>
        </div>

        {/* Interactive App Mockup Preview */}
        <div className="glass-card" style={{
          padding: '1.75rem',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: '#0f172a',
          border: '1px solid var(--border-medium)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(79, 70, 229, 0.15)',
          marginBottom: '5rem'
        }}>
          {/* Mock Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#eab308' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem', fontFamily: 'var(--font-mono)' }}>taskflow.app / dashboard</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge badge-completed">18 Completed</span>
              <span className="badge badge-in_progress">5 In Progress</span>
              <span className="badge badge-pending">7 To Do</span>
            </div>
          </div>

          {/* Mock Kanban Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Column 1 */}
            <div style={{ background: 'rgba(17, 24, 39, 0.8)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>TO DO</span>
                <span className="badge badge-pending">2</span>
              </div>
              <div className="glass-card" style={{ padding: '0.85rem', marginBottom: '0.75rem', background: '#1e293b' }}>
                <span className="cat-tag" style={{ marginBottom: '0.35rem' }}><span className="cat-dot" style={{ background: '#8b5cf6' }} />Study</span>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>MySQL Database Practice</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>Foreign keys & query indexing</div>
              </div>
            </div>

            {/* Column 2 */}
            <div style={{ background: 'rgba(17, 24, 39, 0.8)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontWeight: 700, fontSize: '0.85rem', color: '#60a5fa' }}>
                <span>IN PROGRESS</span>
                <span className="badge badge-in_progress">1</span>
              </div>
              <div className="glass-card" style={{ padding: '0.85rem', marginBottom: '0.75rem', background: '#1e293b', borderLeft: '3px solid #3b82f6' }}>
                <span className="cat-tag" style={{ marginBottom: '0.35rem' }}><span className="cat-dot" style={{ background: '#3b82f6' }} />Work</span>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>Learn React & Hooks</div>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '0.35rem' }}>Subtasks: 2/4 completed (50%)</div>
              </div>
            </div>

            {/* Column 3 */}
            <div style={{ background: 'rgba(17, 24, 39, 0.8)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontWeight: 700, fontSize: '0.85rem', color: '#4ade80' }}>
                <span>COMPLETED</span>
                <span className="badge badge-completed">1</span>
              </div>
              <div className="glass-card" style={{ padding: '0.85rem', background: '#1e293b', opacity: 0.8, borderLeft: '3px solid #10b981' }}>
                <span className="cat-tag" style={{ marginBottom: '0.35rem' }}><span className="cat-dot" style={{ background: '#10b981' }} />Project</span>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>Build REST API with Flask</div>
                <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.35rem' }}>All subtasks verified</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {[
            {
              icon: ShieldCheck,
              title: 'JWT Authentication',
              desc: 'Secure password hashing with Werkzeug and stateless JWT authorization headers.'
            },
            {
              icon: Kanban,
              title: 'Interactive Kanban Board',
              desc: 'Drag and drop or seamlessly transition tasks across To Do, In Progress, and Completed.'
            },
            {
              icon: CheckCircle2,
              title: 'Nested Subtasks',
              desc: 'Break large tasks down into actionable steps with live completion progress tracking.'
            },
            {
              icon: Zap,
              title: 'Categories & Tagging',
              desc: 'Organize tasks into customizable color-coded categories (Work, Study, Personal, etc.).'
            },
            {
              icon: BarChart3,
              title: 'Real-Time Analytics',
              desc: 'Monitor completion velocity, upcoming deadlines, overdue tasks, and category distributions.'
            },
            {
              icon: Database,
              title: 'Dual DB: MySQL & SQLite',
              desc: 'Enterprise-ready relational schema with automated foreign keys and indexes.'
            }
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="glass-card" style={{ padding: '1.75rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(79, 70, 229, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#818cf8',
                  marginBottom: '1rem'
                }}>
                  <Icon size={22} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>{feature.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.8125rem'
      }}>
        TaskFlow — Full-Stack Portfolio Application (React • Python Flask • MySQL / SQLite • JWT)
      </footer>
    </div>
  );
};
