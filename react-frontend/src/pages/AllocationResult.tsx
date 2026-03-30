import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useToast } from '../components/Toast';
import { getData, seedData, fmtDate, type Allocation } from '../utils/data';

// Declare jsPDF globals loaded from CDN
declare global {
  interface Window {
    jspdf: {
      jsPDF: new (opts?: Record<string, unknown>) => jsPDFInstance;
    };
  }
}
interface jsPDFInstance {
  internal: {
    pageSize: { getWidth: () => number };
    getNumberOfPages: () => number;
  };
  lastAutoTable: { finalY: number };
  setFillColor: (r: number, g: number, b: number) => void;
  setTextColor: (r: number, g: number, b: number) => void;
  setFontSize: (size: number) => void;
  setFont: (name: string, style: string) => void;
  setDrawColor: (r: number, g: number, b: number) => void;
  setLineWidth: (w: number) => void;
  rect: (x: number, y: number, w: number, h: number, style: string) => void;
  line: (x1: number, y1: number, x2: number, y2: number) => void;
  text: (text: string, x: number, y: number, opts?: Record<string, unknown>) => void;
  addPage: () => void;
  setPage: (page: number) => void;
  autoTable: (opts: Record<string, unknown>) => void;
  save: (name: string) => void;
}

const AllocationResult = () => {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [current, setCurrent] = useState<Allocation | null>(null);
  const { showToast, ToastContainer } = useToast();
  const jspdfLoaded = useRef(false);

  useEffect(() => {
    seedData();
    const allocs = getData<Allocation>('allocations').sort((a, b) => a.exam_date.localeCompare(b.exam_date));
    setAllocations(allocs);
    if (allocs.length) {
      const lastDate = allocs[allocs.length - 1].exam_date;
      setSelectedDate(lastDate);
      setCurrent(allocs.find(a => a.exam_date === lastDate) || null);
    }

    // Load jsPDF dynamically if not already loaded
    if (!jspdfLoaded.current && !window.jspdf) {
      const s1 = document.createElement('script');
      s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      s1.onload = () => {
        const s2 = document.createElement('script');
        s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.6.0/jspdf.plugin.autotable.min.js';
        document.head.appendChild(s2);
      };
      document.head.appendChild(s1);
      jspdfLoaded.current = true;
    }
  }, []);

  const onDateChange = (date: string) => {
    setSelectedDate(date);
    setCurrent(date ? (allocations.find(a => a.exam_date === date) || null) : null);
  };

  const downloadPDF = () => {
    if (!current) { showToast('No allocation loaded.', 'error'); return; }
    if (!window.jspdf) { showToast('PDF library still loading, please wait…', 'info'); return; }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const a = current;
    const pageW = doc.internal.pageSize.getWidth();
    let y = 14;

    doc.setFillColor(131, 18, 56);
    doc.rect(0, 0, pageW, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13); doc.setFont('helvetica', 'bold');
    doc.text('SATHYABAMA INSTITUTE OF SCIENCE AND TECHNOLOGY', pageW / 2, 8, { align: 'center' });
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.text('Deemed to be University – Examination Branch', pageW / 2, 13, { align: 'center' });
    doc.text('EXAM SEATING ALLOCATION', pageW / 2, 18, { align: 'center' });

    y = 28;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    doc.text(`Date: ${fmtDate(a.exam_date)}   |   Departments: ${a.departments}`, 14, y);
    y += 6;
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.text(`Total Students: ${a.total_students}   |   Halls Used: ${a.halls_used}   |   Generated: ${new Date(a.generated_at).toLocaleString('en-IN')}`, 14, y);
    y += 4;
    doc.setDrawColor(131, 18, 56); doc.setLineWidth(0.5);
    doc.line(14, y, pageW - 14, y);
    y += 6;

    a.halls.forEach(hall => {
      if (y > 240) { doc.addPage(); y = 14; }
      doc.setFillColor(131, 18, 56);
      doc.rect(14, y, pageW - 28, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10); doc.setFont('helvetica', 'bold');
      doc.text(`Hall: ${hall.hall_no}   Block: ${hall.block}   Floor: ${hall.floor}   Seats Used: ${hall.allocated}/${hall.capacity}`, 16, y + 5.5);
      y += 10;
      doc.setTextColor(0, 0, 0);

      const rows = hall.students.map(s => [s.seat_no, s.reg_no, s.name, s.dept, `Year ${s.year}`, s.subject || '—']);
      doc.autoTable({
        startY: y,
        head: [['Seat No', 'Reg. Number', 'Student Name', 'Dept', 'Year', 'Subject']],
        body: rows,
        margin: { left: 14, right: 14 },
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [58, 159, 168], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        theme: 'striped',
      });
      y = doc.lastAutoTable.finalY + 8;
    });

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8); doc.setTextColor(120, 120, 120);
      doc.text(`Page ${i} of ${totalPages}  |  Exam Seating Allocation System – Sathyabama University`, pageW / 2, 290, { align: 'center' });
    }

    doc.save(`Seating_Allocation_${a.exam_date}.pdf`);
    showToast('PDF downloaded successfully! 📥', 'success');
  };

  return (
    <Layout>
      <ToastContainer />

      <div className="page-title-box">
        <h1 className="page-title">View Seating Allocation & Download PDF</h1>
        <p className="page-subtitle">Hall-wise seating arrangement · Download PDF to share with students</p>
      </div>

      {/* Date Selector */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">🗓️ Select Allocation to View</div>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ flex: '0 0 220px' }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 5 }}>Exam Date</label>
              <select value={selectedDate} onChange={e => onDateChange(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccc', borderRadius: 4, fontSize: 13 }}>
                <option value="">— Select date —</option>
                {allocations.map(a => (
                  <option key={a.exam_date} value={a.exam_date}>{fmtDate(a.exam_date)} ({a.total_students} students)</option>
                ))}
              </select>
            </div>
            <button className="btn btn-maroon" onClick={downloadPDF} disabled={!current}
              style={{ height: 36, padding: '0 18px', opacity: current ? 1 : 0.5 }}>
              📥 Download PDF
            </button>
            <Link to="/allocation" className="btn" style={{ height: 36, padding: '0 16px', background: '#e8a44a', color: '#fff' }}>
              ⚙️ Regenerate
            </Link>
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: '#888' }}>
            {allocations.length} saved allocation(s) &nbsp;·&nbsp; Selected: <strong>{selectedDate ? fmtDate(selectedDate) : '—'}</strong>
          </div>
        </div>
      </div>

      {/* Allocation Display */}
      {!current && selectedDate && (
        <div style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>📋 No allocation found for this date.</div>
      )}
      {!current && !selectedDate && allocations.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#999' }}>No Allocations Generated Yet</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Go to <Link to="/allocation" style={{ color: 'var(--maroon)' }}>Generate Allocation</Link> first.</div>
        </div>
      )}

      {current && (
        <>
          {/* Summary */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header" style={{ background: 'linear-gradient(135deg,#4cae9e,#2c8089)' }}>
              📋 Allocation Summary – {fmtDate(current.exam_date)}
              <div style={{ fontSize: 11.5, opacity: 0.85 }}>Generated: {new Date(current.generated_at).toLocaleString('en-IN')}</div>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                {[
                  { label: 'Total Students', value: current.total_students, color: 'var(--maroon)', bg: 'var(--maroon-light)' },
                  { label: 'Halls Used',     value: current.halls_used,     color: 'var(--teal)',   bg: 'var(--teal-light)' },
                  { label: 'Departments',    value: current.departments,    color: '#227700',       bg: '#e8ffe0' },
                  { label: 'Exam Date',      value: fmtDate(current.exam_date), color: '#c47d20', bg: '#fff5e0' },
                ].map(s => (
                  <div key={s.label} style={{ background: s.bg, borderRadius: 8, padding: 14, textAlign: 'center', border: `1px solid ${s.color}15` }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hall-wise cards */}
          {current.halls.map(hall => (
            <div key={hall.hall_no} style={{ marginBottom: 16, border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ background: '#831238', color: '#fff', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>🏛️ Hall {hall.hall_no} – Block {hall.block}, Floor {hall.floor}</h3>
                <div style={{ fontSize: 12, opacity: 0.85 }}>{hall.allocated}/{hall.capacity} seats occupied</div>
              </div>
              <div style={{ padding: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))', gap: 8 }}>
                {hall.students.map(s => (
                  <div key={s.seat_no} style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: 6, padding: '8px 10px', fontSize: 12 }}>
                    <div style={{ fontWeight: 700, color: '#831238', marginBottom: 2 }}>Seat {s.seat_no}</div>
                    <div style={{ fontWeight: 600, color: '#333' }}>{s.reg_no}</div>
                    <div style={{ color: '#555' }}>{s.name}</div>
                    <div style={{ marginTop: 3 }}><span className="badge-dept" style={{ fontSize: 10, background: '#e0f5f7', color: '#2c8089', padding: '1px 6px', borderRadius: 8, fontWeight: 700 }}>{s.dept} Y{s.year}</span></div>
                    {s.subject && <div style={{ fontSize: 10.5, color: '#888', marginTop: 2 }}>{s.subject}</div>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </Layout>
  );
};

export default AllocationResult;
