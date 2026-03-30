import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useToast } from '../components/Toast';
import {
  getData, setData, seedData, deptClass, yearClass,
  type Student,
} from '../utils/data';

interface ModalState {
  open: boolean;
  isEdit: boolean;
  reg_no: string;
  name: string;
  dept: string;
  year: string;
}

const DEPTS = ['CSE', 'ECE', 'MECH', 'IT', 'EEE', 'CIVIL', 'BME'];
const YEARS = [1, 2, 3, 4];

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [modal, setModal] = useState<ModalState>({
    open: false, isEdit: false, reg_no: '', name: '', dept: '', year: '',
  });
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    seedData();
    loadStudents();
  }, []);

  const loadStudents = () => setStudents(getData<Student>('students'));

  const filtered = students.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.reg_no.toLowerCase().includes(search.toLowerCase());
    const matchDept = !filterDept || s.dept === filterDept;
    const matchYear = !filterYear || String(s.year) === filterYear;
    return matchSearch && matchDept && matchYear;
  });

  const openAdd = () => setModal({ open: true, isEdit: false, reg_no: '', name: '', dept: '', year: '' });
  const openEdit = (s: Student) => setModal({ open: true, isEdit: true, reg_no: s.reg_no, name: s.name, dept: s.dept, year: String(s.year) });
  const closeModal = () => setModal(m => ({ ...m, open: false }));

  const saveStudent = () => {
    const { reg_no, name, dept, year, isEdit } = modal;
    const cleanReg = reg_no.trim();
    const cleanName = name.trim().toUpperCase();
    const yearNum = parseInt(year);
    if (!cleanReg || !cleanName || !dept || !yearNum) { showToast('Please fill all required fields.', 'error'); return; }

    const list = getData<Student>('students');
    if (!isEdit) {
      if (list.find(s => s.reg_no === cleanReg)) { showToast('Register number already exists!', 'error'); return; }
      list.push({ reg_no: cleanReg, name: cleanName, dept, year: yearNum });
      showToast(`Student ${cleanName} added successfully!`, 'success');
    } else {
      const idx = list.findIndex(s => s.reg_no === cleanReg);
      if (idx !== -1) list[idx] = { reg_no: cleanReg, name: cleanName, dept, year: yearNum };
      showToast(`Student ${cleanName} updated!`, 'success');
    }
    setData('students', list);
    loadStudents();
    closeModal();
  };

  const deleteStudent = (reg_no: string) => {
    if (!confirm(`Delete student ${reg_no}?`)) return;
    setData('students', getData<Student>('students').filter(s => s.reg_no !== reg_no));
    showToast('Student deleted.', 'warning');
    loadStudents();
  };

  const updateAllYears = () => {
    if (!confirm('Promote all students by 1 year? (4th year remain). Proceed?')) return;
    setData('students', getData<Student>('students').map(s => ({ ...s, year: Math.min(s.year + 1, 4) })));
    showToast('All student years updated! 🎓', 'success');
    loadStudents();
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
                          <button className="btn-delete" onClick={() => deleteStudent(s.reg_no)}>🗑️ Delete</button>
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
