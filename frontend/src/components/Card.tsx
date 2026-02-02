import React from 'react';

interface CardProps {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ title, icon, children, className = "" }: CardProps) => {
  return (
    <div className={`card glass animate-fade-in ${className}`}>
      {(title || icon) && (
        <div className="card-header">
          {icon && <span className="card-icon">{icon}</span>}
          {title && <h3 className="card-title">{title}</h3>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>

      <style>{`
        .card {
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          transition: var(--transition);
        }
        .card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        .card-icon {
          color: var(--primary);
          background: var(--primary-glow);
          padding: 0.5rem;
          border-radius: var(--radius-md);
          display: flex;
        }
        .card-title {
          margin: 0;
          font-size: 1.125rem;
          color: var(--text-primary);
        }
        .card-content {
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};

export const StatCard = ({ label, value, trend, icon }: { label: string, value: string | number, trend?: string, icon?: React.ReactNode }) => (
  <Card>
    <div className="stat-card">
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <h2 className="stat-value">{value}</h2>
        {trend && (
          <div className="stat-trend success">
            <span>{trend}</span>
          </div>
        )}
      </div>
      {icon && <div className="stat-icon-wrapper">{icon}</div>}
    </div>
    <style>{`
      .stat-card {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .stat-info {
        display: flex;
        flex-direction: column;
      }
      .stat-label {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin-bottom: 0.5rem;
      }
      .stat-value {
        font-size: 2rem;
        font-weight: 700;
        margin: 0;
        color: var(--text-primary);
      }
      .stat-trend {
        font-size: 0.75rem;
        margin-top: 0.5rem;
        font-weight: 600;
      }
      .stat-trend.success {
        color: var(--success);
      }
      .stat-icon-wrapper {
        color: var(--primary);
        background: var(--primary-glow);
        padding: 0.75rem;
        border-radius: var(--radius-md);
      }
    `}</style>
  </Card>
);
