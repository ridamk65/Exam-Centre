import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useToast } from '../components/Toast';
import { 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  UserPlus, 
  Download,
  CalendarDays
} from 'lucide-react';

const API_BASE = '/api';

interface Student {
  id: string;
  reg_no: string;
  name: string;
  dept: string;
  year: number;
}

interface ModalState {
  open: boolean;
  isEdit: boolean;
  id: string;
  reg_no: string;
  name: string;
  dept: string;
  year: string;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [modal, setModal] = useState<ModalState>({ 
    open: false, isEdit: false, id: '', reg_no: '', name: '', dept: '', year: '' 
  });
  const { showToast, ToastContainer } = useToast();

  useEffect(() => { loadStudents(); }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/students`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (err) {
      showToast('Error connecting to backend.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter(s => 
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.reg_no.includes(search)) &&
    (filterDept === '' || s.dept === filterDept)
  );

  const depts = [...new Set(students.map(s => s.dept))];

  const openAdd = () => setModal({ 
    open: true, isEdit: false, id: '', reg_no: '', name: '', dept: '', year: '1' 
  });
  
  const openEdit = (s: Student) => setModal({ 
    open: true, isEdit: true, id: s.id, reg_no: s.reg_no, name: s.name, dept: s.dept, year: String(s.year) 
  });

  const closeModal = () => setModal(m => ({ ...m, open: false }));

  const saveStudent = async () => {
    const { reg_no, name, dept, year, id, isEdit } = modal;
    if (!reg_no || !name || !dept || !year) {
      showToast('Incomplete data. Please check all fields.', 'error');
      return;
    }

    try {
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `${API_BASE}/students/${id}` : `${API_BASE}/students`;
      const res = await fetch(url, {
        method, 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ reg_no, name, dept, year: Number(year) })
      });

      if (res.ok) {
        showToast(`Student ${isEdit ? 'updated' : 'registered'}!`, 'success');
        loadStudents();
        closeModal();
      } else {
        const err = await res.json();
        showToast(err.error || 'Operation failed.', 'error');
      }
    } catch (err) {
      showToast('API Communication Error.', 'error');
    }
  };

  const deleteStudent = async (id: string, name: string) => {
    if (!confirm(`Permanently remove student ${name} from the system?`)) return;
    try {
      const res = await fetch(`${API_BASE}/students/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Record deleted successfully.', 'warning');
        loadStudents();
      }
    } catch (err) {
      showToast('Error performing deletion.', 'error');
    }
  };

  return (
    <Layout>
      <ToastContainer />
      
      <div style={{ 
        display: 'flex', alignItems: 'center', 
        justifyContent: 'space-between', marginBottom: 32 
      }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Student Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Central repository of enrolled students across all departments.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary"><Download size={16} /> Export Records</button>
          <button className="btn btn-primary" onClick={openAdd}><UserPlus size={16} /> Register New Student</button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input 
              type="text" className="form-control" placeholder="Search by name or register number..." 
              style={{ paddingLeft: 40, height: 42 }}
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          <div style={{ width: 1, height: 24, background: 'var(--border-color)' }}></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Filter size={16} color="var(--text-muted)" />
            <select 
              className="form-control" style={{ height: 42, width: 180 }}
              value={filterDept} onChange={e => setFilterDept(e.target.value)}
            >
              <option value="">All Departments</option>
              {depts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          
          <div style={{ flex: 1 }}></div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Showing {filtered.length} Results</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Registration No.</th>
                <th>Full Name</th>
                <th>Department</th>
                <th>Academic Year</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Initialising student ledger...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No student records found matching the criteria.</td></tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id}>
                    <td><strong style={{ color: 'var(--secondary)', letterSpacing: '0.2px' }}>{s.reg_no}</strong></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>
                          {s.name.charAt(0)}
                        </div>
                        {s.name}
                      </div>
                    </td>
                    <td><span className="badge badge-primary">{s.dept}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontWeight: 600, fontSize: 13 }}>
                        <CalendarDays size={14} /> Year {s.year}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                        <button onClick={() => openEdit(s)} className="action-btn-erp edit" title="Edit Record"><Edit3 size={15} /></button>
                        <button onClick={() => deleteStudent(s.id, s.name)} className="action-btn-erp delete" title="Remove Record"><Trash2 size={15} /></button>
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
          <div className="modal-content" style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>{modal.isEdit ? 'Update Student' : 'New Registration'}</h3>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Enrollment Management System</p>
                </div>
              </div>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" className="form-control" placeholder="e.g. Johnathan Doe" 
                  value={modal.name} onChange={e => setModal(m => ({ ...m, name: e.target.value }))}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Register Number</label>
                  <input 
                    type="text" className="form-control" placeholder="e.g. 43601001" 
                    value={modal.reg_no} onChange={e => setModal(m => ({ ...m, reg_no: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Year of Study</label>
                  <select 
                    className="form-control" 
                    value={modal.year} onChange={e => setModal(m => ({ ...m, year: e.target.value }))}
                  >
                    {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Department</label>
                <select 
                  className="form-control" 
                  value={modal.dept} onChange={e => setModal(m => ({ ...m, dept: e.target.value }))}
                >
                  <option value="">Select Department</option>
                  {['CSE', 'ECE', 'MECH', 'IT', 'EEE', 'CIVIL', 'BME'].map(d => <option key={d} value={d}>{d} Engineering</option>)}
                </select>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Discard</button>
              <button className="btn btn-primary" onClick={saveStudent}>
                {modal.isEdit ? 'Sync Changes' : 'Confirm Registration'}
              </button>
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

export default Students;
