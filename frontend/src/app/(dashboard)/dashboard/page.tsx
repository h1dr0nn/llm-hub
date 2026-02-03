"use client";
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  Cell, PieChart, Pie
} from 'recharts';
import { 
  Activity, 
  Zap, 
  Shield, 
  Clock, 
  TrendingUp,
  Cpu,
  Globe,
  Database
} from 'lucide-react';
import { StatCard, Card } from '@/components/Card';
import { useAuth } from '@/context/AuthContext';

const usageData = [
  { name: '00:00', requests: 400, tokens: 2400 },
  { name: '04:00', requests: 300, tokens: 1398 },
  { name: '08:00', requests: 900, tokens: 9800 },
  { name: '12:00', requests: 1480, tokens: 3908 },
  { name: '16:00', requests: 1890, tokens: 4800 },
  { name: '20:00', requests: 2390, tokens: 3800 },
];

const modelShare = [
  { name: 'GPT-4o', value: 45, color: '#06b6d4' },
  { name: 'Claude 3.5', value: 30, color: '#8b5cf6' },
  { name: 'Gemini 1.5', value: 15, color: '#10b981' },
  { name: 'Llama 3', value: 10, color: '#f59e0b' },
];

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/v1/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  if (loading) {
     return <div className="text-white p-10">Loading dashboard data...</div>;
  }
  
  // Use real data or fallback to empty structure if new
  const usageData = stats?.usage_data || [];
  const modelShare = stats?.model_share || [];
  const totalRequests = stats?.total_requests || 0;
  // Format tokens to K/M
  const totalTokens = stats?.total_tokens >= 1000000 
    ? `${(stats?.total_tokens / 1000000).toFixed(1)}M`
    : stats?.total_tokens >= 1000 
      ? `${(stats?.total_tokens / 1000).toFixed(1)}K` 
      : stats?.total_tokens || 0;

  return (
    <div className="space-y-8 animate-fade-in max-w-[1400px]">
      <header className="flex flex-col gap-1">
        <h1 className="text-4xl font-extrabold tracking-tight text-white m-0">
          Network <span className="text-gradient">Overview</span>
        </h1>
        <p className="text-text-secondary text-lg">Real-time gateway performance and usage metrics</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Requests" 
          value={`${totalRequests}`}
          icon={Activity} 
          trend={{ value: '12%', isUp: true }}
          color="primary"
        />
        <StatCard 
          label="Avg Latency" 
          value="-" 
          icon={Clock} 
          trend={{ value: '0%', isUp: false }}
          color="warning"
        />
        <StatCard 
          label="Total Tokens" 
          value={`${totalTokens}`}
          icon={Zap} 
          trend={{ value: '2%', isUp: true }}
          color="success"
        />
        <StatCard 
          label="Security Events" 
          value="0" 
          icon={Shield} 
          color="accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10">
        <Card title="Traffic Velocity" subtitle="Requests per 4h block (24h)" className="lg:col-span-8">
          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff' 
                  }}
                  itemStyle={{ color: '#06b6d4' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="#06b6d4" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRequests)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Model Distribution" subtitle="API usage share" className="lg:col-span-4">
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modelShare}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {modelShare.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {modelShare.map((item: any) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-text-secondary">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="System Resources" subtitle="Gateway load metrics" className="lg:col-span-12">
          {/* ... existing static content for now ... */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
            <div className="flex items-center gap-4 group">
              <div className="p-3 bg-white/5 rounded-xl text-primary border border-white/5 group-hover:border-primary/30 transition-all">
                <Cpu size={24} />
              </div>
              <div>
                <div className="text-xs text-text-secondary uppercase tracking-widest font-bold">Inference Units</div>
                <div className="text-xl font-bold text-white uppercase">42 Active Labs</div>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="p-3 bg-white/5 rounded-xl text-accent border border-white/5 group-hover:border-accent/30 transition-all">
                <Globe size={24} />
              </div>
              <div>
                <div className="text-xs text-text-secondary uppercase tracking-widest font-bold">Global PoPs</div>
                <div className="text-xl font-bold text-white uppercase">8 Regions</div>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="p-3 bg-white/5 rounded-xl text-success border border-white/5 group-hover:border-success/30 transition-all">
                <Database size={24} />
              </div>
              <div>
                <div className="text-xs text-text-secondary uppercase tracking-widest font-bold">Cache Hit Rate</div>
                <div className="text-xl font-bold text-white uppercase">94.2% Success</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
