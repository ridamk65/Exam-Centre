import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useToast } from '../components/Toast';
import {
  getData, setData, seedData, deptClass, yearClass, fmtDate, genId,
  type ExamSchedule,
} from '../utils/data';

interface ModalState {
  open: boolean;
  isEdit: boolean;
  id: number | null;
  exam_date: string;
  dept: string;
  year: string;
  subject: string;
}

const DEPTS = ['CSE', 'ECE', 'MECH', 'IT', 'EEE', 'CIVIL', 'BME'];
const YEARS = [1, 2, 3, 4];

const ExamSchedulePage = () => {
  const [schedules, setSchedules] = useState<ExamSchedule[]>([]);
  const [filterDate, setFilterDate] = useState('');
  const [modal, setModal] = useState<ModalState>({
    open: false, isEdit: false, id: null, exam_date: '', dept: '', year: '', subject: '',
  });
  const { showToast, ToastContainer } = useToast();

  useEffect(() => { seedData(); loadSchedules(); }, []);

  const loadSchedules = () => setSchedules(getData<ExamSchedule>('exam_schedule'));

  const filtered = filterDate ? schedules.filter(s => s.exam_date === filterDate) : schedules;
  const uniqueDates = [...new Set(schedules.map(s => fmtDate(s.exam_date)))];

  const openAdd = () => setModal({ open: true, isEdit: false, id: null, exam_date: '', dept: '', year: '', subject: '' });
  const openEdit = (s: ExamSchedule) => setModal({ open: true, isEdit: true, id: s.id, exam_date: s.exam_date, dept: s.dept, year: String(s.year), subject: s.subject });
  const closeModal = () => setModal(m => ({ ...m, open: false }));

  const saveSchedule = () => {
    const { exam_date, dept, year, subject, isEdit, id } = modal;
    const yearNum = parseInt(year);
    const cleanSubject = subject.trim();
    if (!exam_date || !dept || !yearNum || !cleanSubject) { showToast('Please fill all fields.', 'error'); return; }

    const list = getData<ExamSchedule>('exam_schedule');
    if (!isEdit) {
      list.push({ id: genId(), exam_date, dept, year: yearNum, subject: cleanSubject });
      showToast('Exam schedule added!', 'success');
    } else {
      const idx = list.findIndex(s => s.id === id);
      if (idx !== -1) list[idx] = { id: id!, exam_date, dept, year: yearNum, subject: cleanSubject };
      showToast('Exam schedule updated!', 'success');
    }
    setData('exam_schedule', list);
    loadSchedules();
    closeModal();
  };

  const deleteSchedule = (id: number) => {
    if (!confirm('Delete this exam schedule?')) return;
    setData('exam_schedule', getData<ExamSchedule>('exam_schedule').filter(s => s.id !== id));
    showToast('Schedule deleted.', 'warning');
    loadSchedules();
  };

  return (
    <Layout>
      <ToastContainer />

      <div className="page-title-box">
        <h1 className="page-title">Exam Schedule Management</h1>
        <p className="page-subtitle">Add, edit and manage examination schedules by date, department and year</p>
      </div>

      <div className="card">
        <div className="card-header">
          📅 Exam Schedules
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
              style={{ padding: '4px 8px', fontSize: 12, border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 3, width: 140 }} />
            <button className="btn btn-sm" onClick={openAdd}
              style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
              ➕ Add Schedule
            </button>
          </div>
        </div>

        <div className="card-body">
          <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 12, color: '#555' }}>
            <span>Total Schedules: <strong>{schedules.length}</strong></span>
            <span>Exam Dates: <strong>{uniqueDates.join(', ') || '—'}</strong></span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['#', 'Exam Date', 'Department', 'Year', 'Subject', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 14px', background: '#f8f9fa', color: '#666', fontSize: 12, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 30, color: '#aaa' }}>
                    {filterDate ? 'No exams on this date.' : 'No schedules added yet.'}
                  </td></tr>
                ) : (
                  filtered.map((s, i) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px 14px', fontSize: 13 }}>{i + 1}</td>
                      <td style={{ padding: '10px 14px', fontSize: 13 }}><strong>{fmtDate(s.exam_date)}</strong></td>
                      <td style={{ padding: '10px 14px', fontSize: 13 }}>
                        <span className={`badge-dept ${deptClass(s.dept)}`}>{s.dept}</span>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 13 }}>
                        <span className={`badge-year ${yearClass(s.year)}`}>Year {s.year}</span>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 13 }}>{s.subject}</td>
                      <td style={{ padding: '10px 14px', fontSize: 13 }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn-edit" onClick={() => openEdit(s)}>✏️ Edit</button>
                          <button className="btn-delete" onClick={() => deleteSchedule(s.id)}>🗑️ Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: '#888' }}>
            Showing {filtered.length} of {schedules.length} schedules
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="modal-overlay active" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal">
            <div className="modal-header">
              <span>{modal.isEdit ? '✏️ Edit Schedule' : '➕ Add Exam Schedule'}</span>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Exam Date *</label>
                  <input type="date" value={modal.exam_date}
                    onChange={e => setModal(m => ({ ...m, exam_date: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <select value={modal.dept} onChange={e => setModal(m => ({ ...m, dept: e.target.value }))}>
                    <option value="">Select Department</option>
                    {DEPTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Year *</label>
                  <select value={modal.year} onChange={e => setModal(m => ({ ...m, year: e.target.value }))}>
                    <option value="">Select Year</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}{['st','nd','rd','th'][y-1]} Year</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Subject *</label>
                  <input type="text" placeholder="e.g. Data Structures" value={modal.subject}
                    onChange={e => setModal(m => ({ ...m, subject: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-grey" onClick={closeModal}>Cancel</button>
              <button className="btn btn-maroon" onClick={saveSchedule}>💾 Save Schedule</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ExamSchedulePage;
