"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Trash2, Cpu, History, MessageSquare, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { config } from '@/config';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  usage?: {
    total_tokens: number;
    latency: string;
  };
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState('smart');
  const [useHistory, setUseHistory] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = useHistory ? messages : [];
      const response = await axios.post(`${config.API_URL}/chat`, {
        model,
        messages: [...history, userMessage],
        temperature: 0.7
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.choices[0].message.content,
        usage: {
          total_tokens: response.data.usage.total_tokens,
          latency: `0.8s`
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${error.response?.data?.detail || 'Failed to connect to gateway'}`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col animate-fade-in relative z-10 transition-all">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white m-0">
            Chat <span className="text-gradient">Playground</span>
          </h1>
          <p className="text-text-secondary text-lg">Interactive environment to test your logical models</p>
        </div>
        <div className="flex items-center gap-5 px-5 py-2.5 rounded-full glass border border-[var(--border-color)]">
          <div className="flex items-center gap-3 text-text-secondary">
            <Cpu size={16} />
            <select 
              value={model} 
              onChange={e => setModel(e.target.value)} 
              className="bg-transparent border-none text-text-primary font-semibold text-sm cursor-pointer focus:outline-none"
            >
              <option value="smart">Smart Model</option>
              <option value="fast">Fast Model</option>
              <option value="cheap">Cheap Model</option>
            </select>
          </div>
          <div className="w-[1px] h-6 bg-[var(--border-color)]"></div>
          <div className="flex items-center gap-3 text-text-secondary">
            <History size={16} />
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setUseHistory(!useHistory)}>
              <div className={cn(
                "w-9 h-5 rounded-full relative transition-colors duration-300",
                useHistory ? "bg-primary" : "bg-white/10"
              )}>
                <div className={cn(
                  "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                  useHistory ? "right-1" : "left-1"
                )}></div>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest group-hover:text-white transition-colors">Memory</span>
            </div>
          </div>
          <div className="w-[1px] h-6 bg-[var(--border-color)]"></div>
          <button 
            className="text-text-secondary hover:text-danger p-1 rounded-md transition-colors" 
            onClick={clearChat} 
            title="Clear Context"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col gap-6 min-h-0">
        <div className="flex-1 overflow-y-auto flex flex-col gap-8 p-8 rounded-lg glass border border-[var(--border-color)] scroll-smooth custom-scrollbar" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-text-secondary">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-primary shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                <MessageSquare size={48} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Start a Conversation</h3>
              <p className="max-w-xs text-center opacity-60">Type a message below to test the routing engine and provider chain.</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === 'user' ? "self-end flex-row-reverse" : "self-start"
              )}>
                <div className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border border-[var(--border-color)] bg-white/5",
                  msg.role === 'user' ? "text-primary border-primary/20" : "text-white"
                )}>
                  {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div className="flex flex-col gap-2">
                  <div className={cn(
                    "px-5 py-4 rounded-xl text-md leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-primary text-white border-none rounded-tr-none shadow-lg shadow-primary/10" 
                      : "bg-white/5 text-text-primary rounded-tl-none border border-white/5"
                  )}>
                    {msg.content}
                  </div>
                  {msg.usage && (
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-secondary px-2">
                      <span className="text-primary">{msg.usage.total_tokens} tokens</span>
                      <span className="opacity-30">•</span>
                      <span>{msg.usage.latency}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-4 max-w-[85%] self-start">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border border-primary/20 bg-primary/10 text-primary animate-pulse">
                <Bot size={18} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="px-5 py-4 rounded-xl rounded-tl-none bg-white/5 border border-white/5 flex items-center gap-3">
                  <Loader2 className="animate-spin text-primary" size={16} />
                  <span className="text-sm font-medium text-text-secondary italic">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <form className="flex gap-4" onSubmit={handleSend}>
          <input 
            type="text" 
            placeholder="Ask anything..." 
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 px-7 py-5 rounded-md text-md glass border border-[var(--border-color)] text-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary-glow transition-all"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="btn btn-primary w-20 flex items-center justify-center rounded-md" 
            disabled={isLoading || !input.trim()}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
