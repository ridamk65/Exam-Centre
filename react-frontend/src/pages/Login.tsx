import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight,
  GraduationCap,
  Settings,
  HelpCircle
} from 'lucide-react';
import { useToast } from '../components/Toast';

const Login = () => {
    const [role, setRole] = useState<'admin' | 'student'>('admin');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showToast, ToastContainer } = useToast();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        setTimeout(() => {
            if (role === 'admin') {
                if (username === 'admin' && password === 'admin123') {
                    localStorage.setItem('adminSession', 'true');
                    showToast('Authenticated. Launching System Admin Dashboard...', 'success');
                    setTimeout(() => navigate('/dashboard'), 800);
                } else {
                    showToast('Authentication failure: Incorrect credentials.', 'error');
                }
            } else {
                if (username.trim()) {
                    localStorage.setItem('studentSession', username);
                    showToast('Identity Verified. Loading Student Portal...', 'success');
                    setTimeout(() => navigate('/portal'), 800);
                } else {
                    showToast('Please enter your university registration ID.', 'warning');
                }
            }
            setLoading(false);
        }, 600);
    };

    return (
        <div style={{ 
            height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundImage: 'url("/images/loginpage.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative', overflow: 'hidden'
        }}>
            {/* Overlay for readability */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(123, 29, 34, 0.4)', backdropFilter: 'blur(2px)' }}></div>
            
            <ToastContainer />
            
            <div style={{ width: '100%', maxWidth: 440, padding: 20, zIndex: 10 }}>
                {/* Brand Header */}
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                   <div style={{ background: 'white', padding: '12px 24px', borderRadius: '12px', display: 'inline-block', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                      <img 
                        src="/images/bbIHxTtnu6TeTwKHJ_4_W6.png" 
                        alt="Sathyabama" 
                        style={{ height: 54, objectFit: 'contain' }}
                      />
                   </div>
                </div>

                {/* Login Container */}
                <div className="card" style={{ 
                    padding: 40, border: '1px solid rgba(255,255,255,0.3)', 
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                    background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.5px' }}>Unified Exam Portal</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 700, marginTop: 4 }}>System Authentication</p>
                    </div>

                    {/* Role Selection */}
                    <div style={{ 
                        background: 'var(--secondary-light)', padding: 4, borderRadius: 12,
                        display: 'flex', marginBottom: 32, border: '1px solid var(--border-color)'
                    }}>
                        <button 
                            onClick={() => setRole('admin')}
                            style={{ 
                                flex: 1, padding: '10px', fontSize: 13, fontWeight: 700, borderRadius: 10,
                                background: role === 'admin' ? '#fff' : 'transparent',
                                color: role === 'admin' ? 'var(--primary)' : 'var(--text-muted)',
                                border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                                boxShadow: role === 'admin' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                             }}
                        >
                            Academic Admin
                        </button>
                        <button 
                            onClick={() => setRole('student')}
                            style={{ 
                                flex: 1, padding: '10px', fontSize: 13, fontWeight: 700, borderRadius: 10,
                                background: role === 'student' ? '#fff' : 'transparent',
                                color: role === 'student' ? 'var(--primary)' : 'var(--text-muted)',
                                border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                                boxShadow: role === 'student' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                             }}
                        >
                            Student Hub
                        </button>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label className="form-label">{role === 'admin' ? 'Administrative Username' : 'University Reg. No.'}</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.7 }}>
                                    {role === 'admin' ? <User size={18} /> : <GraduationCap size={18} />}
                                </div>
                                <input 
                                    type="text" className="form-control" style={{ height: 52, paddingLeft: 46, fontSize: 15, fontWeight: 600 }}
                                    placeholder={role === 'admin' ? 'Enter admin username' : 'e.g. 43601001'}
                                    value={username} onChange={e => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        {role === 'admin' && (
                            <div className="form-group" style={{ marginBottom: 32 }}>
                                <label className="form-label">Secure Password</label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.7 }}>
                                        <Lock size={18} />
                                    </div>
                                    <input 
                                        type={showPassword ? 'text' : 'password'} 
                                        className="form-control" style={{ height: 52, paddingLeft: 46, paddingRight: 46, fontSize: 15 }}
                                        placeholder="Enter secure password"
                                        value={password} onChange={e => setPassword(e.target.value)}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        <button 
                            className="btn btn-primary" 
                            style={{ width: '100%', height: 54, fontSize: 16, fontWeight: 900, letterSpacing: '0.6px' }}
                            disabled={loading}
                        >
                            {loading ? 'Validating...' : (role === 'admin' ? 'Initialise Secure Access' : 'Enter Student Portal')}
                            {!loading && <ArrowRight size={18} style={{ marginLeft: 8 }} />}
                        </button>
                    </form>

                    <div style={{ marginTop: 24, textAlign: 'center' }}>
                        <a href="#" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 800 }}>Need assistance? Contact Support</a>
                    </div>
                </div>

                {/* Footer Reference */}
                <div style={{ marginTop: 32, textAlign: 'center' }}>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 700, letterSpacing: '1px' }}>
                        © 2026 SATHYABAMA INSTITUTE OF SCIENCE AND TECHNOLOGY
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
