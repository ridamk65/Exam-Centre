import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useToast } from '../components/Toast';
import { 
  Cpu, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Play,
  ArrowRight,
  Info
} from 'lucide-react';


const API_BASE = '/api';

interface ExamSchedule {
  id: string;
  exam_date: string;
  dept: string;
  year: number;
  subject: string;
}

const AllocationPage = () => {
  const [examDate, setExamDate] = useState('');
  const [dateSchedules, setDateSchedules] = useState<ExamSchedule[]>([]);
  const [generating, setGenerating] = useState(false);
  const [counts, setCounts] = useState({ students: 0, halls: 0 });
  const [results, setResults] = useState<any>(null);
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    loadBaseCounts();
  }, []);

  const loadBaseCounts = async () => {
    try {
      const sRes = await fetch(`${API_BASE}/students`);
      const hRes = await fetch(`${API_BASE}/halls`);
      if (sRes.ok && hRes.ok) {
        const sData = await sRes.json();
        const hData = await hRes.json();
        setCounts({ students: sData.length, halls: hData.length });
      }
    } catch (err) {}
  };

  const onDateChange = async (date: string) => {
    setExamDate(date);
    setResults(null);
    try {
      const res = await fetch(`${API_BASE}/schedules`);
      if (res.ok) {
        const data = await res.json();
        setDateSchedules(data.filter((s: any) => s.exam_date === date));
      }
    } catch (err) {}
  };

  const generate = async () => {
    if (!examDate) { showToast('Select an examination date first.', 'error'); return; }
    if (dateSchedules.length === 0) { showToast('No exams scheduled for this date.', 'error'); return; }
    
    setGenerating(true);
    try {
      const res = await fetch(`${API_BASE}/allocations/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examDate: examDate })
      });
      
      const data = await res.json();
      if (res.ok) {
        setResults(data);
        showToast('System: Allocation computation completed.', 'success');
      } else {
        showToast(data.error || 'Algorithm failure.', 'error');
      }
    } catch (err) {
      showToast('Backend connection interrupt.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Layout>
      <ToastContainer />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Seating Algorithm & Allotment</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            System-wide automated allocation engine using Interleaved Placement Logic.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
        {/* Left Control Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Configuration Card */}
          <div className="card">
            <div className="card-header">
              <span>⚙️ Computation Parameters</span>
              <Info size={16} color="var(--text-light)" />
            </div>
            <div className="card-body">
              <div className="form-group" style={{ maxWidth: 280 }}>
                <label className="form-label">Select Exam Date Target</label>
                <input 
                  type="date" className="form-control" value={examDate}
                  onChange={e => onDateChange(e.target.value)}
                />
              </div>

              {examDate && (
                <div style={{ marginTop: 24, padding: 16, background: 'var(--secondary-light)', borderRadius: 12, border: '1px solid var(--border-color)' }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase' }}>Scope Analysis</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {dateSchedules.length === 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--danger)', fontSize: 13, fontWeight: 600 }}>
                        <AlertCircle size={16} /> No schedules identified for this date.
                      </div>
                    ) : (
                      dateSchedules.map((s, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{s.subject}</span>
                          <span className="badge badge-primary" style={{ fontSize: 10 }}>{s.dept} Y{s.year}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1, height: 46 }}
                  disabled={generating || !examDate || dateSchedules.length === 0}
                  onClick={generate}
                >
                  <Play size={16} /> {generating ? 'Processing Logic...' : 'Run Allocation Engine'}
                </button>
              </div>
            </div>
          </div>

          {/* Logistics Summary */}
          {results && (
            <div className="card" style={{ borderLeft: '6px solid var(--success)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>Allocation Complete</h3>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>Status: Validated & Ready for deployment</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  <div style={{ background: 'var(--secondary-light)', padding: 16, borderRadius: 10 }}>
                    <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Halls Utilized</p>
                    <p style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{results.halls?.length || 0}</p>
                  </div>
                  <div style={{ background: 'var(--secondary-light)', padding: 16, borderRadius: 10 }}>
                    <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Seated Students</p>
                    <p style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{results.total_students || 0}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button onClick={() => window.location.href='/results'} className="btn btn-primary btn-sm">
                      View Roll <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Algorithm Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card" style={{ background: 'var(--secondary)', color: 'white' }}>
            <div className="card-header" style={{ background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ color: 'white' }}>🧠 Logic Intelligence</span>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { step: '01', title: 'Cohort Interleaving', desc: 'Students are grouped by department and interleaved to prevent proximity.' },
                  { step: '02', title: 'Resource Optimisation', desc: 'Optimises hall utilization based on capacity and distance metrics.' },
                  { step: '03', title: 'Deterministic Seating', desc: 'Ensures no two students from the same department are side-by-side.' },
                ].map(item => (
                  <div key={item.step} style={{ display: 'flex', gap: 16 }}>
                    <div style={{ fontSize: 20, fontWeight: 800, opacity: 0.2 }}>{item.step}</div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{item.title}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">📊 Resource Overview</div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Cpu size={16} color="var(--primary)" />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Algorithm Sync</span>
                  </div>
                  <span className="badge badge-success">Optimised</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Layers size={16} color="var(--accent)" />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Active Nodes</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{counts.halls} Halls</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllocationPage;
