"use client";
import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { config } from '@/config';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const BACKEND_URL = config.API_URL;

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

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
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full animate-pulse-slow"></div>

      <div className="w-full max-w-[420px] p-10 rounded-lg glass animate-fade-in relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-primary-glow rounded-2xl text-primary shadow-[0_0_30px_rgba(6,182,212,0.15)] mb-4">
            <ShieldCheck size={48} />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Welcome <span className="text-gradient">Back</span></h1>
          <p className="text-text-secondary">Login to manage your LLM gateway</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">Username</label>
            <div className="relative group">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                className="input-field pl-12" 
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">Password</label>
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" />
              <input 
                type="password" 
                className="input-field pl-12" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-sm py-3 px-4 rounded-md text-center animate-shake">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full py-4 text-md justify-center mt-2 group" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                Sign In 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="text-center pt-6 border-t border-white/5">
            <p className="text-sm text-text-secondary">
              Don't have an account? <Link href="/register" className="text-primary font-bold hover:underline ml-1">Register here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
