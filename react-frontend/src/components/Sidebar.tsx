import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  MapPin, 
  Calendar, 
  Cpu, 
  FileText, 
  LogOut, 
  Settings,
  HelpCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { title: 'CORE OPERATIONS', type: 'label' },
    { to: '/dashboard', icon: BarChart3, label: 'Control Center' },
    { to: '/students', icon: Users, label: 'Student Ledger' },
    { to: '/halls', icon: MapPin, label: 'Infrastructure' },
    { to: '/schedules', icon: Calendar, label: 'Exam Calendar' },
    { title: 'ALGORITHMIC ENGINE', type: 'label' },
    { to: '/allocation', icon: Cpu, label: 'Run Allocation' },
    { to: '/results', icon: FileText, label: 'Dispatch Reports' },
  ];

  return (
    <aside style={{ 
      width: 'var(--sidebar-width)', 
      background: '#fff', 
      borderRight: '1px solid var(--border-color)',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      padding: '32px 16px',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 101,
      boxShadow: '1px 0 10px rgba(0,0,0,0.02)'
    }}>
      {/* Brand Identity - System Ref */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48, padding: '0 8px' }}>
        <div style={{ 
          width: 44, 
          height: 44, 
          background: 'var(--primary)', 
          borderRadius: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(123, 29, 34, 0.2)'
        }}>
          <ShieldCheck size={24} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: 16, color: 'var(--primary)', letterSpacing: '-0.3px', fontWeight: 900 }}>EHAS</h1>
          <p style={{ fontSize: 9, color: 'var(--text-light)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>V2.4 Enterprise</p>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map((item, idx) => {
          if (item.type === 'label') {
            return (
              <p key={idx} style={{ 
                fontSize: 10, 
                fontWeight: 900, 
                color: 'var(--text-light)', 
                marginTop: 24, 
                marginBottom: 8, 
                marginLeft: 12,
                textTransform: 'uppercase',
                letterSpacing: '1.2px'
              }}>
                {item.title}
              </p>
            );
          }
          
          return (
            <NavLink
              key={idx}
              to={item.to!}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <item.icon size={19} className="link-icon" />
              <span style={{ flex: 1 }}>{item.label}</span>
              <ChevronRight size={12} className="chevron" />
            </NavLink>
          );
        })}
      </nav>

      {/* Secondary Tools & User Support */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 4, pt: 24, borderTop: '1px solid #f1f3f5' }}>
        <NavLink to="/settings" className="sidebar-link secondary">
          <Settings size={18} />
          <span>Configuration</span>
        </NavLink>
        <NavLink to="/support" className="sidebar-link secondary">
          <HelpCircle size={18} />
          <span>Support Desk</span>
        </NavLink>
        
        <button className="sidebar-link logout-btn" style={{ marginTop: 12 }}>
          <LogOut size={18} />
          <span>Terminate Session</span>
        </button>
      </div>

      <style>{`
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 14px;
          border-radius: 10px;
          text-decoration: none;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s;
        }
        .sidebar-link:hover { background: var(--secondary-light); color: var(--primary); }
        .sidebar-link.active { background: var(--primary-light); color: var(--primary); }
        .sidebar-link.active .link-icon { color: var(--primary); }
        .sidebar-link.active .chevron { opacity: 1; transform: translateX(0); }
        .sidebar-link .chevron { opacity: 0; transform: translateX(-4px); transition: all 0.2s; }
        
        .sidebar-link.secondary { font-size: 13px; color: var(--text-light); }
        .sidebar-link.secondary:hover { color: var(--secondary); }
        
        .logout-btn { 
          width: 100%; border: none; background: #fff1f2; color: #e11d48; cursor: pointer;
          font-family: var(--font-main);
        }
        .logout-btn:hover { background: #ffe4e6; color: #be123c; }
      `}</style>
    </aside>
  );
};

export default Sidebar;
