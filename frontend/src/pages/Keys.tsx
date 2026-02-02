import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Shield, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8005/v1';

interface APIKey {
  id: number;
  provider: string;
  daily_quota: number;
  used_today: number;
  is_active: boolean;
  cooldown_until: number | null;
}

const KeysPage = () => {
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState({ provider: 'openai', key_value: '', daily_quota: 50000 });
  const [showValues, setShowValues] = useState<Record<number, boolean>>({});
  const { token } = useAuth();

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/keys`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKeys(response.data);
    } catch (error) {
      console.error("Failed to fetch keys:", error);
    }
  };

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/admin/keys`, newKey, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsAdding(false);
      setNewKey({ provider: 'openai', key_value: '', daily_quota: 50000 });
      fetchKeys();
    } catch (error) {
      console.error("Failed to add key:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this API key?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/admin/keys/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchKeys();
    } catch (error) {
      console.error("Failed to delete key:", error);
    }
  };

  const toggleValue = (id: number) => {
    setShowValues(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="keys-page">
      <div className="page-header">
        <div>
          <h1 className="text-gradient">API Key Management</h1>
          <p className="subtitle">Securely manage your provider credentials</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
          <Plus size={20} /> Add New Key
        </button>
      </div>

      {isAdding && (
        <div className="modal-overlay">
          <div className="modal-content glass animate-fade-in">
            <h3>Add Provider Key</h3>
            <form onSubmit={handleAddKey}>
              <div className="form-group">
                <label>Provider</label>
                <select 
                  className="input-field"
                  value={newKey.provider}
                  onChange={e => setNewKey({...newKey, provider: e.target.value})}
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="gemini">Gemini</option>
                  <option value="deepseek">DeepSeek</option>
                  <option value="groq">Groq</option>
                </select>
              </div>
              <div className="form-group">
                <label>API Key</label>
                <input 
                  type="password"
                  className="input-field"
                  placeholder="sk-..."
                  value={newKey.key_value}
                  onChange={e => setNewKey({...newKey, key_value: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Daily Quota (Tokens)</label>
                <input 
                  type="number"
                  className="input-field"
                  value={newKey.daily_quota}
                  onChange={e => setNewKey({...newKey, daily_quota: parseInt(e.target.value)})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Key</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="keys-grid">
        {keys.map(key => (
          <Card key={key.id} className="key-card">
            <div className="key-header">
              <div className="provider-info">
                <Shield size={24} className="provider-icon" />
                <span className="provider-name">{key.provider.toUpperCase()}</span>
              </div>
              <div className={`status-badge ${key.is_active ? 'active' : 'inactive'}`}>
                {key.is_active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                {key.is_active ? 'Active' : 'Inactive'}
              </div>
            </div>

            <div className="key-value-section">
              <span className="label">Key Value</span>
              <div className="value-display">
                <code>{showValues[key.id] ? "CONNECTED" : "••••••••••••••••"}</code>
                <button className="icon-btn" onClick={() => toggleValue(key.id)}>
                  {showValues[key.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="key-quota-section">
              <div className="quota-header">
                <span className="label">Daily Usage</span>
                <span className="quota-text">{key.used_today.toLocaleString()} / {key.daily_quota === 0 ? '∞' : key.daily_quota.toLocaleString()}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min(100, (key.used_today / (key.daily_quota || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="key-footer">
              <button className="btn-delete" onClick={() => handleDelete(key.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
        }
        .keys-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }
        .key-card {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .key-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .provider-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .provider-icon {
          color: var(--primary);
        }
        .provider-name {
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.25rem 0.6rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .status-badge.active {
          background: rgba(16, 185, 129, 0.1);
          color: var(--success);
        }
        .status-badge.inactive {
          background: rgba(239, 68, 68, 0.1);
          color: var(--danger);
        }
        .key-value-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
        }
        .value-display {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(0,0,0,0.2);
          padding: 0.6rem 0.8rem;
          border-radius: var(--radius-sm);
        }
        .icon-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
        }
        .key-quota-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .quota-header {
          display: flex;
          justify-content: space-between;
        }
        .quota-text {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .progress-bar {
          height: 6px;
          background: rgba(255,255,255,0.05);
          border-radius: 100px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: var(--primary);
          box-shadow: 0 0 10px var(--primary-glow);
        }
        .key-footer {
          display: flex;
          justify-content: flex-end;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }
        .btn-delete {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition);
        }
        .btn-delete:hover {
          color: var(--danger);
        }
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          width: 100%;
          max-width: 500px;
          padding: 2.5rem;
          border-radius: var(--radius-lg);
        }
        .modal-content h3 {
          margin-bottom: 2rem;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
};

export default KeysPage;
