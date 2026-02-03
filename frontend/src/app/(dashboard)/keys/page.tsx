"use client";
import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Plus, 
  Trash2, 
  Search, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  CheckCircle,
  AlertCircle,
  Clock,
  Settings,
  MoreVertical,
  Zap,
  Shield,
  RefreshCw
} from 'lucide-react';
import { Card } from '@/components/Card';
import { Modal } from '@/components/Modal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Dropdown } from '@/components/Dropdown';
import { Switch } from '@/components/Switch';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { config } from '@/config';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  OpenAI, 
  Anthropic, 
  Gemini, 
  Mistral, 
  DeepSeek, 
  Groq, 
  Perplexity, 
  Together, 
  OpenRouter, 
  Cohere, 
  Grok 
} from '@lobehub/icons';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface APIKey {
  id: string;
  name: string;
  provider: string;
  key_prefix: string;
  status: 'active' | 'expired' | 'revoked';
  usage: number;
  last_used: string;
}

const providerOptions = [
  { label: 'OpenAI', value: 'openai' },
  { label: 'Anthropic', value: 'anthropic' },
  { label: 'Gemini', value: 'gemini' },
  { label: 'Mistral AI', value: 'mistral' },
  { label: 'DeepSeek', value: 'deepseek' },
  { label: 'Groq', value: 'groq' },
  { label: 'Perplexity', value: 'perplexity' },
  { label: 'Together AI', value: 'together' },
  { label: 'OpenRouter', value: 'openrouter' },
  { label: 'Cohere', value: 'cohere' },
  { label: 'xAI (Grok)', value: 'xai' },
];

const ProviderIcon = ({ provider }: { provider: string }) => {
  const p = provider.toLowerCase();
  
  const iconComponents: Record<string, any> = {
    openai: OpenAI,
    anthropic: Anthropic,
    gemini: Gemini.Color,
    groq: Groq,
    mistral: Mistral.Color,
    deepseek: DeepSeek.Color,
    perplexity: Perplexity.Color,
    together: Together.Color,
    openrouter: OpenRouter,
    cohere: Cohere.Color,
    xai: Grok
  };

  const Icon = iconComponents[p];

  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 bg-white/5 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 overflow-hidden">
      {Icon ? <Icon size={24} /> : <Zap size={20} className="text-text-secondary" />}
    </div>
  );
};

const keyPlaceholders: Record<string, string> = {
  openai: 'sk-proj-...',
  anthropic: 'sk-ant-api03-...',
  gemini: 'AIza...',
  mistral: 'Mistral API Key (32 chars)',
  deepseek: 'sk-...',
  groq: 'gsk_...',
  perplexity: 'pplx-...',
  openrouter: 'sk-or-v1-...',
  together: 'Together API Key',
  cohere: 'Cohere API Key (40 chars)',
  xai: 'xAI-...',
};

