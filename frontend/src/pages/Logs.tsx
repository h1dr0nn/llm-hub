import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { Terminal, Clock, Hash, Cpu } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8005/v1';

interface UsageLog {
  id: number;
  api_key_id: number;
  timestamp: number;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

const LogsPage = () => {
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(response.data);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    }
  };

  const formatDate = (ts: number) => {
    return new Date(ts * 1000).toLocaleString();
  };

  return (
    <div className="logs-page">
      <div className="page-header">
        <h1 className="text-gradient">System Logs</h1>
        <p className="subtitle">Real-time audit trail of all LLM requests</p>
      </div>

      <Card className="logs-card">
        <div className="table-container">
          <table className="logs-table">
            <thead>
              <tr>
                <th><Clock size={16} /> Time</th>
                <th><Hash size={16} /> ID</th>
                <th><Cpu size={16} /> Model</th>
                <th>Prompt</th>
                <th>Comp.</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="animate-fade-in">
                  <td className="time-col">{formatDate(log.timestamp)}</td>
                  <td className="id-col">#{log.id}</td>
                  <td className="model-col">
                    <span className="model-badge">{log.model}</span>
                  </td>
                  <td>{log.prompt_tokens}</td>
                  <td>{log.completion_tokens}</td>
                  <td className="total-col">{log.total_tokens}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-state">
                    <Terminal size={48} />
                    <p>No usage logs found yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <style>{`
        .logs-card {
          padding: 0;
          overflow: hidden;
        }
        .table-container {
          width: 100%;
          overflow-x: auto;
        }
        .logs-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .logs-table th {
          padding: 1.25rem 1.5rem;
          background: rgba(255,255,255,0.03);
          color: var(--text-secondary);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border-color);
        }
        .logs-table th svg {
          vertical-align: middle;
          margin-right: 0.4rem;
          opacity: 0.7;
        }
        .logs-table td {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
          font-size: 0.9rem;
        }
        .logs-table tr:last-child td {
          border-bottom: none;
        }
        .logs-table tr:hover td {
          background: rgba(255,255,255,0.02);
        }
        .time-col {
          color: var(--text-secondary);
          white-space: nowrap;
        }
        .id-col {
          font-family: monospace;
          color: var(--primary);
        }
        .model-badge {
          background: var(--primary-glow);
          color: var(--primary);
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
        }
        .total-col {
          font-weight: 700;
          color: var(--text-primary);
        }
        .empty-state {
          padding: 5rem 0;
          text-align: center;
          color: var(--text-secondary);
        }
        .empty-state svg {
          margin-bottom: 1rem;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
};

export default LogsPage;
