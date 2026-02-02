"use client";
import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}: ConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="flex flex-col items-center text-center pt-2">
        <div className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center mb-8 relative",
          type === 'danger' ? "bg-danger/10 text-danger shadow-[0_0_30px_rgba(239,68,68,0.2)]" : 
          type === 'warning' ? "bg-warning/10 text-warning shadow-[0_0_30px_rgba(245,158,11,0.2)]" : 
          "bg-primary/10 text-primary shadow-[0_0_30px_rgba(6,182,212,0.2)]"
        )}>
          <div className="absolute inset-0 rounded-full animate-pulse-slow opacity-20 bg-current" />
          <AlertTriangle size={40} strokeWidth={1.5} />
        </div>
        
        <p className="text-text-secondary leading-relaxed text-base mb-10 max-w-md mx-auto">
          {message}
        </p>
        
        <div className="w-full">
          <button 
            className={cn(
              "btn h-14 w-full text-sm font-bold uppercase tracking-widest",
              type === 'danger' ? "bg-danger hover:bg-danger/90 text-white shadow-[0_4px_20px_rgba(239,68,68,0.3)]" : "btn-primary shadow-[0_4px_20px_rgba(6,182,212,0.3)]"
            )} 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
