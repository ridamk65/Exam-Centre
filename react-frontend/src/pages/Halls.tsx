import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useToast } from '../components/Toast';
import { 
  Plus, 
  Layers, 
  Edit3, 
  Trash2, 
  School,
  Building2,
  LayoutGrid
} from 'lucide-react';

const API_BASE = '/api';

interface Hall {
  id: string;
  hall_no: string;
  block_name: string;
  floor: number;
  capacity: number;
  rows?: number;
  seats_per_row?: number;
}

interface ModalState {
  open: boolean;
  isEdit: boolean;
  id: string;
  hall_no: string;
  block_name: string;
  floor: string;
  capacity: string;
  rows: string;
  seats_per_row: string;
}

const BLOCKS = ['A', 'B', 'C', 'D', 'E'];

const Halls = () => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({
    open: false, isEdit: false, id: '', hall_no: '', block_name: '', floor: '', capacity: '', rows: '5', seats_per_row: '8'
  });
  const { showToast, ToastContainer } = useToast();

  useEffect(() => { loadHalls(); }, []);

  const loadHalls = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/halls`);
      if (res.ok) {
        const data = await res.json();
        setHalls(data);
      }
    } catch (err) {
      showToast('Backend connection failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const totalCapacity = halls.reduce((a, h) => a + Number(h.capacity), 0);

  const openAdd = () => setModal({ 
    open: true, isEdit: false, id: '', hall_no: '', block_name: '', floor: '', capacity: '', rows: '5', seats_per_row: '8' 
  });
  
  const openEdit = (h: Hall) => setModal({ 
    open: true, isEdit: true, id: h.id, hall_no: h.hall_no, block_name: h.block_name, 
    floor: String(h.floor), capacity: String(h.capacity), 
    rows: String(h.rows || 5), seats_per_row: String(h.seats_per_row || 8) 
  });

  const closeModal = () => setModal(m => ({ ...m, open: false }));

  const saveHall = async () => {
    const { hall_no, block_name, id, isEdit, floor, capacity, rows, seats_per_row } = modal;
    if (!hall_no || !block_name || !floor || !capacity) {
      showToast('Validation Failed: Required fields missing.', 'error'); return;
    }

    try {
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `${API_BASE}/halls/${id}` : `${API_BASE}/halls`;
      const res = await fetch(url, {
        method, 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          hall_no, block_name, floor: Number(floor), 
          capacity: Number(capacity), rows: Number(rows), 
          seats_per_row: Number(seats_per_row) 
        })
      });

      if (res.ok) {
        showToast(`Room ${hall_no} successfully saved.`, 'success');
        loadHalls();
        closeModal();
      } else {
        const err = await res.json();
        showToast(err.error || 'Request unsuccessful.', 'error');
      }
    } catch (err) {
      showToast('Network latency issues.', 'error');
    }
  };

  const deleteHall = async (id: string, hall_no: string) => {
    if (!confirm(`Warning: This will permanently remove Hall - ${hall_no}. Proceed?`)) return;
    try {
      const res = await fetch(`${API_BASE}/halls/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Room decommissioned.', 'warning');
        loadHalls();
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
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Infra & Hall Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Control center for campus exam rooms, seating configurations, and capacity planning.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Examination Hall</button>
      </div>

      {/* Summary Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        <div className="card" style={{ padding: 20, borderLeft: '4px solid var(--primary)' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inventory Count</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800 }}>{halls.length}</h2>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Active Rooms</span>
          </div>
        </div>
        <div className="card" style={{ padding: 20, borderLeft: '4px solid var(--accent)' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Capacity</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800 }}>{totalCapacity}</h2>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Available Seats</span>
          </div>
        </div>
        <div className="card" style={{ padding: 20, borderLeft: '4px solid var(--secondary)' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Floor Coverage</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800 }}>{Math.max(0, ...halls.map(h => h.floor))}</h2>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Highest Floor Elevation</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Resource ID</th>
                <th>Academic Block</th>
                <th>Level / Floor</th>
                <th>Seating Capacity</th>
                <th>Matrix Config</th>
                <th style={{ textAlign: 'right' }}>Management</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Retrieving architectural assets...</td></tr>
              ) : halls.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No examination halls detected in the current scope.</td></tr>
              ) : (
                halls.map((h) => (
                  <tr key={h.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, background: 'var(--secondary-light)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <School size={16} color="var(--primary)" />
                        </div>
                        <strong style={{ fontSize: 14 }}>{h.hall_no}</strong>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: 'var(--text-main)' }}>
                        <Building2 size={14} color="var(--text-muted)" /> Block {h.block_name}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13 }}>
                        <Layers size={14} /> Level {h.floor}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="badge badge-primary">{h.capacity} SEATS</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-light)', fontWeight: 600 }}>
                        <LayoutGrid size={13} /> {h.rows || 5} × {h.seats_per_row || 8} Layout
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                        <button onClick={() => openEdit(h)} className="action-btn-erp edit"><Edit3 size={15} /></button>
                        <button onClick={() => deleteHall(h.id, h.hall_no)} className="action-btn-erp delete"><Trash2 size={15} /></button>
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
          <div className="modal-content" style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12 }}>
                  <School size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>{modal.isEdit ? 'Update Asset' : 'New Hall Entry'}</h3>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Infra Catalog #102</p>
                </div>
              </div>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Hall Identifier / Name</label>
                <input 
                  type="text" className="form-control" placeholder="e.g. H-102 or AUDITORIUM" 
                  value={modal.hall_no} onChange={e => setModal(m => ({ ...m, hall_no: e.target.value }))}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Academic Block</label>
                  <select 
                    className="form-control" 
                    value={modal.block_name} onChange={e => setModal(m => ({ ...m, block_name: e.target.value }))}
                  >
                    <option value="">Select Block</option>
                    {BLOCKS.map(b => <option key={b} value={b}>{b} Block</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Floor Number</label>
                  <input 
                    type="number" className="form-control" placeholder="0-10" 
                    value={modal.floor} onChange={e => setModal(m => ({ ...m, floor: e.target.value }))}
                  />
                </div>
              </div>

              <div style={{ background: 'var(--secondary-light)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)', marginTop: 8 }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase' }}>Configuration Matrix</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: 10 }}>Total Seats</label>
                    <input 
                      type="number" className="form-control" value={modal.capacity} 
                      onChange={e => setModal(m => ({ ...m, capacity: e.target.value }))}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: 10 }}>Grid Rows</label>
                    <input 
                      type="number" className="form-control" value={modal.rows} 
                      onChange={e => setModal(m => ({ ...m, rows: e.target.value }))}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: 10 }}>Seats/Row</label>
                    <input 
                      type="number" className="form-control" value={modal.seats_per_row} 
                      onChange={e => setModal(m => ({ ...m, seats_per_row: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Discard</button>
              <button className="btn btn-primary" onClick={saveHall}>Commit Resource</button>
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

export default Halls;
