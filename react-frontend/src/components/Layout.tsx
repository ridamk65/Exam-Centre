import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-app)' }}>
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        marginLeft: 'var(--sidebar-width)', 
        display: 'flex', 
        flexDirection: 'column',
        minWidth: 0 // Prevent content overflow
      }}>
        {/* Navbar */}
        <Navbar />

        {/* Dynamic Page Content */}
        <main style={{ 
          padding: '40px', 
          maxWidth: '1600px', 
          margin: '0 auto', 
          width: '100%',
          flex: 1
        }}>
          {children}
        </main>

        {/* Professional Footer */}
        <footer style={{ 
          padding: '24px 40px', 
          borderTop: '1px solid var(--border-color)', 
          background: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'var(--text-light)',
          fontSize: 12,
          fontWeight: 600
        }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <span>© 2026 Sathyabama Institute of Science and Technology</span>
            <div style={{ display: 'flex', gap: 24 }}>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="footer-link">Support Desk</span>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="footer-link">Legal & Compliance</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, background: 'var(--success)', borderRadius: '50%' }}></div>
            System Integrity Validated
          </div>
        </footer>
      </div>

      <style>{`
        .footer-link:hover { color: var(--primary); }
      `}</style>
    </div>
  );
};

export default Layout;
