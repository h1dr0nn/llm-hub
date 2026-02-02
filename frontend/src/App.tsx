import React, { useState } from 'react';
import { AdminLayout } from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import KeysPage from './pages/Keys';
import LogsPage from './pages/Logs';
import LoginPage from './pages/Login';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('overview');

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader glass">
          <div className="spinner"></div>
          <span>Securely connecting to gateway...</span>
        </div>
        <style>{`
          .loading-screen {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #030712;
            color: white;
          }
          .loader {
            padding: 2rem 3rem;
            border-radius: var(--radius-lg);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(6, 182, 212, 0.1);
            border-top-color: var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch(currentPage) {
      case 'overview': return <Dashboard />;
      case 'keys': return <KeysPage />;
      case 'logs': return <LogsPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <AdminLayout onNavigate={setCurrentPage} currentPage={currentPage}>
      {renderPage()}
    </AdminLayout>
  );
}

export default App;
