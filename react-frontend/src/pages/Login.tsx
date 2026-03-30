import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [role, setRole] = useState<'admin' | 'student'>('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both fields.');
      return;
    }

    setLoading(true);
    setError('');

    // Mock login logic
    setTimeout(() => {
      if (role === 'admin') {
        if (username === 'admin' && password === 'admin123') {
          localStorage.setItem('adminSession', JSON.stringify({ user: 'admin', name: 'EXAM CONTROLLER' }));
          navigate('/dashboard');
        } else {
          setError('Invalid Admin ID or password.');
          setLoading(false);
        }
      } else {
        if (password === 'student123' || password === username.slice(-4)) {
          localStorage.setItem('studentSession', JSON.stringify({ reg_no: username, name: 'Student' }));
          navigate('/student-portal');
        } else {
          setError('Register Number or Password is incorrect.');
          setLoading(false);
        }
      }
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      padding: 20
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: 24,
        padding: 40,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Accent Bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 6,
          background: 'linear-gradient(90deg, #831238, #c0392b)'
        }} />

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, background: 'var(--maroon-light)',
            borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', color: 'var(--maroon)'
          }}>
            <ShieldCheck size={32} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', margin: 0 }}>Portal Access</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>Sathyabama Seating Allocation System</p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Role Toggle */}
          <div style={{
            background: '#f1f5f9', padding: 4, borderRadius: 12, display: 'flex', marginBottom: 24
          }}>
            <button
              type="button"
              onClick={() => setRole('admin')}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 10, border: 'none',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                background: role === 'admin' ? '#fff' : 'transparent',
                color: role === 'admin' ? 'var(--maroon)' : '#64748b',
                boxShadow: role === 'admin' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s'
              }}
            >Admin</button>
            <button
              type="button"
              onClick={() => setRole('student')}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 10, border: 'none',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                background: role === 'student' ? '#fff' : 'transparent',
                color: role === 'student' ? 'var(--maroon)' : '#64748b',
                boxShadow: role === 'student' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s'
              }}
            >Student</button>
          </div>

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 8 }}>
              {role === 'admin' ? 'Admin ID' : 'Register Number'}
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder={role === 'admin' ? "ID: admin" : "Your Reg No."}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px 12px 42px', border: '1px solid #e2e8f0',
                  borderRadius: 12, fontSize: 14, outline: 'none', transition: 'all 0.2s'
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--maroon)')}
                onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 8 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={role === 'admin' ? "admin123" : "student123"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%', padding: '12px 42px 12px 42px', border: '1px solid #e2e8f0',
                  borderRadius: 12, fontSize: 14, outline: 'none', transition: 'all 0.2s'
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--maroon)')}
                onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: '#fff1f2', borderLeft: '4px solid #be123c', padding: '10px 14px',
              borderRadius: 8, color: '#9f1239', fontSize: 12, fontWeight: 600, marginBottom: 20
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: 14, background: 'var(--maroon)', color: '#fff',
              border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
              cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(131, 18, 56, 0.2)'
            }}
            onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 32, fontSize: 11, color: '#94a3b8', lineHeight: 1.6 }}>
          Designed for Sathyabama Institute of Science and Technology<br />
          © 2024 Examination Branch
        </div>
      </div>
    </div>
  );
};

export default Login;
