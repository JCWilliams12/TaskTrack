import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import TaskList from './components/TaskList';
import './App.css';

const AppContent: React.FC = () => {
  const { user, logout, loading, checkTokenValidity } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Periodic token validation for idle time scenarios
  useEffect(() => {
    if (!user) return;

    const validateTokenPeriodically = () => {
      if (!checkTokenValidity()) {
        console.log('Token validation failed, user will be logged out');
      }
    };

    // Check token validity every 5 minutes
    const interval = setInterval(validateTokenPeriodically, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, checkTokenValidity]);

  if (loading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app">
        <div className="auth-container">
          <div className="auth-header">
            <h1>TaskTrack</h1>
            <p>Organize your tasks efficiently</p>
          </div>
          {isLoginMode ? (
            <LoginForm onToggleMode={() => setIsLoginMode(false)} />
          ) : (
            <RegisterForm onToggleMode={() => setIsLoginMode(true)} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>TaskTrack</h1>
          <div className="user-info">
            <span>Welcome, {user.username}!</span>
            <button onClick={logout} className="btn btn-outline">
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="app-main">
        <TaskList />
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
