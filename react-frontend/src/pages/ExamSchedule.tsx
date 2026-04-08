import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useToast } from '../components/Toast';
import { 
  Calendar, 
  BookOpen, 
  Plus, 
  Edit3,
  Trash2,
  Bookmark,
  FileSpreadsheet
} from 'lucide-react';

import * as XLSX from 'xlsx';

import { fmtDate } from '../utils/data';

const API_BASE = '/api';

interface ExamSchedule {
  id: string;
  exam_date: string;
  dept: string;
  year: number;
  subject: string;
}

interface ModalState {
  open: boolean;
  isEdit: boolean;
  id: string;
  exam_date: string;
  dept: string;
  year: string;
  subject: string;
}

const YEARS = [1, 2, 3, 4];

const ExamSchedulePage = () => {
  const [schedules, setSchedules] = useState<ExamSchedule[]>([]);
  const [dynamicDepts, setDynamicDepts] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');
  const [modal, setModal] = useState<ModalState>({
    open: false, isEdit: false, id: '', exam_date: '', dept: '', year: '', subject: '',
  });
  const [isBulkUploading, setIsBulkUploading] = useState(false);


  const { showToast, ToastContainer } = useToast();

  useEffect(() => { 
    loadSchedules(); 
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const res = await fetch(`${API_BASE}/students/departments`);
      if (res.ok) {
        const data = await res.json();
        setDynamicDepts(data);
      }
    } catch (err) {
      console.error('Failed to load depts');
    }
  };

  const loadSchedules = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/schedules`);
      if (res.ok) {
        const data = await res.json();
        setSchedules(data);
      }
    } catch (err) {
      showToast('System connectivity error.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filtered = filterDate ? schedules.filter(s => s.exam_date === filterDate) : schedules;
  const uniqueDates = [...new Set(schedules.map(s => fmtDate(s.exam_date)))];

  const openAdd = () => setModal({ open: true, isEdit: false, id: '', exam_date: '', dept: '', year: '1', subject: '' });
  const openEdit = (s: ExamSchedule) => setModal({ 
    open: true, isEdit: true, id: s.id, exam_date: s.exam_date, 
    dept: s.dept, year: String(s.year), subject: s.subject 
  });
  const closeModal = () => setModal(m => ({ ...m, open: false }));

  const saveSchedule = async () => {
    const { exam_date, dept, year, subject, isEdit, id } = modal;
    if (!exam_date || !dept || !year || !subject) {
      showToast('Mandatory fields missing. Please review.', 'error'); return;
    }

    try {
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `${API_BASE}/schedules/${id}` : `${API_BASE}/schedules`;
      const res = await fetch(url, {
        method, 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ exam_date, dept, year: Number(year), subject: subject.trim() })
      });

      if (res.ok) {
        showToast(`Schedule ${isEdit ? 'updated' : 'recorded'}.`, 'success');
        loadSchedules();
        closeModal();
      } else {
        showToast('Request processing failure.', 'error');
      }
    } catch (err) {
      showToast('API Failure.', 'error');
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsBulkUploading(true);
    const reader = new FileReader();
    
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: any[] = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          showToast('Excel file is empty.', 'error');
          return;
        }

        // Send to bulk endpoint
        const res = await fetch(`${API_BASE}/schedules/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: data })
        });

        if (res.ok) {
          const result = await res.json();
          showToast(`Bulk Sync Complete: ${result.count} exams scheduled.`, 'success');
          loadSchedules();
        } else {
          showToast('Bulk upload failed. Verify sheet format.', 'error');
        }
      } catch (err) {
        showToast('Error parsing Excel file.', 'error');
      } finally {
        setIsBulkUploading(false);
        if (e.target) e.target.value = '';
      }
    };
    
    reader.readAsBinaryString(file);
  };

  const deleteSchedule = async (id: string, subject: string) => {
    if (!confirm(`Confirm: Delete exam schedule for ${subject}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/schedules/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Schedule purged.', 'warning');
        loadSchedules();
      }
    } catch (err) {
      showToast('Action failed.', 'error');
    }
  };

  return (
    <Layout>
      <ToastContainer />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Exam Schedule Ledger</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Master calendar for university-wide examination dates and subject mapping.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <input 
            type="file" accept=".xlsx, .xls, .csv" 
            style={{ display: 'none' }} 
            id="bulk-upload-input"
            onChange={handleBulkUpload}
          />
          <label htmlFor="bulk-upload-input" className="btn btn-secondary" style={{ cursor: 'pointer' }}>
            {isBulkUploading ? 'Uploading...' : <><FileSpreadsheet size={16} /> Bulk Upload</>}
          </label>
          <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> New Exam Schedule</button>
        </div>
      </div>


      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
            <label className="form-label" style={{ fontSize: 9, marginBottom: 4 }}>Filter by Date</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="date" className="form-control" style={{ height: 42, background: 'var(--secondary-light)' }} 
                value={filterDate} onChange={e => setFilterDate(e.target.value)}
              />
            </div>
          </div>
          
          <div style={{ width: 1, height: 24, background: 'var(--border-color)', marginTop: 16 }}></div>
          
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Calendar size={16} color="var(--text-muted)" />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>
              Active Dates: {uniqueDates.length}
            </span>
          </div>

          <div style={{ flex: 1 }}></div>
          <button className="btn btn-secondary" onClick={() => setFilterDate('')} style={{ marginTop: 16 }}>Clear Filter</button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Examination Date</th>
                <th>Academic Depth</th>
                <th>Level</th>
                <th>Subject & Syllabus</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Synchronising master calendar...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No examinations scheduled for this timeframe.</td></tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ 
                          width: 44, height: 44, borderRadius: 10, background: 'var(--secondary-light)',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            {new Date(s.exam_date).toLocaleString('en-US', { month: 'short' })}
                          </span>
                          <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                            {new Date(s.exam_date).getDate()}
                          </span>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{fmtDate(s.exam_date)}</div>
                      </div>
                    </td>
                    <td><span className="badge badge-primary">{s.dept} ENGINEERING</span></td>
                    <td><div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>YEAR {s.year}</div></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <BookOpen size={16} color="var(--accent)" />
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{s.subject}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                        <button onClick={() => openEdit(s)} className="action-btn-erp edit"><Edit3 size={14} /></button>
                        <button onClick={() => deleteSchedule(s.id, s.subject)} className="action-btn-erp delete"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content" style={{ maxWidth: 460 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12 }}>
                  <Calendar size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>{modal.isEdit ? 'Update Schedule' : 'Schedule New Exam'}</h3>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Exam Branch Operations</p>
                </div>
              </div>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Subject & Course Name</label>
                <div style={{ position: 'relative' }}>
                  <Bookmark size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input 
                    type="text" className="form-control" style={{ paddingLeft: 36 }} placeholder="e.g. Adv. Data Structures" 
                    value={modal.subject} onChange={e => setModal(m => ({ ...m, subject: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Examination Date</label>
                <input 
                  type="date" className="form-control" 
                  value={modal.exam_date} onChange={e => setModal(m => ({ ...m, exam_date: e.target.value }))}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Target Dept.</label>
                  <select 
                    className="form-control" 
                    value={modal.dept} onChange={e => setModal(m => ({ ...m, dept: e.target.value }))}
                  >
                    <option value="">Select Dept.</option>
                    {dynamicDepts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>

                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Study Year</label>
                  <select 
                    className="form-control" 
                    value={modal.year} onChange={e => setModal(m => ({ ...m, year: e.target.value }))}
                  >
                    {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Discard</button>
              <button className="btn btn-primary" onClick={saveSchedule}>Schedule Examination</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .action-btn-erp {
          width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border-color);
          background: #fff; cursor: pointer; display: flex; align-items: center; 
          justify-content: center; transition: all 0.2s;
        }
        .action-btn-erp.edit:hover { background: var(--primary-light); color: var(--primary); border-color: rgba(131, 18, 56, 0.1); }
        .action-btn-erp.delete:hover { background: #fee2e2; color: #dc2626; border-color: #fecaca; }
      `}</style>
    </Layout>
  );
};

export default ExamSchedulePage;
