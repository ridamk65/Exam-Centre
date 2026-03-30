import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  Users, Building2, Calendar, ClipboardCheck,
  ArrowRight, TrendingUp,
} from 'lucide-react';
import {
  getData, seedData, deptClass, yearClass, fmtDate,
  type ExamSchedule,
} from '../utils/data';

const Dashboard = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ students: 0, halls: 0, schedules: 0, allocations: 0 });
  const [recentSchedules, setRecentSchedules] = useState<ExamSchedule[]>([]);
  const [adminName, setAdminName] = useState('EXAM CONTROLLER');

  useEffect(() => {
    seedData();
    const session = JSON.parse(localStorage.getItem('adminSession') || '{}');
    if (!session?.user) { navigate('/login'); return; }
    setAdminName(session.name || 'EXAM CONTROLLER');
    setCounts({
      students:    getData<unknown[]>('students').length,
      halls:       getData<unknown[]>('halls').length,
      schedules:   getData<unknown[]>('exam_schedule').length,
      allocations: getData<unknown[]>('allocations').length,
    });
    setRecentSchedules(getData<ExamSchedule>('exam_schedule').slice(0, 6));
  }, [navigate]);

  const stats = [
    { label: 'Total Students',   value: counts.students,    icon: Users,          color: '#831238', light: '#fce8ef', change: '+2 this month' },
    { label: 'Exam Halls',       value: counts.halls,       icon: Building2,      color: '#3a9fa8', light: '#e0f5f7', change: 'Available' },
    { label: 'Exam Schedules',   value: counts.schedules,   icon: Calendar,       color: '#8B6914', light: '#fff8e0', change: 'This semester' },
    { label: 'Allocations Done', value: counts.allocations, icon: ClipboardCheck, color: '#4cae9e', light: '#e8ffe0', change: 'Generated' },
  ];

  const quickLinks = [
    { to: '/students',          color: '#831238', lightBg: '#fce8ef', icon: '👨‍🎓', title: 'Student Management',  desc: 'Add, edit & manage student records' },
    { to: '/halls',             color: '#3a9fa8', lightBg: '#e0f5f7', icon: '🏛️',  title: 'Hall Management',      desc: 'Manage exam halls & capacity' },
    { to: '/schedule',          color: '#8B6914', lightBg: '#fff8e0', icon: '📅',  title: 'Exam Schedule',        desc: 'Add & manage exam timetables' },
    { to: '/allocation',        color: '#4cae9e', lightBg: '#e8ffe0', icon: '⚙️',  title: 'Generate Seating',     desc: 'Auto-generate seat allocations' },
    { to: '/allocation-result', color: '#4a7fae', lightBg: '#e8f0fe', icon: '📄',  title: 'View & Download PDF',  desc: 'Hall-wise arrangement & export' },
    { to: '/student-portal',    color: '#8e6db4', lightBg: '#f3e8ff', icon: '🎓',  title: 'Student Portal',       desc: 'Students check their seat' },
  ];

  return (
    <Layout adminName={adminName}>
      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', margin: 0 }}>Admin Dashboard</h1>
        <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Welcome back, {adminName}. Here's an overview of your system.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{
              background: '#fff', borderRadius: 12, padding: '20px 22px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0',
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: s.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={s.color} strokeWidth={2} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#4cae9e', fontWeight: 600 }}>
                  <TrendingUp size={11} /> {s.change}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#1a1a2e', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12.5, color: '#888', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two-column row: Quick Nav + Upcoming */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Quick Navigation */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>⚡ Quick Navigation</h2>
          </div>
          <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {quickLinks.map(ql => (
              <Link key={ql.to} to={ql.to} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                background: ql.lightBg, borderRadius: 10, textDecoration: 'none',
                border: `1px solid ${ql.color}20`, transition: 'transform 0.15s, box-shadow 0.15s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 4px 14px ${ql.color}22`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '';
                }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{ql.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: ql.color }}>{ql.title}</div>
                  <div style={{ fontSize: 10.5, color: '#777', marginTop: 1, lineHeight: 1.3 }}>{ql.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Exams */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>📅 Upcoming Exams</h2>
            <Link to="/schedule" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#831238', fontWeight: 600, textDecoration: 'none' }}>
              View All <ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ padding: '0 4px' }}>
            {recentSchedules.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 30, color: '#bbb', fontSize: 13 }}>No schedules yet</div>
            ) : (
              recentSchedules.map((s, i) => (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px',
                  borderBottom: i < recentSchedules.length - 1 ? '1px solid #f5f5f5' : 'none',
                }}>
                  <div style={{
                    fontSize: 11, fontWeight: 700, color: '#fff', background: '#831238',
                    borderRadius: 6, padding: '4px 8px', whiteSpace: 'nowrap', flexShrink: 0,
                  }}>
                    {fmtDate(s.exam_date)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.subject}</div>
                    <div style={{ fontSize: 11, color: '#999', marginTop: 1 }}>
                      <span className={`badge-dept ${deptClass(s.dept)}`} style={{ fontSize: 10, padding: '1px 6px' }}>{s.dept}</span>
                      &nbsp;
                      <span className={`badge-year ${yearClass(s.year)}`} style={{ fontSize: 10, padding: '1px 6px' }}>Year {s.year}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
