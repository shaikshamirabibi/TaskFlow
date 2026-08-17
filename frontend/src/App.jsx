import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { TaskModal } from './components/TaskModal';
import { Toast } from './components/Toast';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { KanbanPage } from './pages/KanbanPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProfilePage } from './pages/ProfilePage';

const MainApp = () => {
  const { isAuthenticated, loading } = useAuth();
  const [authView, setAuthView] = useState('landing'); // 'landing', 'login', 'register'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'tasks', 'kanban', 'analytics', 'profile'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid rgba(99, 102, 241, 0.2)',
            borderTopColor: '#6366f1',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div>Loading TaskFlow...</div>
        </div>
      </div>
    );
  }

  // Unauthenticated routing
  if (!isAuthenticated) {
    if (authView === 'login') {
      return (
        <LoginPage 
          onSwitchToRegister={() => setAuthView('register')}
          onBackToLanding={() => setAuthView('landing')}
        />
      );
    }
    if (authView === 'register') {
      return (
        <RegisterPage 
          onSwitchToLogin={() => setAuthView('login')}
          onBackToLanding={() => setAuthView('landing')}
        />
      );
    }
    return (
      <LandingPage 
        onGetStarted={() => setAuthView('register')}
        onLoginClick={() => setAuthView('login')}
      />
    );
  }

  // Authenticated Dashboard Layout
  return (
    <TaskProvider>
      <div className="app-container">
        {/* Main Content Area */}
        <div className="main-content">
          <Navbar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            toggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          />

          <div style={{ display: 'flex', flex: 1 }}>
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              mobileOpen={mobileSidebarOpen}
              closeMobileSidebar={() => setMobileSidebarOpen(false)}
            />

            <main style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
              {activeTab === 'dashboard' && <DashboardPage setActiveTab={setActiveTab} />}
              {activeTab === 'tasks' && <TasksPage />}
              {activeTab === 'kanban' && <KanbanPage />}
              {activeTab === 'analytics' && <AnalyticsPage />}
              {activeTab === 'profile' && <ProfilePage />}
            </main>
          </div>
        </div>

        {/* Global Modals & Notifications */}
        <TaskModal />
        <Toast />
      </div>
    </TaskProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
