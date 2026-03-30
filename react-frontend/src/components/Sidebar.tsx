import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, Calendar,
  ClipboardList, FileText, GraduationCap,
} from 'lucide-react';

interface SidebarProps {
  role?: 'admin' | 'student';
  adminName?: string;
}

const navItems = [
  { to: '/dashboard',         icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/students',          icon: Users,           label: 'Students' },
  { to: '/halls',             icon: Building2,       label: 'Halls' },
  { to: '/schedule',          icon: Calendar,        label: 'Exam Schedule' },
  { to: '/allocation',        icon: ClipboardList,   label: 'Generate Seating' },
  { to: '/allocation-result', icon: FileText,        label: 'View & PDF' },
  { to: '/student-portal',    icon: GraduationCap,   label: 'Student Portal' },
];

const Sidebar = ({ adminName = 'EXAM CONTROLLER' }: SidebarProps) => {
  return (
    <aside style={{
      width: 220,
      background: '#fff',
      borderRight: '1px solid #e8ecf0',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      flexShrink: 0,
    }}>
      {/* User info */}
      <div style={{
        padding: '20px 16px 16px',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg, #831238, #a01845)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 14, color: '#fff', flexShrink: 0,
          }}>
            {adminName.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {adminName}
            </div>
            <div style={{ fontSize: 10.5, color: '#999', marginTop: 1 }}>Administrator</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: 9.5, fontWeight: 700, color: '#bbb', letterSpacing: 1, padding: '4px 8px 8px', textTransform: 'uppercase' }}>
          Main Menu
        </div>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
              borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: isActive ? 700 : 500,
              color: isActive ? '#831238' : '#555',
              background: isActive ? '#fce8ef' : 'transparent',
              transition: 'all 0.15s',
            })}
            onMouseEnter={e => {
              if (!(e.currentTarget as HTMLAnchorElement).classList.contains('active')) {
                (e.currentTarget as HTMLElement).style.background = '#f8f9fb';
              }
            }}
            onMouseLeave={e => {
              if (!(e.currentTarget as HTMLAnchorElement).classList.contains('active')) {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }
            }}>
            <Icon size={16} strokeWidth={isActive => isActive ? 2.5 : 2} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom info */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ fontSize: 10, color: '#bbb', lineHeight: 1.6 }}>
          <div style={{ fontWeight: 600, color: '#aaa', marginBottom: 2 }}>Academic Year</div>
          <div>2023–2024 · Even Sem</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
