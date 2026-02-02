"use client";
import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <span className="text-text-secondary font-bold uppercase tracking-widest animate-pulse">Initializing Security Protocol...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-[280px] flex flex-col md:ml-[280px] sm:ml-[80px] xs:ml-0 overflow-x-hidden">
        <main className="flex-1 p-10 w-full">
          {children}
        </main>
        <footer className="mt-auto px-10 py-8 border-t border-[var(--border-color)] text-center">
          <p className="text-text-secondary text-[0.8125rem] font-medium tracking-wide">
            © 2026 <span className="text-primary font-bold">LLM Hub</span>. Enterprise-grade AI Gateway.
          </p>
        </footer>
      </div>
    </div>
  );
}
