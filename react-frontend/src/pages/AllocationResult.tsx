
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useToast } from '../components/Toast';
import { 
  FileText, 
  ArrowLeft, 
  AlertCircle,
  FileSearch,
  Printer
} from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = '/api';

const printStyles = `
@media print {
  body * {
    visibility: hidden;
    background: white !important;
  }
  #printable-content, #printable-content * {
    visibility: visible;
  }
  #printable-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    box-shadow: none !important;
    border: none !important;
  }
  .no-print, .btn, .card-header {
    display: none !important;
  }
  .badge {
    border: 1px solid #ddd !important;
    color: black !important;
    background: transparent !important;
  }
  .table th {
    background: #f0f0f0 !important;
    color: black !important;
  }
}
`;

interface AllocationSummary {
    total_students: number;
    halls: any[];
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

    const downloadPDF = () => {
      if (!summary) return;
      window.print();
    };

    return (
        <Layout>
            <style>{printStyles}</style>
            <ToastContainer />

            <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div className="card" id="printable-content">
                        <div className="card-header no-print">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <FileText size={20} color="var(--primary)" />
                                <span>Report Snapshot: {summary.exam_date}</span>
                            </div>
                            <span className="badge badge-success">Finalized & Validated</span>
                        </div>
                        <div className="card-body" style={{ background: 'var(--secondary-light)', padding: 40 }}>
                             <div style={{ 
                                background: '#fff', 
                                border: '1px solid var(--border-color)', 
                                borderRadius: 12, 
                                padding: 40,
                                boxShadow: 'var(--shadow-md)',
                                minHeight: 600
                             }}>
                                <div style={{ textAlign: 'center', borderBottom: '2px solid var(--primary)', paddingBottom: 24, marginBottom: 32 }}>
                                    <h2 style={{ fontSize: 18, color: 'var(--primary)', marginBottom: 4 }}>SATHYABAMA INSTITUTE OF SCIENCE AND TECHNOLOGY</h2>
                                    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>OFFICIAL SEATING ALLOTMENT</p>
                                </div>

                                 {(summary.halls || []).map((h: any, i: number) => (
                                     <div key={i} style={{ marginBottom: 48, pageBreakAfter: 'always' }}>
                                         <div style={{ 
                                             display: 'flex', 
                                             justifyContent: 'space-between', 
                                             alignItems: 'end', 
                                             borderBottom: '1px solid var(--primary)',
                                             paddingBottom: 8,
                                             marginBottom: 16
                                         }}>
                                             <div>
                                                 <h3 style={{ margin: 0, color: 'var(--primary)' }}>Hall No: {h.hall_no}</h3>
                                                 <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>Location: {h.block} • Floor {h.floor}</p>
                                             </div>
                                             <div style={{ textAlign: 'right' }}>
                                                 <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)' }}>TOTAL SEATED: {h.allocated}</span>
                                             </div>
                                         </div>

                                         <table className="table" style={{ fontSize: 12 }}>
                                             <thead>
                                                 <tr style={{ background: 'var(--secondary-light)' }}>
                                                     <th style={{ width: 120 }}>Reg No.</th>
                                                     <th>Student Name</th>
                                                     <th style={{ width: 80 }}>Dept</th>
                                                     <th style={{ width: 60, textAlign: 'center' }}>Seat</th>
                                                 </tr>
                                             </thead>
                                             <tbody>
                                                 {(h.students || []).map((st: any, idx: number) => (
                                                     <tr key={idx}>
                                                         <td style={{ fontWeight: 700 }}>{st.reg_no}</td>
                                                         <td>{st.name}</td>
                                                         <td><span className="badge badge-primary" style={{ fontSize: 9 }}>{st.dept}</span></td>
                                                         <td style={{ textAlign: 'center', fontWeight: 800 }}>{st.seat_no}</td>
                                                     </tr>
                                                 ))}
                                             </tbody>
                                         </table>
                                     </div>
                                 ))}

                                 <div className="no-print" style={{ marginTop: 40, paddingTop: 20, borderTop: '1px dashed var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                     <p style={{ fontSize: 11, color: 'var(--text-light)' }}>Authenticated University Examination Record</p>
                                     <div style={{ background: 'var(--secondary-light)', padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 800, color: 'var(--text-muted)' }}>SECURE DISPATCH</div>
                                 </div>
                              </div>
                        </div>
                    </div>

                    <div className="no-print" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        <div className="card">
                            <div className="card-header">📊 Logistics Audit</div>
                            <div className="card-body">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Total Payload</span>
                                        <span style={{ fontSize: 13, fontWeight: 800 }}>{summary.total_students} Students</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Active Halls</span>
                                        <span style={{ fontSize: 13, fontWeight: 800 }}>{summary.halls?.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card" style={{ background: 'var(--primary)', color: 'white', border: 'none' }}>
                            <div className="card-body" style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: 12, fontWeight: 600, opacity: 0.9, marginBottom: 16 }}>Need to verify the master student list?</p>
                                <button onClick={() => window.location.href='/students'} className="btn btn-secondary btn-sm" style={{ width: '100%', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                                    <FileSearch size={14} /> Master Roll
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
