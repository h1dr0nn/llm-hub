"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Key, 
  Activity, 
  Settings, 
  ShieldCheck, 
  LogOut,
  Shuffle,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/dashboard' },
  { id: 'keys', label: 'API Keys', icon: <Key size={20} />, href: '/keys' },
  { id: 'routing', label: 'Auto Router', icon: <Shuffle size={20} />, href: '/routing' },
  { id: 'chat', label: 'Playground', icon: <MessageSquare size={20} />, href: '/chat' },
  { id: 'logs', label: 'System Logs', icon: <Activity size={20} />, href: '/logs' },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] glass border-r border-[var(--border-color)] z-50 transition-all duration-300 md:w-[280px] sm:w-[80px] xs:w-0">
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center gap-3 mb-10 pl-2">
          <div className="bg-primary-glow p-2 rounded-lg text-primary shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <ShieldCheck size={28} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white sm:hidden md:block">llm-hub</span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] font-medium transition-all duration-300 group outline-none",
                pathname === item.href 
                  ? "bg-primary-glow text-primary" 
                  : "text-text-secondary hover:bg-white/5 hover:text-white"
              )}
            >
              <div className={cn(
                "transition-transform duration-300 group-hover:scale-110",
                pathname === item.href ? "text-primary" : "text-text-secondary group-hover:text-white"
              )}>
                {item.icon}
              </div>
              <span className="sm:hidden md:block">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-6">
          <div className="bg-white/5 rounded-xl p-4 border border-white/5 sm:hidden md:block">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-accent-glow flex items-center justify-center text-accent text-xs font-bold border border-accent/20">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white leading-tight">{user?.username || 'Admin'}</span>
                <span className="text-[10px] text-text-secondary uppercase tracking-widest">{user?.role || 'Pro User'}</span>
              </div>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1">
              <div className="bg-primary w-2/3 h-full rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
            </div>
          </div>

          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md font-medium text-text-secondary hover:bg-danger/10 hover:text-danger transition-all duration-300 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="sm:hidden md:block">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
