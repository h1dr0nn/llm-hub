"use client";
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export const Switch = ({ checked, onChange, label }: SwitchProps) => {
  const handleToggle = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    onChange(!checked);
  };

  return (
    <div 
      className="flex items-center justify-between p-3 bg-white/5 rounded-[var(--radius-md)] cursor-pointer hover:bg-white/10 transition-colors outline-none group"
      onClick={handleToggle}
    >
      {label && <span className="text-sm font-medium text-text-secondary group-hover:text-white transition-colors">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
          checked ? "bg-primary" : "bg-white/10"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
};
