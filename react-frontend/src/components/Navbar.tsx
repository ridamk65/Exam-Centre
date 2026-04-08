import { 
  Bell, 
  Search, 
  User, 
  ChevronDown, 
  Grid,
  ShieldCheck
} from 'lucide-react';

const Navbar = () => {
  return (
    <nav style={{ 
      height: 'var(--navbar-height)', 
      background: 'var(--primary)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ height: 48, display: 'flex', alignItems: 'center' }}>
          <img 
            src="/images/bbIHxTtnu6TeTwKHJ_4_W6.png" 
            alt="Sathyabama Logo" 
            style={{ height: '100%', objectFit: 'contain' }}
          />
        </div>
        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.2)' }}></div>
        <div>
          <h2 style={{ fontSize: 13, color: 'white', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 2 }}>Exam Control</h2>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Unified Exam Services</span>
        </div>
      </div>

      {/* Center Integrated Actions */}
      <div style={{ position: 'relative', width: 340 }}>
        <Search size={16} color="rgba(255,255,255,0.6)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text" 
          placeholder="Global System Search..." 
          style={{ 
            width: '100%', 
            height: 42, 
            background: 'rgba(255,255,255,0.08)', 
            border: '1px solid rgba(255,255,255,0.12)', 
            borderRadius: '24px', 
            paddingLeft: 44, 
            fontSize: 13, 
            color: 'white',
            outline: 'none',
            transition: 'all 0.2s'
          }} 
          className="nav-search-input"
        />
      </div>

      {/* System Groups & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="nav-icon-btn"><Bell size={18} /></button>
          <button className="nav-icon-btn"><Grid size={18} /></button>
        </div>
        
        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.15)' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} className="user-profile-trigger">
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'white', lineHeight: 1.2 }}>Dr. Controller</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>SYSTEM ROOT</p>
          </div>
          <div style={{ 
            width: 38, 
            height: 38, 
            background: 'var(--accent)', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white'
          }}>
            <User size={20} />
          </div>
          <ChevronDown size={14} color="rgba(255,255,255,0.5)" />
        </div>
      </div>

      <style>{`
        .nav-search-input:focus { background: rgba(255,255,255,0.15); border-color: var(--accent); }
        .nav-search-input::placeholder { color: rgba(255,255,255,0.4); }
        .nav-icon-btn { 
          width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.05); 
          border: 1px solid rgba(255,255,255,0.08); color: white; display: flex; 
          align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;
        }
        .nav-icon-btn:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.2); }
      `}</style>
    </nav>
  );
};

export default Navbar;
