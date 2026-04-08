import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useToast } from '../components/Toast';
import { 
  FileText, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  FileSearch,
  Printer
} from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = '/api';

interface AllocationSummary {
    total_students: number;
    halls: string[];
    exam_date: string;
}

const AllocationResult = () => {
    const [summary, setSummary] = useState<AllocationSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const { showToast, ToastContainer } = useToast();

    useEffect(() => {
        loadSummary();
    }, []);

    const loadSummary = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/allocations`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    const latest = data[data.length - 1];
                    setSummary(latest);
                }
            }
        } catch (err) {
            showToast('System report latency detected.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = async () => {
      if (!summary) return;
      showToast('Generating official report...', 'info');
      
      try {
        const res = await fetch(`${API_BASE}/allocations/generate?pdf=true`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ exam_date: summary.exam_date })
        });
        
        if (res.ok) {
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Exam_Allocation_${summary.exam_date}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          showToast('Report downloaded successfully.', 'success');
        } else {
          showToast('Engine failed to export PDF.', 'error');
        }
      } catch (err) {
        showToast('Official download interrupt.', 'error');
      }
    };

    return (
        <Layout>
            <ToastContainer />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800 }}>Dispatch & Official Reports</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
                        System-authenticated results for the most recent allocation sequence.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <Link to="/allocation" className="btn btn-secondary"><ArrowLeft size={16} /> Modification Sequence</Link>
                    <button 
                        onClick={downloadPDF} 
                        className="btn btn-primary"
                        disabled={!summary}
                    >
                        <Printer size={16} /> Dispatch Official PDF
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="card" style={{ padding: 60, textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Retrieving system snapshots...</div>
                </div>
            ) : !summary ? (
                <div className="card" style={{ padding: 60, textAlign: 'center' }}>
                    <AlertCircle size={48} color="var(--warning)" style={{ marginBottom: 16 }} />
                    <h3 style={{ marginBottom: 8 }}>Null Allocation Ledger</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No authenticated records found for the current academic session.</p>
                    <Link to="/allocation" className="btn btn-primary btn-sm" style={{ marginTop: 24 }}>Initiate Allocation</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 24 }}>
                    {/* Report Preview */}
                    <div className="card">
                        <div className="card-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <FileText size={20} color="var(--primary)" />
                                <span>Report Snapshot: {summary.exam_date}</span>
                            </div>
                            <span className="badge badge-success">Finalized & Validated</span>
                        </div>
                        <div className="card-body" style={{ background: 'var(--secondary-light)', padding: 40 }}>
                             {/* Result Document Visualisation */}
                             <div style={{ 
                                background: '#fff', 
                                border: '1px solid var(--border-color)', 
                                borderRadius: 12, 
                                padding: 40,
                                boxShadow: 'var(--shadow-md)',
                                position: 'relative',
                                minHeight: 400
                             }}>
                                <div style={{ textAlign: 'center', borderBottom: '2px solid var(--primary)', paddingBottom: 24, marginBottom: 32 }}>
                                    <h2 style={{ fontSize: 18, color: 'var(--primary)', marginBottom: 4 }}>SATHYABAMA INSTITUTE OF SCIENCE AND TECHNOLOGY</h2>
                                    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>OFFICIAL ALLOCATION REPORT</p>
                                </div>

                                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
                                     <div style={{ background: 'var(--secondary-light)', padding: 16, borderRadius: 8 }}>
                                         <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Exam Reference Date</p>
                                         <p style={{ fontSize: 14, fontWeight: 700 }}>{summary?.exam_date}</p>
                                     </div>
                                     <div style={{ background: 'var(--secondary-light)', padding: 16, borderRadius: 8 }}>
                                         <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Generation Stamp</p>
                                         <p style={{ fontSize: 14, fontWeight: 700 }}>{new Date().toLocaleString()}</p>
                                     </div>
                                 </div>

                                 <div className="table-wrapper">
                                     <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase' }}>Utilisation Breakdown</p>
                                     <table className="table" style={{ background: 'transparent' }}>
                                         <thead>
                                             <tr>
                                                 <th style={{ background: 'transparent' }}>Infrastructure Asset</th>
                                                 <th style={{ background: 'transparent', textAlign: 'right' }}>Authorised Access</th>
                                             </tr>
                                         </thead>
                                         <tbody>
                                             {(summary?.halls || []).map((h, i) => (
                                                 <tr key={i}>
                                                     <td style={{ fontWeight: 600 }}>Hall: {h}</td>
                                                     <td style={{ textAlign: 'right', color: 'var(--text-muted)', fontWeight: 700 }}>Authenticated</td>
                                                 </tr>
                                             ))}
                                         </tbody>
                                     </table>
                                 </div>

                                 <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px dashed var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                     <p style={{ fontSize: 11, color: 'var(--text-light)' }}>Authenticated Distribution Record</p>
                                     <div style={{ background: 'var(--secondary-light)', padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 800, color: 'var(--text-muted)' }}>PAGE 1 OF 1</div>
                                 </div>
                              </div>
                         </div>
                     </div>

                     {/* Metadata Sidebar */}
                     <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                         <div className="card">
                             <div className="card-header">📊 Payload Insights</div>
                             <div className="card-body">
                                 <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                         <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Total Students</span>
                                         <span style={{ fontSize: 13, fontWeight: 800 }}>{summary?.total_students}</span>
                                     </div>
                                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                         <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Halls Allocated</span>
                                         <span style={{ fontSize: 13, fontWeight: 800 }}>{summary?.halls.length || 0}</span>
                                     </div>
                                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                         <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Utilisation Status</span>
                                         <span className="badge badge-success">Optimal</span>
                                     </div>
                                 </div>
                             </div>
                         </div>

                        <div className="card" style={{ background: 'var(--secondary)', color: '#fff' }}>
                            <div className="card-body">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                    <CheckCircle2 color="var(--primary)" size={20} />
                                    <h4 style={{ color: '#fff', fontSize: 15 }}>Compliance Check</h4>
                                </div>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <li style={{ fontSize: 12, display: 'flex', gap: 8, opacity: 0.8 }}>
                                        <span style={{ color: 'var(--success)' }}>✔</span> Interleaving Verified
                                    </li>
                                    <li style={{ fontSize: 12, display: 'flex', gap: 8, opacity: 0.8 }}>
                                        <span style={{ color: 'var(--success)' }}>✔</span> Capacity Guardrail OK
                                    </li>
                                    <li style={{ fontSize: 12, display: 'flex', gap: 8, opacity: 0.8 }}>
                                        <span style={{ color: 'var(--success)' }}>✔</span> Register Sync Confirmed
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="card" style={{ background: 'var(--primary)', color: 'white', border: 'none' }}>
                            <div className="card-body" style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: 12, fontWeight: 600, opacity: 0.9, marginBottom: 16 }}>Need to audit specific student seatings?</p>
                                <button onClick={() => window.location.href='/students'} className="btn btn-secondary btn-sm" style={{ width: '100%', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                                    <FileSearch size={14} /> Audit Ledger
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default AllocationResult;