export default function KeysPage() {
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<APIKey | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newKey, setNewKey] = useState({ name: '', provider: 'openai', key: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchKeys();
  }, [token]);

  const fetchKeys = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/admin/keys`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Map backend fields to frontend expected names
      const mappedKeys = response.data.map((k: any) => ({
        ...k,
        id: String(k.id),
        name: k.name || 'API Instance',
        provider: k.provider,
        key_prefix: k.key_prefix || 'sk-***',
        status: k.is_active ? 'active' : 'revoked',
        usage: k.used_today || 0,
        last_used: 'Recently'
      }));
      setKeys(mappedKeys);
    } catch (error) {
      console.error('Failed to fetch keys');
      setKeys([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateKey = async () => {
    if (!selectedKey) return;
    try {
      await axios.patch(`${config.API_URL}/admin/keys/${selectedKey.id}`, {
        is_active: selectedKey.status === 'active',
        // future: name, daily_quota
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchKeys();
      setIsSettingsOpen(false);
    } catch (error) {
      console.error('Failed to update key');
    }
  };

  // Helper to toggle status directly from internal state
  const toggleKeyStatus = async (key: APIKey, newStatus: boolean) => {
    try {
      await axios.patch(`${config.API_URL}/admin/keys/${key.id}`, {
        is_active: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchKeys();
      // Update selected key local state if open
      if (selectedKey && selectedKey.id === key.id) {
         setSelectedKey({...selectedKey, status: newStatus ? 'active' : 'revoked'});
      }
    } catch (error) {
      console.error('Failed to toggle key status');
    }
  }

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Map 'google' label to 'gemini' for backend if needed, 
      // but backend RoutingEngine already handles mapping or expects internal names.
      const payload = {
        name: newKey.name.trim() || 'My API Key',
        provider: newKey.provider,
        key_value: newKey.key
      };
      
      await axios.post(`${config.API_URL}/admin/keys`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchKeys();
      setIsModalOpen(false);
      setNewKey({ name: '', provider: 'openai', key: '' });
    } catch (error) {
      console.error('Failed to add key');
    }
  };

  const openDeleteConfirm = (id: string) => {
    setKeyToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const deleteKey = async () => {
    if (!keyToDelete) return;
    try {
      await axios.delete(`${config.API_URL}/admin/keys/${keyToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchKeys();
    } catch (error) {
      console.error('Failed to delete key');
    } finally {
      setKeyToDelete(null);
    }
  };

  const [securitySettings, setSecuritySettings] = useState({
    autoRotate: true,
    logFullRequests: false
  });

  const openSettings = (key: APIKey) => {
    setSelectedKey(key);
    setSecuritySettings({
      autoRotate: true, // Mock
      logFullRequests: false // Mock
    });
    setIsSettingsOpen(true);
  };

  const filteredKeys = keys.filter(k => 
    (k.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (k.provider?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in max-w-[1400px]">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white m-0">
            Vault <span className="text-gradient">Management</span>
          </h1>
          <p className="text-text-secondary text-lg">Securely manage and monitor your provider credentials</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          Create New Key
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or provider..." 
            className="input-field pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-4 bg-white/5 rounded-[var(--radius-md)] border border-[var(--border-color)] text-text-secondary text-sm">
          <Clock size={16} />
          <span>Last Sync: Just Now</span>
          <button className="ml-2 p-1 hover:text-primary transition-colors" onClick={fetchKeys}>
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-secondary">Key Instance</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-secondary">Provider</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-secondary">Usage (USD)</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-secondary">Health Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-secondary">Last Active</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-secondary text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredKeys.length > 0 ? filteredKeys.map((key) => (
                  <tr key={key.id} className="group border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                     {/* ... cols 1-3 ... */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-white mb-1">{key.name}</span>
                        <code className="text-xs text-text-secondary opacity-60 bg-white/5 px-2 py-1 rounded inline-block w-fit">{key.key_prefix}</code>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <ProviderIcon provider={key.provider} />
                        <span className="capitalize text-sm font-bold text-white/90">{key.provider}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">${(key.usage || 0).toFixed(2)}</span>
                        <div className="w-24 bg-white/10 h-1 rounded-full mt-2">
                          <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min(((key.usage || 0)/2000)*100, 100)}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide cursor-pointer hover:opacity-80 transition-opacity",
                        key.status === 'active' ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                      )} onClick={() => toggleKeyStatus(key, key.status !== 'active')}>
                        {key.status === 'active' ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                        {key.status}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-text-secondary">{key.last_used}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {/* ... actions ... */}
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openSettings(key)}
                          className="p-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-md transition-all"
                        >
                          <Settings size={18} />
                        </button>
                        <button 
                          onClick={() => openDeleteConfirm(key.id)}
                          className="p-2 text-danger/60 hover:text-danger hover:bg-danger/10 rounded-md transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-text-secondary italic">
                      No credentials found in vault. Create one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ... Add Key Modal ... */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add Provider Key"
        size="md"
      >
         {/* ... form ... */}
         <form onSubmit={handleAddKey} className="space-y-6">
             {/* ... form content ... */}
             {/* ... Reusing existing form content lines 342-377 ... */}
              <div className="space-y-2">
            <label className="text-sm font-bold text-text-secondary uppercase tracking-widest">Instance Label</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Production OpenAI"
              value={newKey.name}
              onChange={e => setNewKey({...newKey, name: e.target.value})}
              required
            />
          </div>
          
          <Dropdown
            label="Provider Network"
            options={providerOptions}
            value={newKey.provider}
            onChange={(val) => setNewKey({...newKey, provider: val})}
          />

          <div className="space-y-2">
            <label className="text-sm font-bold text-text-secondary uppercase tracking-widest">API Secret</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50" size={18} />
              <input 
                type="password" 
                className="input-field pl-12" 
                placeholder={keyPlaceholders[newKey.provider] || 'sk-...'}
                value={newKey.key}
                onChange={e => setNewKey({...newKey, key: e.target.value})}
                required
              />
            </div>
            <p className="text-[10px] text-text-secondary/60 mt-2">
              Keys are encrypted at rest using industry-standard AES-256-GCM.
            </p>
          </div>
          <div className="pt-4">
            <button type="submit" className="btn btn-primary w-full h-14 text-sm font-bold uppercase tracking-widest shadow-[0_4px_20px_rgba(6,182,212,0.3)]">Provision Key</button>
          </div>
         </form>
      </Modal>

      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Key Configuration"
        size="md"
      >
        <div className="space-y-6">
          <div className="p-4 bg-white/5 border border-white/5 rounded-[var(--radius-md)]">
             {/* ... Key info ... */}
             <div className="flex items-center gap-3 text-primary mb-3">
              <Shield size={20} />
              <span className="font-bold">Instance Info</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Label:</span>
                <span className="text-white font-medium">{selectedKey?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Provider:</span>
                <span className="text-white font-medium capitalize">{selectedKey?.provider}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary">Security Settings</h4>
            <div className="space-y-3">
              <Switch 
                label="Key Active Status" 
                checked={selectedKey?.status === 'active'} 
                onChange={(val) => toggleKeyStatus(selectedKey!, val)} 
              />
               {/* Mock settings disabled visually or kept as future */}
              <div className="opacity-50 pointer-events-none">
                  <Switch 
                    label="Auto-Rotate Key (Coming Soon)" 
                    checked={securitySettings.autoRotate} 
                    onChange={(val) => setSecuritySettings({...securitySettings, autoRotate: val})} 
                  />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              className="btn btn-primary w-full h-14 text-sm font-bold uppercase tracking-widest shadow-[0_4px_20px_rgba(6,182,212,0.3)]" 
              onClick={() => setIsSettingsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={deleteKey}
        title="Revoke Key pair"
        message="This action will permanently invalidate this API key. Any applications using this instance will lose connectivity immediately."
        confirmText="Yes, Revoke Key"
      />
    </div>
  );
}
