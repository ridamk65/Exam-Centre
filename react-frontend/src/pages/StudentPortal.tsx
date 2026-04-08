import { useState } from 'react';
import { 
  Search, 
  User, 
  MapPin, 
  Calendar, 
  LogOut,
  Bell,
  FileSearch,
  Download,
  AlertCircle,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';

const API_BASE = '/api';

const StudentPortal = () => {
    const [regNo, setRegNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [searched, setSearched] = useState(false);
    const { showToast, ToastContainer } = useToast();
    const navigate = useNavigate();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!regNo.trim()) return;
        
        setLoading(true);
        setSearched(true);
        try {
            const res = await fetch(`${API_BASE}/allocations/student?reg_no=${regNo.trim()}`);
            if (res.ok) {
                const data = await res.json();
                setResults(data);
                if (!data) showToast('No allocation identified for this ID.', 'warning');
            } else {
                showToast('Authentication failure or System error.', 'error');
            }
        } catch (err) {
            showToast('Portal connection latency.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('studentSession');
        navigate('/login');
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
            <ToastContainer />
            
            {/* Professional Portal Header */}
            <header style={{ 
                height: 70, background: '#fff', borderBottom: '1px solid var(--border-color)',
                padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)', position: 'sticky', top: 0, zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ background: 'var(--primary)', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                      <img src="/images/bbIHxTtnu6TeTwKHJ_4_W6.png" alt="Sathyabama Logo" style={{ height: 36, objectFit: 'contain' }} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0, letterSpacing: '-0.5px', color: 'var(--primary)' }}>STUDENT PORTAL</h1>
                        <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Unified Exam Services</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <Bell size={20} />
                    </button>
                    <div style={{ width: 1, height: 24, background: 'var(--border-color)' }}></div>
                    <button 
                        onClick={handleLogout}
                        style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--danger)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </header>

            <main style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    
                    {/* Welcome Section */}
                    <div style={{ marginBottom: 40, textAlign: 'center' }}>
                        <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--secondary)', marginBottom: 12 }}>Check Your Seating Allocation</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 600, margin: '0 auto' }}>
                            Access your hall ticket details and seating information for the upcoming examination session instantly.
                        </p>
                    </div>

                    {/* Search Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
                        
                        {/* Lookup Card */}
                        <div className="card" style={{ padding: 32, borderTop: '6px solid var(--primary)' }}>
                            <h3 style={{ fontSize: 20, marginBottom: 8 }}>Authentication & Lookup</h3>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Enter your university registration number to retrieve your seating card.</p>
                            
                            <form onSubmit={handleSearch}>
                                <div className="form-group">
                                    <label className="form-label">Registration Number</label>
                                    <div style={{ position: 'relative' }}>
                                        <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                                        <input 
                                            type="text" className="form-control" style={{ height: 50, paddingLeft: 46, fontSize: 16, fontWeight: 600 }}
                                            placeholder="e.g. 43601015"
                                            value={regNo} onChange={e => setRegNo(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button 
                                    className="btn btn-primary" 
                                    style={{ width: '100%', height: 50, fontSize: 15 }}
                                    disabled={loading}
                                >
                                    {loading ? 'Authenticating...' : 'Access My Allocation'}
                                </button>
                            </form>

                            <div style={{ marginTop: 32, padding: 20, background: 'var(--primary-light)', borderRadius: 12, border: '1px solid rgba(131, 18, 56, 0.05)' }}>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <Info size={20} color="var(--primary)" />
                                    <div>
                                        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>Note to Students</p>
                                        <p style={{ fontSize: 12, color: 'var(--primary)', opacity: 0.8, lineHeight: 1.5 }}>
                                            Allocations are final. Please report 30 minutes prior to exam time with a valid ID card.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Result Display */}
                        <div style={{ height: '100%' }}>
                            {!searched ? (
                                <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, borderStyle: 'dashed', background: 'transparent' }}>
                                    <FileSearch size={48} color="var(--text-light)" />
                                    <p style={{ color: 'var(--text-muted)', marginTop: 16, fontWeight: 600 }}>Awaiting ID Verification</p>
                                </div>
                            ) : loading ? (
                                <div className="card" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div className="spinner"></div>
                                        <p style={{ color: 'var(--text-muted)', marginTop: 16 }}>Retrieving records...</p>
                                    </div>
                                </div>
                            ) : results ? (
                                <div className="card" style={{ background: 'var(--secondary)', color: 'white', border: 'none', position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, background: 'var(--primary)', opacity: 0.1, borderRadius: '0 0 0 100%' }}></div>
                                    
                                    <div className="card-body" style={{ padding: 32 }}>
                                        <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 24 }}>Official Seat Allotment</p>
                                        
                                        <div style={{ marginBottom: 32 }}>
                                            <p style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 4 }}>Student Name</p>
                                            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{results.student_name}</h2>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
                                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 12 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-light)', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 8 }}>
                                                    <MapPin size={12} /> Hall No.
                                                </div>
                                                <p style={{ fontSize: 20, fontWeight: 800 }}>{results.hall_no}</p>
                                            </div>
                                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 12 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-light)', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 8 }}>
                                                    <User size={12} /> Seat No.
                                                </div>
                                                <p style={{ fontSize: 20, fontWeight: 800 }}>{results.seat_no}</p>
                                            </div>
                                        </div>

                                        <div style={{ background: 'rgba(131, 18, 56, 0.2)', padding: 20, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <Calendar size={18} color="var(--primary)" />
                                                <div>
                                                    <p style={{ fontSize: 14, fontWeight: 700 }}>Examination Schedule</p>
                                                    <p style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>{results.exam_date} · 09:30 AM</p>
                                                </div>
                                            </div>
                                        </div>

                                        <button 
                                            className="btn btn-primary" 
                                            style={{ width: '100%', marginTop: 32, background: 'white', color: 'var(--secondary)' }}
                                            onClick={() => window.print()}
                                        >
                                            <Download size={16} /> Save Digital Identity
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, borderStyle: 'solid', borderColor: '#fee2e2', background: '#fef2f2' }}>
                                    <AlertCircle size={48} color="#dc2626" />
                                    <p style={{ color: '#dc2626', marginTop: 16, fontWeight: 700 }}>No Allocation Identified</p>
                                    <p style={{ color: '#ef4444', fontSize: 12, textAlign: 'center', marginTop: 8 }}>Please verify your ID or contact the Exam Controller office.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div style={{ marginTop: 60, borderTop: '1px solid var(--border-color)', paddingTop: 24, textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-light)', fontSize: 12 }}>
                            © 2026 Sathyabama Institute of Science and Technology. All Academic Rights Reserved.
                        </p>
                    </div>
                </div>
            </main>

            <style>{`
                .spinner { width: 40px; height: 40px; border: 4px solid var(--border-color); border-top: 4px solid var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @media print { .btn, header, .lookup-card { display: none; } .card { border: none !important; box-shadow: none !important; } }
            `}</style>
        </div>
    );
};

export default StudentPortal;
