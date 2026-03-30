import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Home, Bell, Search, GraduationCap, MapPin, ClipboardCheck } from 'lucide-react';
import { getData, seedData, fmtDate, type Allocation, type AllocatedStudent, type AllocatedHall } from '../utils/data';

interface StudentSession {
  reg_no: string;
  name: string;
  dept?: string;
  year?: number;
}

interface SeatFound {
  hall: AllocatedHall;
  student: AllocatedStudent;
  exam_date: string;
}

const StudentPortal = () => {
  const navigate = useNavigate();
  const [studentSession, setStudentSession] = useState<StudentSession | null>(null);
  const [adminSession, setAdminSession] = useState<{ user: string } | null>(null);
  const [mySeats, setMySeats] = useState<SeatFound[]>([]);
  const [allocDates, setAllocDates] = useState<string[]>([]);
  const [lookupReg, setLookupReg] = useState('');
  const [lookupDate, setLookupDate] = useState('');
  const [lookupResults, setLookupResults] = useState<SeatFound[] | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

  useEffect(() => {
    seedData();
    const ss: StudentSession | null = JSON.parse(localStorage.getItem('studentSession') || 'null');
    const as: { user: string } | null = JSON.parse(localStorage.getItem('adminSession') || 'null');
    if (!ss?.reg_no && !as?.user) { navigate('/login'); return; }
    setStudentSession(ss);
    setAdminSession(as);

    const allocs = getData<Allocation>('allocations');
    const dates = allocs.sort((a, b) => a.exam_date.localeCompare(b.exam_date)).map(a => a.exam_date);
    setAllocDates(dates);

    if (ss?.reg_no) {
      const found: SeatFound[] = [];
      allocs.forEach(a => {
        a.halls.forEach(hall => {
          const s = hall.students.find(st => st.reg_no === ss.reg_no);
          if (s) found.push({ hall, student: s, exam_date: a.exam_date });
        });
      });
      setMySeats(found);
    }
  }, [navigate]);

  const doLogout = () => {
    localStorage.removeItem('studentSession');
    localStorage.removeItem('adminSession');
    navigate('/login');
  };

  const showToast = (msg: string, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const lookupSeat = () => {
    const reg = lookupReg.trim();
    if (!reg) { showToast('Enter a register number.', 'error'); return; }
    const allocs = getData<Allocation>('allocations');
    const filtered = lookupDate ? allocs.filter(a => a.exam_date === lookupDate) : allocs;
    const found: SeatFound[] = [];
    filtered.forEach(a => {
      a.halls.forEach(hall => {
        const s = hall.students.find(st => st.reg_no.toLowerCase() === reg.toLowerCase());
        if (s) found.push({ hall, student: s, exam_date: a.exam_date });
      });
    });
    setLookupResults(found);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f9', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        background: '#fff', borderBottom: '1px solid #e8ecf0', height: 64,
        display: 'flex', alignItems: 'center', paddingInline: 24, gap: 16,
        position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 220 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'linear-gradient(135deg, #831238, #a01845)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 16, color: '#fff',
          }}>S</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#1a1a2e', letterSpacing: 0.2 }}>SATHYABAMA</div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>Student Portal</div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/login" style={{
            display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)',
            textDecoration: 'none', fontSize: 13, fontWeight: 600, padding: '8px 12px',
            borderRadius: 8, transition: 'background 0.2s',
          }} onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Home size={16} /> Home
          </Link>
          <button onClick={doLogout} style={{
            display: 'flex', alignItems: 'center', gap: 6, background: 'var(--maroon-light)',
            border: 'none', color: 'var(--maroon)', padding: '8px 16px', borderRadius: 8,
            cursor: 'pointer', fontSize: 13, fontWeight: 700,
          }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Ticker */}
      <div style={{ background: 'var(--maroon)', color: '#fff', height: 32, display: 'flex', alignItems: 'center', overflow: 'hidden', position: 'relative' }}>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0 16px', height: '100%', display: 'flex', alignItems: 'center', fontWeight: 800, fontSize: 11, zIndex: 2, position: 'relative' }}>
          <Bell size={13} style={{ marginRight: 6 }} /> ANNOUNCEMENT
        </div>
        <div style={{ flex: 1, whiteSpace: 'nowrap', animation: 'ticker 25s linear infinite', fontSize: 12, fontWeight: 500, paddingLeft: '100%' }}>
          📋 Check your exam seating allocation below  ·  🕐 Report to exam hall 30 minutes before exam time  ·  🚫 Mobile phones are strictly prohibited  ·  📝 Carry your Identity Card
        </div>
        <style>{`@keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-150%); } }`}</style>
      </div>

      <main style={{ flex: 1, maxWidth: 800, margin: '0 auto', width: '100%', padding: '32px 20px' }}>
        {/* Welcome Section */}
        {studentSession?.reg_no && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Welcome, {studentSession.name.split(' ')[0]}!</h1>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>View your exam seating and room details.</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>REGISTRATION NO.</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--maroon)' }}>{studentSession.reg_no}</div>
              </div>
            </div>

            {/* Seating Cards */}
            {mySeats.length === 0 ? (
              <div className="card" style={{ padding: 40, textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Search size={32} color="var(--text-muted)" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>No Allotment Yet</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 8, maxWidth: 320, marginInline: 'auto' }}>
                  Seating for your upcoming exams hasn't been generated yet. Please check back later.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {mySeats.map((f, idx) => (
                  <div key={idx} className="card" style={{ padding: 0, overflow: 'hidden', borderLeft: '6px solid var(--teal)' }}>
                    <div style={{ padding: '16px 24px', background: 'var(--teal-light)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <GraduationCap size={20} color="var(--teal)" />
                        <span style={{ fontWeight: 700, color: 'var(--teal-dark)', fontSize: 15 }}>{fmtDate(f.exam_date)}</span>
                      </div>
                      <span className="badge-dept cse" style={{ background: '#fff', border: '1px solid var(--border)' }}>{f.student.dept}</span>
                    </div>
                    <div style={{ padding: 24, display: 'flex', gap: 32, alignItems: 'center' }}>
                      <div style={{ textAlign: 'center', background: 'var(--bg-main)', borderRadius: 12, padding: '16px 24px', minWidth: 140 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>YOUR SEAT</div>
                        <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--maroon)', lineHeight: 1 }}>{f.student.seat_no}</div>
                      </div>
                      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                            <MapPin size={12} /> ROOM / HALL
                          </div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{f.hall.hall_no} ({f.hall.block} Block)</div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Floor {f.hall.floor}</div>
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                            <ClipboardCheck size={12} /> SUBJECT
                          </div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{f.student.subject || 'Examination'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Global Lookup (Admin/Search) */}
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Search size={18} color="var(--maroon)" /> Seat Lookup Tool
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr auto', gap: 12, alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Student Register Number</label>
              <input type="text" placeholder="e.g. 43601001" value={lookupReg} onChange={e => setLookupReg(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Exam Date</label>
              <select value={lookupDate} onChange={e => setLookupDate(e.target.value)}>
                <option value="">All Available Dates</option>
                {allocDates.map(d => <option key={d} value={d}>{fmtDate(d)}</option>)}
              </select>
            </div>
            <button className="btn btn-maroon" onClick={lookupSeat} style={{ height: 42, paddingInline: 24 }}>FIND SEAT</button>
          </div>

          {/* Results Area */}
          {lookupResults !== null && (
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
              {lookupResults.length === 0 ? (
                <div style={{ padding: 16, background: '#fff1f2', borderRadius: 8, color: '#be123c', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
                  No allocation found for "{lookupReg}"
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {lookupResults.map((f, idx) => (
                    <div key={idx} style={{ padding: 16, background: 'var(--bg-main)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{f.student.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{fmtDate(f.exam_date)} · {f.student.dept} Y{f.student.year}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--maroon)', letterSpacing: '0.05em' }}>SEAT NO.</div>
                        <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{f.student.seat_no}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--teal)', marginTop: 4 }}>Hall {f.hall.hall_no}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          background: toast.type === 'error' ? '#1e293b' : 'var(--maroon)',
          color: '#fff', padding: '12px 24px', borderRadius: 100, fontSize: 13,
          fontWeight: 600, boxShadow: '0 8px 30px rgba(0,0,0,0.2)', zIndex: 1000,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          {toast.type === 'error' ? '⚠️' : '✅'} {toast.msg}
        </div>
      )}
    </div>
  );
};

export default StudentPortal;
