"use client";
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ title, subtitle, icon, children, className }: CardProps) => {
  return (
    <div className={cn("card glass animate-fade-in p-7", className)}>
      {(title || icon) && (
        <div className="card-header mb-6">
          <div className="header-content flex items-center gap-4">
            {icon && (
              <div className="card-icon text-primary bg-primary-glow p-[0.6rem] rounded-xl flex shadow-[inset_0_0_10px_rgba(var(--primary-rgb),0.1)]">
                {icon}
              </div>
            )}
            <div>
              {title && <h3 className="card-title text-[1.125rem] font-bold text-text-primary m-0">{title}</h3>}
              {subtitle && <p className="card-subtitle text-[0.8125rem] text-text-secondary m-0 mt-[0.125rem]">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
      <div className="card-content h-full">
        {children}
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isUp: boolean;
  };
  color?: 'primary' | 'accent' | 'success' | 'warning';
  className?: string;
}

export const StatCard = ({ label, value, icon: Icon, trend, color = 'primary', className }: StatCardProps) => {
  return (
    <div className={cn("card stat-card glass animate-fade-in flex justify-between items-center px-[1.75rem] py-[1.75rem]", className)}>
      <div className="stat-main flex flex-col">
        <span className="stat-label text-[0.875rem] font-semibold text-text-secondary mb-2 uppercase tracking-widest">{label}</span>
        <h2 className="stat-value text-[2.25rem] font-extrabold m-0 text-text-primary tracking-tighter">{value}</h2>
        {trend && (
          <div className={cn(
            "stat-trend text-[0.8125rem] mt-2 font-semibold flex items-center gap-1",
            trend.isUp ? "text-success" : "text-danger"
          )}>
            <span>{trend.isUp ? '↑' : '↓'}</span>
            <span>{trend.value}</span>
            <span className="text-text-secondary opacity-60 ml-1">vs last month</span>
          </div>
        )}
      </div>
      <div className={cn(
        "stat-icon-glow p-4 rounded-xl flex relative",
        color === 'primary' && "text-primary bg-primary-glow",
        color === 'accent' && "text-accent bg-accent-glow",
        color === 'success' && "text-success bg-success/10",
        color === 'warning' && "text-warning bg-warning/10"
      )}>
        <Icon size={28} />
      </div>
    </div>
  );
};
