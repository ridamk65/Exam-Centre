import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useToast } from '../components/Toast';
import { getData, setData, seedData, type Hall } from '../utils/data';

interface ModalState {
  open: boolean;
  isEdit: boolean;
  hall_no: string;
  block: string;
  floor: string;
  capacity: string;
}

const BLOCKS = ['A', 'B', 'C', 'D', 'E'];

const Halls = () => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [modal, setModal] = useState<ModalState>({
    open: false, isEdit: false, hall_no: '', block: '', floor: '', capacity: '',
  });
  const { showToast, ToastContainer } = useToast();

  useEffect(() => { seedData(); loadHalls(); }, []);

  const loadHalls = () => setHalls(getData<Hall>('halls'));

  const totalCapacity = halls.reduce((a, h) => a + Number(h.capacity), 0);

  const openAdd = () => setModal({ open: true, isEdit: false, hall_no: '', block: '', floor: '', capacity: '' });
  const openEdit = (h: Hall) => setModal({ open: true, isEdit: true, hall_no: h.hall_no, block: h.block, floor: String(h.floor), capacity: String(h.capacity) });
  const closeModal = () => setModal(m => ({ ...m, open: false }));

  const saveHall = () => {
    const hall_no = modal.hall_no.trim().toUpperCase();
    const { block } = modal;
    const floor = parseInt(modal.floor);
    const capacity = parseInt(modal.capacity);
    if (!hall_no || !block || isNaN(floor) || isNaN(capacity) || capacity < 1) {
      showToast('Please fill all fields correctly.', 'error'); return;
    }

    const list = getData<Hall>('halls');
    if (!modal.isEdit) {
      if (list.find(h => h.hall_no === hall_no)) { showToast('Hall number already exists!', 'error'); return; }
      list.push({ hall_no, block, floor, capacity });
      showToast(`Hall ${hall_no} added!`, 'success');
    } else {
      const idx = list.findIndex(h => h.hall_no === hall_no);
      if (idx !== -1) list[idx] = { hall_no, block, floor, capacity };
      showToast(`Hall ${hall_no} updated!`, 'success');
    }
    setData('halls', list);
    loadHalls();
    closeModal();
  };

  const deleteHall = (hall_no: string) => {
    if (!confirm(`Delete hall ${hall_no}?`)) return;
    setData('halls', getData<Hall>('halls').filter(h => h.hall_no !== hall_no));
    showToast('Hall deleted.', 'warning');
    loadHalls();
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
                        <span style={{ background: '#e0f5f7', color: '#2c8089', padding: '2px 8px', borderRadius: 10, fontWeight: 600, fontSize: 11 }}>Block {h.block}</span>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 13 }}>Floor {h.floor}</td>
                      <td style={{ padding: '10px 14px', fontSize: 13 }}>
                        <span style={{ background: '#e8ffe0', color: '#227700', padding: '2px 8px', borderRadius: 10, fontWeight: 600, fontSize: 11 }}>{h.capacity} seats</span>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 13 }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn-edit" onClick={() => openEdit(h)}>✏️ Edit</button>
                          <button className="btn-delete" onClick={() => deleteHall(h.hall_no)}>🗑️ Delete</button>
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
                  <select value={modal.block} onChange={e => setModal(m => ({ ...m, block: e.target.value }))}>
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
