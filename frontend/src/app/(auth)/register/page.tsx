"use client";
import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, UserPlus } from 'lucide-react';
import axios from 'axios';
import { config } from '@/config';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const BACKEND_URL = config.API_URL;

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`${BACKEND_URL}/auth/register`, {
        username,
        email,
        password
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="w-full max-w-[420px] p-10 rounded-lg glass text-center animate-fade-in">
          <div className="inline-flex p-4 bg-success/10 rounded-2xl text-success shadow-[0_0_30px_rgba(16,185,129,0.15)] mb-6">
            <ShieldCheck size={48} />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight"><span className="text-gradient">Success!</span></h1>
          <p className="text-text-secondary leading-relaxed">Your account has been created successfully. Redirecting to login portal...</p>
          <div className="mt-8 flex justify-center">
            <Loader2 className="animate-spin text-primary" size={24} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full animate-pulse-slow"></div>

      <div className="w-full max-w-[420px] p-10 rounded-lg glass animate-fade-in relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-accent-glow rounded-2xl text-accent shadow-[0_0_30px_rgba(139,92,246,0.15)] mb-4">
            <UserPlus size={48} />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Join <span className="text-gradient">LLM Hub</span></h1>
          <p className="text-text-secondary">Establish your gateway credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">Identifer</label>
            <div className="relative group">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                className="input-field pl-12 py-3" 
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">Email <span className="text-[10px] opacity-40 italic">(Optional)</span></label>
            <div className="relative group">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" />
              <input 
                type="email" 
                className="input-field pl-12 py-3" 
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">Security Code</label>
            <div className="relative group">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" />
              <input 
                type="password" 
                className="input-field pl-12 py-3" 
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">Validate Security Code</label>
            <div className="relative group">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" />
              <input 
                type="password" 
                className="input-field pl-12 py-3" 
                placeholder="Repeat security code"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-[13px] py-2.5 px-4 rounded-md text-center">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full py-4 text-md justify-center mt-4 group" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                Create Account 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="text-center pt-6 border-t border-white/5 mt-4">
            <p className="text-sm text-text-secondary">
              Already a member? <Link href="/login" className="text-primary font-bold hover:underline ml-1">Login here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
