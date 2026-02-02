"use client";
import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Shuffle, CheckCircle, Smartphone, Zap, DollarSign, Activity, Settings2, ArrowRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function RoutingPage() {
  const [activeTab, setActiveTab] = useState('smart');

  const models: any = {
    smart: {
      title: "Smart Routing",
      subtitle: "Prioritizes reasoning and quality",
      icon: <Zap size={24} className="text-cyan-400" />,
      providers: [
        { name: "OpenAI", model: "GPT-4o", priority: 1, latency: "2.4s", status: "Active" },
        { name: "Anthropic", model: "Claude 3.5 Sonnet", priority: 2, latency: "1.8s", status: "Active" },
        { name: "Gemini", model: "Gemini 1.5 Pro", priority: 3, latency: "3.2s", status: "Active" }
      ]
    },
    fast: {
      title: "Fast Routing",
      subtitle: "Prioritizes speed and responsiveness",
      icon: <Smartphone size={24} className="text-emerald-400" />,
      providers: [
        { name: "Groq", model: "Llama 3.1 70B", priority: 1, latency: "0.2s", status: "Active" },
        { name: "OpenAI", model: "GPT-4o mini", priority: 2, latency: "0.8s", status: "Active" },
        { name: "Gemini", model: "Gemini 1.5 Flash", priority: 3, latency: "1.1s", status: "Active" }
      ]
    },
    cheap: {
      title: "Cheap Routing",
      subtitle: "Prioritizes low-cost inference",
      icon: <DollarSign size={24} className="text-amber-400" />,
      providers: [
        { name: "DeepSeek", model: "DeepSeek Chat", priority: 1, latency: "1.4s", status: "Active" },
        { name: "Groq", model: "Llama 3 8B", priority: 2, latency: "0.1s", status: "Active" },
        { name: "Gemini", model: "Gemini 1.5 Flash", priority: 3, latency: "0.9s", status: "Active" }
      ]
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-[1400px]">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white m-0">
            Auto <span className="text-gradient">Router</span>
          </h1>
          <p className="text-text-secondary text-lg">Configure logical model mappings and provider priorities</p>
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-full glass-accent border border-primary/20 text-primary font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.1)]">
          <Shuffle size={18} />
          <span>Dynamic Fallback Active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(models).map(([key, config]: [string, any]) => (
          <button
            key={key}
            className={cn(
              "flex items-center gap-5 p-6 rounded-lg text-left transition-all duration-300 border backdrop-blur-md",
              activeTab === key 
                ? "bg-primary-glow border-primary/50 shadow-[0_0_25px_rgba(6,182,212,0.1)] scale-[1.02]" 
                : "bg-surface border-white/5 text-text-secondary hover:border-white/20 hover:-translate-y-1"
            )}
            onClick={() => setActiveTab(key)}
          >
            <div className={cn(
              "p-3 rounded-lg flex-shrink-0",
              activeTab === key ? "bg-white/10" : "bg-white/5"
            )}>
              {config.icon}
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "font-extrabold text-lg transition-colors",
                activeTab === key ? "text-white" : "text-text-secondary"
              )}>{config.title}</span>
              <span className="text-xs opacity-60 leading-tight mt-1">{config.subtitle}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="routing-content">
        <Card title="Traffic Validation Chain" subtitle="Provider failover sequence">
          <div className="flex flex-col gap-0 py-4 max-w-4xl mx-auto">
            {models[activeTab].providers.map((p: any, idx: number) => (
              <div key={p.name} className="flex flex-col items-center">
                <div className="w-full flex items-center gap-8 px-8 py-5 rounded-md glass border border-white/5 group hover:border-primary/30 transition-all">
                  <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center font-extrabold text-primary shadow-inner">
                    {idx + 1}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <span className="font-extrabold text-white text-lg">{p.name}</span>
                    <span className="text-sm text-text-secondary opacity-60 flex items-center gap-2">
                       <ArrowRight size={12} /> {p.model}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 px-6 border-l border-white/5">
                    <div className="flex items-center gap-2 text-sm text-success font-bold">
                      <CheckCircle size={14} />
                      <span className="uppercase tracking-widest text-[10px]">{p.status}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary font-mono bg-white/5 px-3 py-1 rounded">
                      <Activity size={14} className="opacity-50" />
                      <span>{p.latency}</span>
                    </div>
                  </div>
                  <button className="p-2 text-text-secondary hover:text-primary transition-colors">
                    <Settings2 size={20} />
                  </button>
                </div>
                {idx < models[activeTab].providers.length - 1 && (
                  <div className="flex flex-col items-center my-2 group">
                    <div className="w-0.5 h-10 bg-gradient-to-b from-primary to-transparent opacity-60 group-hover:h-12 transition-all duration-300"></div>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-text-secondary opacity-40 group-hover:opacity-100 transition-opacity">Fallback</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
