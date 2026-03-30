import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  adminName?: string;
}

const Layout = ({ children, adminName }: LayoutProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f4f6f9' }}>
      <Navbar adminName={adminName} />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar adminName={adminName} />
        <main style={{
          flex: 1,
          padding: '24px 28px',
          overflowY: 'auto',
          maxWidth: 'calc(100vw - 220px)',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
