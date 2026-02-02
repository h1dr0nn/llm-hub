import { LayoutDashboard, Key, Activity, User, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, active, onClick }: NavItemProps) => (
  <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
    {icon}
    <span>{label}</span>
  </button>
);

export const Navbar = ({ onNavigate, currentPage }: { onNavigate: (page: string) => void, currentPage: string }) => {
  const { logout, user } = useAuth();
  return (
    <nav className="navbar glass">
      <div className="container nav-content">
        <div className="nav-logo">
          <ShieldCheck className="logo-icon" size={32} />
          <span className="logo-text text-cyan-gradient">llm-hub</span>
        </div>
        
        <div className="nav-links">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Overview" 
            active={currentPage === 'overview'} 
            onClick={() => onNavigate('overview')}
          />
          <NavItem 
            icon={<Key size={20} />} 
            label="API Keys" 
            active={currentPage === 'keys'} 
            onClick={() => onNavigate('keys')}
          />
          <NavItem 
            icon={<Activity size={20} />} 
            label="Logs" 
            active={currentPage === 'logs'}
            onClick={() => onNavigate('logs')} 
          />
        </div>

        <div className="nav-profile">
          <div className="profile-info">
            <span className="profile-name">{user?.username || 'Admin'}</span>
            <span className="profile-role">{user?.role || 'Administrator'}</span>
          </div>
          <button className="btn-logout" onClick={logout} title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          height: 70px;
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--border-color);
        }
        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .logo-icon {
          color: var(--primary);
        }
        .logo-text {
          font-size: 1.5rem;
          font-weight: 800;
        }
        .nav-links {
          display: flex;
          gap: 1rem;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 1rem;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          transition: var(--transition);
          font-weight: 500;
        }
        .nav-item:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }
        .nav-item.active {
          color: var(--primary);
          background: var(--primary-glow);
        }
        .nav-profile {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .profile-info {
          display: flex;
          flex-direction: column;
          text-align: right;
        }
        .profile-name {
          font-size: 0.9rem;
          font-weight: 600;
        }
        .profile-role {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .btn-logout {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition);
          padding: 0.5rem;
          border-radius: var(--radius-sm);
        }
        .btn-logout:hover {
          color: var(--danger);
          background: rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </nav>
  );
};
