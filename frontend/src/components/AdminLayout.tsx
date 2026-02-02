import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const AdminLayout = ({ children, onNavigate, currentPage }: LayoutProps) => {
  return (
    <div className="layout">
      <Navbar onNavigate={onNavigate} currentPage={currentPage} />
      <main className="container animate-fade-in">
        {children}
      </main>
      
      <footer className="footer container">
        <p>© 2026 llm-hub. Built for scale and performance.</p>
      </footer>

      <style>{`
        .layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        main {
          flex: 1;
        }
        .footer {
          padding: 3rem 0;
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.875rem;
          border-top: 1px solid var(--border-color);
          margin-top: 4rem;
        }
      `}</style>
    </div>
  );
};
