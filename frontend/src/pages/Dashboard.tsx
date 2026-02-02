import React from 'react';
import { StatCard } from '../components/Card';
import { Activity, Zap, Shield, PieChart } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const mockData = [
  { name: '00:00', tokens: 400 },
  { name: '04:00', tokens: 300 },
  { name: '08:00', tokens: 900 },
  { name: '12:00', tokens: 1500 },
  { name: '16:00', tokens: 1200 },
  { name: '20:00', tokens: 1800 },
  { name: '23:59', tokens: 1400 },
];

const Dashboard = () => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="text-gradient">System Overview</h1>
        <p className="subtitle">Real-time usage and provider health metrics</p>
      </header>

      <div className="stats-grid">
        <StatCard 
          label="Tokens Used Today" 
          value="12.5k" 
          trend="+14% from yesterday" 
          icon={<Zap size={24} />} 
        />
        <StatCard 
          label="Active Providers" 
          value="5" 
          icon={<Shield size={24} />} 
        />
        <StatCard 
          label="Requests (24h)" 
          value="1,248" 
          trend="+5% vs prev period" 
          icon={<Activity size={24} />} 
        />
        <StatCard 
          label="Avg Latency" 
          value="420ms" 
          icon={<PieChart size={24} />} 
        />
      </div>

      <div className="chart-section glass">
        <div className="section-header">
          <h3>Token Usage Profile</h3>
          <span>Last 24 hours</span>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => `${val/1000}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  background: '#0f172a', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff' 
                }}
              />
              <Area 
                type="monotone" 
                dataKey="tokens" 
                stroke="#06b6d4" 
                fillOpacity={1} 
                fill="url(#colorTokens)" 
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <style>{`
        .dashboard-header {
          margin-bottom: 2.5rem;
        }
        .subtitle {
          color: var(--text-secondary);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .chart-section {
          padding: 2rem;
          border-radius: var(--radius-lg);
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .section-header h3 {
          margin: 0;
        }
        .section-header span {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        .chart-wrapper {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
