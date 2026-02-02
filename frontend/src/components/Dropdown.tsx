"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const Dropdown = ({ 
  options, 
  value, 
  onChange, 
  label, 
  placeholder = "Select an option",
  className 
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("space-y-2 w-full", className)} ref={dropdownRef}>
      {label && <label className="text-sm font-bold text-text-secondary uppercase tracking-widest">{label}</label>}
      <div className="relative">
        <button
          type="button"
          className="w-full flex items-center justify-between px-4 py-3 bg-[rgba(15,23,42,0.5)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-white transition-all duration-300 focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary-glow"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={cn(!selectedOption && "text-text-secondary/50")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={cn("transition-transform duration-300", isOpen && "rotate-180")} size={18} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-1.5 glass-accent rounded-[var(--radius-md)] shadow-2xl z-[1100] animate-fade-in max-h-60 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2.5 rounded-sm text-sm font-medium transition-colors",
                  opt.value === value 
                    ? "bg-primary-glow text-primary" 
                    : "text-text-secondary hover:bg-white/5 hover:text-white"
                )}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                <span>{opt.label}</span>
                {opt.value === value && <Check size={16} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
