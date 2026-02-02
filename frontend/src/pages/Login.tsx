import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8005/v1';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/auth/login`, {
        username,
        password
      });
      login(response.data.access_token);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card glass animate-fade-in">
        <div className="login-header">
          <ShieldCheck className="logo-icon" size={48} />
          <h1 className="text-cyan-gradient">Welcome Back</h1>
          <p>Login to manage your LLM gateway</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input 
                type="text" 
                className="input-field" 
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary login-btn" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                Sign In <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, #0f172a 0%, #030712 100%);
        }
        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 3rem;
          border-radius: var(--radius-lg);
          text-align: center;
        }
        .login-header {
          margin-bottom: 2.5rem;
        }
        .login-header h1 {
          margin: 1rem 0 0.5rem;
          font-size: 2rem;
        }
        .login-header p {
          color: var(--text-secondary);
        }
        .login-form {
          text-align: left;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .input-wrapper {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
        }
        .input-field {
          padding-left: 3rem;
        }
        .login-btn {
          width: 100%;
          margin-top: 1rem;
          padding: 0.8rem;
          font-size: 1rem;
        }
        .error-message {
          color: var(--danger);
          background: rgba(239, 68, 68, 0.1);
          padding: 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
          text-align: center;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
