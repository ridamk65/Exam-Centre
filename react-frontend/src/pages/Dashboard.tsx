import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { 
  Users, 
  School, 
  Calendar, 
  ChevronRight, 
  TrendingUp, 
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = '/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    halls: 0,
    exams: 0,
    completion: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [sRes, hRes, schRes] = await Promise.all([
          fetch(`${API_BASE}/students`),
          fetch(`${API_BASE}/halls`),
          fetch(`${API_BASE}/schedules`)
        ]);

        if (sRes.ok && hRes.ok && schRes.ok) {
          const sData = await sRes.json();
          const hData = await hRes.json();
          const schData = await schRes.json();
          
          setStats({
            students: sData.length,
            halls: hData.length,
            exams: schData.length,
            completion: sData.length > 0 ? 100 : 0 // Simplified logic
          });
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const recentActivities = [
    { id: 1, type: 'status', msg: 'System Online: Database Integrated', time: 'Just now', icon: Activity, color: 'blue' },
    { id: 2, type: 'success', msg: 'Ready for Exam Allocations', time: 'Active', icon: CheckCircle2, color: 'emerald' },
  ];

  const quickActions = [
    { name: 'Register Student', path: '/students', color: 'var(--primary)' },
    { name: 'Schedule Exam', path: '/schedules', color: '#3a9fa8' },
    { name: 'Run Allocation', path: '/allocation', color: 'var(--accent)' },
    { name: 'Download PDF', path: '/results', color: 'var(--secondary)' },
  ];

  return (
    <Layout>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Dashboard Overview</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Welcome back, Sriram! Here's what's happening today.</p>
      </div>

      {/* Stats Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: 24, 
        marginBottom: 32 
      }}>
        {[
          { label: 'Total Students', value: stats.students, icon: Users, trend: '+12%', color: 'var(--primary)' },
          { label: 'Available Halls', value: stats.halls, icon: School, trend: 'Stable', color: 'var(--accent)' },
          { label: 'Upcoming Exams', value: stats.exams, icon: Calendar, trend: '+4 today', color: 'var(--secondary)' },
          { label: 'Allocation Sync', value: `${stats.completion}%`, icon: Activity, trend: 'Real-time', color: 'var(--success)' },
        ].map((item, idx) => (
          <div key={idx} className="card" style={{ padding: 24, position: 'relative' }}>
            <div style={{ 
              width: 48, height: 48, borderRadius: 12, 
              background: `${item.color}08`, color: item.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16, border: `1px solid ${item.color}15`
            }}>
              <item.icon size={22} />
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 4 }}>
              <h2 style={{ fontSize: 28, fontWeight: 800 }}>{item.value}</h2>
              <span style={{ 
                fontSize: 12, fontWeight: 700, 
                color: item.trend.includes('+') ? 'var(--success)' : 'var(--text-light)',
                display: 'flex', alignItems: 'center', gap: 4
              }}>
                {item.trend.includes('+') && <TrendingUp size={12} />} {item.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Main Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Quick Actions Card */}
          <div className="card">
            <div className="card-header">
              <span>⚡ Quick Operations</span>
              <button className="btn btn-sm btn-secondary">Manage shortcuts</button>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {quickActions.map(action => (
                  <Link 
                    key={action.name} 
                    to={action.path}
                    style={{ 
                      textDecoration: 'none', textAlign: 'center', 
                      background: 'var(--secondary-light)', padding: '16px 12px',
                      borderRadius: 12, transition: 'all 0.2s', border: '1px solid var(--border-color)'
                    }}
                    className="action-tile"
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--secondary)' }}>{action.name}</div>
                    <ChevronRight size={12} style={{ marginTop: 4, color: 'var(--text-muted)' }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="card">
            <div className="card-header">
              <span>📜 Audit & System Logs</span>
              <button className="btn btn-sm btn-secondary">Export Log</button>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {recentActivities.map((act, i) => (
                <div key={act.id} style={{ 
                  display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px',
                  borderBottom: i === recentActivities.length - 1 ? 'none' : '1px solid var(--border-color)'
                }}>
                  <div style={{ 
                    width: 36, height: 36, borderRadius: 8, 
                    background: i === 0 ? '#eff6ff' : i === 1 ? '#ecfdf5' : '#f5f3ff',
                    color: i === 0 ? '#3b82f6' : i === 1 ? '#10b981' : '#6366f1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <act.icon size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--secondary)' }}>{act.msg}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 2 }}>System Event · ID: {act.id * 1234}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{act.time}</p>
                    <Link to="#" style={{ fontSize: 11, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 4 }}>
                      <ExternalLink size={10} /> Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card" style={{ background: 'var(--secondary)', color: '#fff' }}>
            <div className="card-body" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <Clock size={20} color="var(--primary)" />
                <h3 style={{ color: '#fff', fontSize: 16 }}>Next Big Event</h3>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-light)', fontWeight: 800 }}>Tuesday, 14 May</p>
                <p style={{ fontSize: 14, fontWeight: 700, margin: '4px 0' }}>University End-Semester Exams</p>
                <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                  <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 4 }}>5,000+ Students</span>
                  <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 4 }}>42 Halls</span>
                </div>
                <button style={{ 
                  width: '100%', marginTop: 20, background: 'var(--primary)', 
                  border: 'none', color: '#fff', padding: '10px', borderRadius: 8,
                  fontSize: 12, fontWeight: 700, cursor: 'pointer'
                }}>View Detailed Plan</button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">📊 Hall Occupancy</div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { name: 'Old Block', val: 78, color: 'var(--primary)' },
                { name: 'New Block', val: 92, color: 'var(--accent)' },
                { name: 'Lab Block', val: 45, color: '#3b82f6' },
              ].map(item => (
                <div key={item.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{item.val}%</span>
                  </div>
                  <div style={{ width: '100%', height: 6, background: 'var(--secondary-light)', borderRadius: 10 }}>
                    <div style={{ width: `${item.val}%`, height: '100%', background: item.color, borderRadius: 10 }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .action-tile:hover { transform: translateY(-2px); border-color: var(--primary); box-shadow: 0 4px 12px rgba(131, 18, 56, 0.08); background: #fff !important; }
      `}</style>
    </Layout>
  );
};

export default Dashboard;
