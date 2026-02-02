"use client";
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Hash,
  MessageSquare,
  Cpu,
  History
} from 'lucide-react';
import { Card } from '@/components/Card';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { config } from '@/config';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LogEntry {
  id: string;
  timestamp: string;
  model: string;
  key_name: string;
  prompt_tokens: number;
  completion_tokens: number;
  latency: string;
  status: 'success' | 'error';
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, [token]);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/admin/logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to fetch logs');
      // Mock data
      setLogs([
        { id: '1', timestamp: '2026-02-02 12:45:01', model: 'gpt-4o', key_name: 'Prod-Key-01', prompt_tokens: 154, completion_tokens: 840, latency: '1.2s', status: 'success' },
        { id: '2', timestamp: '2026-02-02 12:44:55', model: 'claude-3-5-sonnet', key_name: 'Testing-Anthropic', prompt_tokens: 2200, completion_tokens: 350, latency: '0.8s', status: 'success' },
        { id: '3', timestamp: '2026-02-02 12:44:40', model: 'gpt-4o', key_name: 'Prod-Key-01', prompt_tokens: 45, completion_tokens: 12, latency: '2.4s', status: 'error' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-[1400px]">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white m-0">
            System <span className="text-gradient">Records</span>
          </h1>
          <p className="text-text-secondary text-lg">Comprehensive audit trail of all gateway traffic</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-secondary text-sm">
            <Download size={18} />
            Export Logs
          </button>
          <button className="btn btn-primary text-sm">
            <Filter size={18} />
            Filter
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input type="text" placeholder="Search prompts..." className="input-field pl-12" />
        </div>
        <div className="flex items-center gap-2 px-4 bg-white/5 rounded-md border border-[var(--border-color)] text-text-secondary">
          <Clock size={18} />
          <span className="text-sm">Real-time update: Active</span>
        </div>
        <div className="flex items-center gap-4 px-4 bg-primary-glow border border-primary/20 rounded-md text-primary font-bold overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.1)]">
          <Activity size={18} />
          <span className="text-sm">Requests: 42.1 per minute</span>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-secondary">Timestamp</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-secondary">Model</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-secondary">Credential</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-secondary">Volume</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-secondary">Latency</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-secondary text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? logs.map((log) => (
                <tr key={log.id} className="group border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-text-secondary font-mono">
                      <Clock size={14} className="opacity-40" />
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Cpu size={14} className="text-primary" />
                      <span className="text-sm font-bold text-white">{log.model}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-text-secondary">{log.key_name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-text-secondary">
                        <span className="font-bold text-white">{log.prompt_tokens}</span> in
                      </span>
                      <span className="text-xs text-text-secondary">
                        <span className="font-bold text-white">{log.completion_tokens}</span> out
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <History size={14} className="text-warning" />
                      {log.latency}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide",
                      log.status === 'success' ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                    )}>
                      {log.status === 'success' ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                      {log.status}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-text-secondary italic">
                    {isLoading ? "Retrieving system logs..." : "No traffic data recorded in selected period."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
