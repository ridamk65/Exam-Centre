import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useToast } from '../components/Toast';
import { type Hall } from '../utils/data';

const API_BASE = 'http://localhost:3000/api';

interface ModalState {
  open: boolean;
  isEdit: boolean;
  id?: string;
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
  const [modal, setModal] = useState<ModalState>({
    open: false, isEdit: false, id: '', hall_no: '', block_name: '', floor: '', capacity: '', rows: '5', seats_per_row: '8'
  });
  const { showToast, ToastContainer } = useToast();

  useEffect(() => { loadHalls(); }, []);

  const loadHalls = async () => {
    try {
      const res = await fetch(`${API_BASE}/halls`);
      if (res.ok) {
        const data = await res.json();
        setHalls(data);
      }
    } catch (err) {
      showToast('Error loading halls.', 'error');
    }
  };

  const totalCapacity = halls.reduce((a, h) => a + Number(h.capacity), 0);

  const openAdd = () => setModal({ open: true, isEdit: false, id: '', hall_no: '', block_name: '', floor: '', capacity: '', rows: '5', seats_per_row: '8' });
  const openEdit = (h: Hall) => setModal({ 
    open: true, isEdit: true, id: h.id, hall_no: h.hall_no, block_name: h.block_name, 
    floor: String(h.floor), capacity: String(h.capacity), 
    rows: String(h.rows || 5), seats_per_row: String(h.seats_per_row || 8) 
  });
  const closeModal = () => setModal(m => ({ ...m, open: false }));

  const saveHall = async () => {
    const hall_no = modal.hall_no.trim().toUpperCase();
    const { block_name, id, isEdit } = modal;
    const floor = parseInt(modal.floor);
    const capacity = parseInt(modal.capacity);
    const rows = parseInt(modal.rows);
    const seats_per_row = parseInt(modal.seats_per_row);

    if (!hall_no || !block_name || isNaN(floor) || isNaN(capacity) || capacity < 1) {
      showToast('Please fill all required fields correctly.', 'error'); return;
    }

    try {
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `${API_BASE}/halls/${id}` : `${API_BASE}/halls`;
      const payload = { hall_no, block_name, floor, capacity, rows, seats_per_row };

      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || 'Failed to save hall.', 'error');
        return;
      }

      showToast(`Hall ${hall_no} ${isEdit ? 'updated' : 'added'}!`, 'success');
      loadHalls();
      closeModal();
    } catch (err) {
      showToast('API error.', 'error');
    }
  };

  const deleteHall = async (id: string | undefined, hall_no: string) => {
    if (!id || !confirm(`Delete hall ${hall_no}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/halls/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Hall deleted.', 'warning');
        loadHalls();
      }
    } catch (err) {
      showToast('Error deleting hall.', 'error');
    }
  };

  return (
    <Layout>
      <ToastContainer />

      <div className="page-title-box">
        <h1 className="page-title">Hall Management</h1>
        <p className="page-subtitle">Manage exam halls, blocks, floors, and seating capacity</p>
      </div>

      <div className="card">
        <div className="card-header">
          🏛️ Exam Halls
          <button className="btn btn-sm" onClick={openAdd}
            style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
            ➕ Add Hall
          </button>
        </div>

        <div className="card-body">
          <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 12, color: '#555' }}>
            <span>Total Halls: <strong>{halls.length}</strong></span>
            <span>Total Capacity: <strong>{totalCapacity} seats</strong></span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['#', 'Hall Number', 'Block', 'Floor', 'Capacity', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 14px', background: '#f8f9fa', color: '#666', fontSize: 12, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {halls.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 30, color: '#aaa' }}>No halls added yet.</td></tr>
                ) : (
                  halls.map((h, i) => (
                    <tr key={h.hall_no} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px 14px', fontSize: 13 }}>{i + 1}</td>
                      <td style={{ padding: '10px 14px', fontSize: 13 }}><strong>{h.hall_no}</strong></td>
                      <td style={{ padding: '10px 14px', fontSize: 13 }}>
                        <span style={{ background: '#e0f5f7', color: '#2c8089', padding: '2px 8px', borderRadius: 10, fontWeight: 600, fontSize: 11 }}>Block {h.block_name}</span>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 13 }}>Floor {h.floor}</td>
                      <td style={{ padding: '10px 14px', fontSize: 13 }}>
                        <span style={{ background: '#e8ffe0', color: '#227700', padding: '2px 8px', borderRadius: 10, fontWeight: 600, fontSize: 11 }}>{h.capacity} seats</span>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 13 }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn-edit" onClick={() => openEdit(h)}>✏️ Edit</button>
                          <button className="btn-delete" onClick={() => deleteHall(h.id, h.hall_no)}>🗑️ Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: '#888' }}>{halls.length} hall(s) registered</div>
        </div>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="modal-overlay active" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal">
            <div className="modal-header">
              <span>{modal.isEdit ? '✏️ Edit Hall' : '➕ Add Hall'}</span>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Hall Number *</label>
                  <input type="text" placeholder="e.g. H101" value={modal.hall_no}
                    disabled={modal.isEdit}
                    onChange={e => setModal(m => ({ ...m, hall_no: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Block *</label>
                  <select value={modal.block_name} onChange={e => setModal(m => ({ ...m, block_name: e.target.value }))}>
                    <option value="">Select Block</option>
                    {BLOCKS.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Floor *</label>
                  <input type="number" placeholder="e.g. 1" min={0} max={10} value={modal.floor}
                    onChange={e => setModal(m => ({ ...m, floor: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Capacity *</label>
                  <input type="number" placeholder="e.g. 40" min={1} max={200} value={modal.capacity}
                    onChange={e => setModal(m => ({ ...m, capacity: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Rows</label>
                  <input type="number" min={1} max={50} value={modal.rows}
                    onChange={e => setModal(m => ({ ...m, rows: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Seats per row</label>
                  <input type="number" min={1} max={20} value={modal.seats_per_row}
                    onChange={e => setModal(m => ({ ...m, seats_per_row: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-grey" onClick={closeModal}>Cancel</button>
              <button className="btn btn-maroon" onClick={saveHall}>💾 Save Hall</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Halls;
