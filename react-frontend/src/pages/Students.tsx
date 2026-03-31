import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useToast } from '../components/Toast';
import { deptClass, yearClass, type Student } from '../utils/data';

const API_BASE = 'http://localhost:3000/api';

interface ModalState {
  open: boolean;
  isEdit: boolean;
  id?: string;
  reg_no: string;
  name: string;
  dept: string;
  year: string;
  semester: string;
  phone: string;
}

const DEPTS = ['CSE', 'ECE', 'MECH', 'IT', 'EEE', 'CIVIL', 'BME'];
const YEARS = [1, 2, 3, 4];

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [modal, setModal] = useState<ModalState>({
    open: false, isEdit: false, id: '', reg_no: '', name: '', dept: '', year: '', semester: '1', phone: ''
  });
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await fetch(`${API_BASE}/students`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (err) {
      showToast('Failed to load students from API.', 'error');
    }
  };

  const filtered = students.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.reg_no.toLowerCase().includes(search.toLowerCase());
    const matchDept = !filterDept || s.dept === filterDept;
    const matchYear = !filterYear || String(s.year) === filterYear;
    return matchSearch && matchDept && matchYear;
  });

  const openAdd = () => setModal({ open: true, isEdit: false, id: '', reg_no: '', name: '', dept: '', year: '', semester: '1', phone: '' });
  const openEdit = (s: Student) => setModal({ 
    open: true, isEdit: true, id: s.id, reg_no: s.reg_no, name: s.name, dept: s.dept, 
    year: String(s.year), semester: String(s.semester || '1'), phone: s.phone || '' 
  });
  const closeModal = () => setModal(m => ({ ...m, open: false }));

  const saveStudent = async () => {
    const { id, reg_no, name, dept, year, semester, phone, isEdit } = modal;
    const cleanReg = reg_no.trim();
    const cleanName = name.trim().toUpperCase();
    const yearNum = parseInt(year);
    const semNum = parseInt(semester);
    
    if (!cleanReg || !cleanName || !dept || !yearNum || !semNum || !phone) { 
      showToast('Please fill all required fields.', 'error'); 
      return; 
    }

    try {
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `${API_BASE}/students/${id}` : `${API_BASE}/students`;
      
      const payload = { 
        reg_no: cleanReg, name: cleanName, dept, year: yearNum, semester: semNum, phone 
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || 'Failed to save student.', 'error');
        return;
      }

      showToast(`Student ${cleanName} ${isEdit ? 'updated' : 'added'}!`, 'success');
      loadStudents();
      closeModal();
    } catch (err) {
      showToast('API error while saving student.', 'error');
    }
  };

  const deleteStudent = async (id: string | undefined, reg_no: string) => {
    if (!id || !confirm(`Delete student ${reg_no}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/students/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Student deleted.', 'warning');
        loadStudents();
      }
    } catch (err) {
      showToast('API error while deleting student.', 'error');
    }
  };

  const updateAllYears = async () => {
    if (!confirm('Promote all students by 1 year? (4th year remain). Proceed?')) return;
    try {
      // In a real app, this should be a bulk API. For now, we update individually.
      let count = 0;
      for (const s of students) {
        if (s.year < 4 && s.id) {
          await fetch(`${API_BASE}/students/${s.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...s, year: s.year + 1 })
          });
          count++;
        }
      }
      showToast(`Updated ${count} students! 🎓`, 'success');
      loadStudents();
    } catch (err) {
      showToast('Error updating years.', 'error');
    }
  };

  const depts = [...new Set(students.map(s => s.dept))];

  return (
    <Layout>
      <ToastContainer />

      <div className="page-title-box">
        <h1 className="page-title">Student Management</h1>
        <p className="page-subtitle">Manage student records · Add, edit, delete and update year</p>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          👨‍🎓 Student Records
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-sm" onClick={openAdd}
              style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
              ➕ Add Student
            </button>
            <button className="btn btn-sm" onClick={updateAllYears}
              style={{ background: '#e8a44a', color: '#fff' }}>
              🎓 Update Year
            </button>
          </div>
        </div>

        <div className="card-body">
          {/* Sidebar stats strip */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 12, color: '#555' }}>
            <span>Total Students: <strong>{students.length}</strong></span>
            <span>Departments: <strong>{depts.join(', ') || '—'}</strong></span>
          </div>

          {/* Filters */}
          <div className="filter-row" style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <input type="text" placeholder="🔍 Search by name or reg no…" value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 200, padding: '6px 10px', border: '1px solid #ccc', borderRadius: 4, fontSize: 13 }} />
            <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
              style={{ padding: '6px 10px', border: '1px solid #ccc', borderRadius: 4, fontSize: 13 }}>
              <option value="">All Departments</option>
              {DEPTS.map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={filterYear} onChange={e => setFilterYear(e.target.value)}
              style={{ padding: '6px 10px', border: '1px solid #ccc', borderRadius: 4, fontSize: 13 }}>
              <option value="">All Years</option>
              {YEARS.map(y => <option key={y} value={y}>{y}{['st','nd','rd','th'][y-1]} Year</option>)}
            </select>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['#','Reg. No','Student Name','Department','Year','Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 14px', background: '#f8f9fa', color: '#666', fontSize: 12, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 30, color: '#aaa' }}>No students found.</td></tr>
                ) : (
                  filtered.map((s, i) => (
                    <tr key={s.reg_no} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px 14px', fontSize: 13 }}>{i + 1}</td>
                      <td style={{ padding: '10px 14px', fontSize: 13 }}><strong>{s.reg_no}</strong></td>
                      <td style={{ padding: '10px 14px', fontSize: 13 }}>{s.name}</td>
                      <td style={{ padding: '10px 14px', fontSize: 13 }}>
                        <span className={`badge-dept ${deptClass(s.dept)}`}>{s.dept}</span>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 13 }}>
                        <span className={`badge-year ${yearClass(s.year)}`}>Year {s.year}</span>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 13 }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn-edit" onClick={() => openEdit(s)}>✏️ Edit</button>
                          <button className="btn-delete" onClick={() => deleteStudent(s.id, s.reg_no)}>🗑️ Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: '#888' }}>
            Showing {filtered.length} of {students.length} students
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="modal-overlay active" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal">
            <div className="modal-header">
              <span>{modal.isEdit ? '✏️ Edit Student' : '➕ Add Student'}</span>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Register Number *</label>
                  <input type="text" placeholder="e.g. 43601001" value={modal.reg_no}
                    disabled={modal.isEdit}
                    onChange={e => setModal(m => ({ ...m, reg_no: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Student Name *</label>
                  <input type="text" placeholder="Full name in CAPS" value={modal.name}
                    onChange={e => setModal(m => ({ ...m, name: e.target.value }))} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
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
                  <label>Semester *</label>
                  <input type="number" min="1" max="8" placeholder="e.g. 6" value={modal.semester}
                    onChange={e => setModal(m => ({ ...m, semester: e.target.value }))} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Phone Number *</label>
                  <input type="text" placeholder="10-digit phone number" value={modal.phone}
                    onChange={e => setModal(m => ({ ...m, phone: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-grey" onClick={closeModal}>Cancel</button>
              <button className="btn btn-maroon" onClick={saveStudent}>💾 Save Student</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Students;
