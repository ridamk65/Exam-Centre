import { useState } from 'react';
import { Bell, Search, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  adminName?: string;
}

const Navbar = ({ adminName = 'ADMIN' }: NavbarProps) => {
  const navigate = useNavigate();
  const [showDrop, setShowDrop] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    navigate('/login');
  };

  return (
    <header style={{
      background: '#fff',
      borderBottom: '1px solid #e8ecf0',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      paddingInline: 24,
      gap: 16,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 220 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: 'linear-gradient(135deg, #831238, #a01845)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: 16, color: '#fff', flexShrink: 0,
        }}>S</div>
        <div style={{ lineHeight: 1.25 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#1a1a2e', letterSpacing: 0.3 }}>SATHYABAMA</div>
          <div style={{ fontSize: 9.5, color: '#888', letterSpacing: 0.2 }}>Exam Seating System</div>
        </div>
      </div>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: 420, position: 'relative' }}>
        <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
        <input
          placeholder="Search students, halls, schedules…"
          style={{
            width: '100%', paddingLeft: 36, paddingRight: 12, paddingBlock: 8,
            border: '1px solid #e8ecf0', borderRadius: 8, fontSize: 13,
            background: '#f8f9fb', outline: 'none', color: '#444',
          }}
          onFocus={e => e.target.style.borderColor = '#831238'}
          onBlur={e => e.target.style.borderColor = '#e8ecf0'}
        />
      </div>

      <div style={{ flex: 1 }} />

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button style={{
          width: 38, height: 38, borderRadius: 8, border: '1px solid #e8ecf0',
          background: '#f8f9fb', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', position: 'relative',
        }}>
          <Bell size={16} color="#666" />
          <span style={{
            position: 'absolute', top: 7, right: 7, width: 7, height: 7,
            background: '#e53935', borderRadius: '50%', border: '1.5px solid #fff',
          }} />
        </button>

        {/* User menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDrop(!showDrop)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e8ecf0',
              borderRadius: 8, padding: '6px 12px 6px 6px', background: '#f8f9fb', cursor: 'pointer',
            }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: 'linear-gradient(135deg, #831238, #a01845)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, color: '#fff',
            }}>
              {adminName.slice(0, 2).toUpperCase()}
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#333' }}>{adminName}</span>
            <ChevronDown size={13} color="#888" />
          </button>

          {showDrop && (
            <div style={{
              position: 'absolute', top: 44, right: 0, background: '#fff', border: '1px solid #e8ecf0',
              borderRadius: 10, padding: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 160, zIndex: 200,
            }}>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                  border: 'none', background: 'none', cursor: 'pointer', borderRadius: 6,
                  fontSize: 13, color: '#c0392b', fontWeight: 600,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#fff0f0')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
