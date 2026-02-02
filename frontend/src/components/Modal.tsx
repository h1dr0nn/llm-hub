"use client";
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-[#020617]/80 backdrop-blur-[12px] opacity-100 transition-opacity duration-300" 
        onClick={onClose} 
      />
      <div className={cn(
        "relative w-full shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] overflow-hidden glass-accent animate-modal-enter outline-none",
        sizeClasses[size]
      )}>
        <div className="px-8 py-6 flex items-center justify-between border-b border-[var(--border-color)]">
          <h2 className="text-2xl font-bold m-0 text-gradient">{title}</h2>
          <button 
            className="bg-transparent border-none text-text-secondary cursor-pointer p-2 rounded-sm transition-all duration-300 flex hover:text-text-primary hover:bg-white/5 outline-none" 
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-8 overflow-y-auto flex-1 outline-none">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
