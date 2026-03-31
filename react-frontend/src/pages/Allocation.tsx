import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useToast } from '../components/Toast';
import {
  getData, seedData, fmtDate, deptClass,
  type ExamSchedule, type Allocation,
} from '../utils/data';

const API_BASE = 'http://localhost:3000/api';

const AllocationPage = () => {
  const [examDate, setExamDate] = useState('');
  const [dateSchedules, setDateSchedules] = useState<ExamSchedule[]>([]);
  const [result, setResult] = useState<Allocation | null>(null);
  const [generating, setGenerating] = useState(false);
  const [counts, setCounts] = useState({ students: 0, halls: 0, schedules: 0 });
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    seedData();
    const students = getData<unknown[]>('students').length;
    const halls = getData<unknown[]>('halls').length;
    const schedules = getData<unknown[]>('exam_schedule').length;
    setCounts({ students, halls, schedules });

    // Pre-select first available date
    const allSchedules = getData<ExamSchedule>('exam_schedule');
    const dates = [...new Set(allSchedules.map(s => s.exam_date))].sort();
    if (dates.length) {
      setExamDate(dates[0]);
      setDateSchedules(allSchedules.filter(s => s.exam_date === dates[0]));
    }
  }, []);

  const onDateChange = async (date: string) => {
    setExamDate(date);
    const allSchedules = getData<ExamSchedule>('exam_schedule');
    setDateSchedules(date ? allSchedules.filter(s => s.exam_date === date) : []);
    setResult(null);

    // Fetch existing allocation from backend
    if (date) {
      try {
        const res = await fetch(`${API_BASE}/allocations?date=${date}`);
        if (res.ok) {
          const data = await res.json();
          setResult(data);
        }
      } catch (err) { }
    }
  };

  const generate = async () => {
    if (!examDate) { showToast('Please select an exam date.', 'error'); return; }
    setGenerating(true);
    
    try {
      const res = await fetch(`${API_BASE}/allocations/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examDate })
      });
      
      const payload = await res.json();
      setGenerating(false);

      if (!res.ok) {
        showToast(payload.error || 'Failed to generate allocation', 'error');
        return;
      }
      
      showToast(`✅ Allocation generated! ${payload.total_students} students in ${payload.halls_used} hall(s).`, 'success');
      setResult(payload);
    } catch (err) {
      setGenerating(false);
      showToast('Network error while generating.', 'error');
    }
  };

  const maxPerHall = result ? result.halls.reduce((a, h) => Math.max(a, h.allocated), 0) : 0;

  return (
    <Layout>
      <ToastContainer />

      <div className="page-title-box">
        <h1 className="page-title">Generate Seating Allocation</h1>
        <p className="page-subtitle">Select exam date · System automatically pairs students from different departments alternately</p>
      </div>

      {/* Stats Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Total Students', value: counts.students, color: 'var(--maroon)', bg: 'var(--maroon-light)' },
          { label: 'Total Halls', value: counts.halls, color: 'var(--teal)', bg: 'var(--teal-light)' },
          { label: 'Schedules', value: counts.schedules, color: '#8B6914', bg: '#fff8e0' },
        ].map(c => (
          <div key={c.label} className="card" style={{ padding: '16px 20px', borderLeft: `4px solid ${c.color}`, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Date Selector */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">📅 Select Exam Date</div>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: '0 0 220px' }}>
              <label>Exam Date *</label>
              <input type="date" value={examDate} onChange={e => onDateChange(e.target.value)} />
            </div>
            <button className="btn btn-maroon" onClick={generate} disabled={generating}
              style={{ height: 36, padding: '0 20px' }}>
              {generating ? '⏳ Generating…' : '⚙️ Generate Seating'}
            </button>
          </div>

          {examDate && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontWeight: 600, color: '#555', marginBottom: 8, fontSize: 12 }}>📋 Exams scheduled for this date:</div>
              {dateSchedules.length === 0 ? (
                <div style={{ color: '#c0392b', fontSize: 12 }}>⚠️ No exams scheduled for this date. Please add exam schedules first.</div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {dateSchedules.map(s => (
                    <div key={s.id} style={{ background: '#fce8ef', borderRadius: 4, padding: '6px 12px', fontSize: 12, border: '1px solid #d8a8b8' }}>
                      <strong style={{ color: '#831238' }}>{s.dept} – Year {s.year}</strong><br />
                      <span style={{ color: '#555' }}>{s.subject}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">📖 Allocation Algorithm</div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {[
              { title: 'Step 1: Identify Groups', bg: '#fce8ef', border: '#831238', desc: 'System identifies all dept-year groups with exams on the selected date' },
              { title: 'Step 2: Interleave Students', bg: '#e0f5f7', border: '#3a9fa8', desc: 'Students from different groups are alternated: CSE→ECE→CSE→ECE (row by row)' },
              { title: 'Step 3: Fill Halls', bg: '#e8ffe0', border: '#4cae9e', desc: 'Halls filled sequentially by capacity until all students are seated' },
            ].map(step => (
              <div key={step.title} style={{ background: step.bg, borderRadius: 6, padding: 14, borderLeft: `4px solid ${step.border}` }}>
                <div style={{ fontWeight: 700, color: step.border, marginBottom: 6 }}>{step.title}</div>
                <div style={{ fontSize: 12, color: '#555' }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Result Preview */}
      {result && (
        <div className="card">
          <div className="card-header" style={{ background: 'linear-gradient(135deg,#4cae9e,#2c8089)' }}>
            ✅ Allocation Generated Successfully
          </div>
          <div className="card-body">
            {/* Summary stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Students Seated', value: result.total_students, color: '#831238', bg: '#fce8ef' },
                { label: 'Halls Used', value: result.halls_used, color: '#3a9fa8', bg: '#e0f5f7' },
                { label: 'Max per Hall', value: maxPerHall, color: '#227700', bg: '#e8ffe0' },
                { label: 'Exam Date', value: fmtDate(result.exam_date), color: '#c47d20', bg: '#fff5e0' },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: 6, padding: 12, textAlign: 'center', borderLeft: `3px solid ${s.color}` }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Hall preview */}
            {result.halls.map(hall => (
              <div key={hall.hall_no} style={{ marginBottom: 12 }}>
                <div style={{ background: '#831238', color: '#fff', padding: '8px 12px', borderRadius: '4px 4px 0 0', fontWeight: 700, fontSize: 13, display: 'flex', justifyContent: 'space-between' }}>
                  <span>🏛️ Hall {hall.hall_no} – Block {hall.block}, Floor {hall.floor}</span>
                  <span style={{ fontSize: 12, opacity: 0.85 }}>{hall.allocated} students</span>
                </div>
                <div style={{ border: '1px solid #ddd', borderTop: 'none', borderRadius: '0 0 4px 4px', padding: 8 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 6 }}>
                    {hall.students.slice(0, 6).map(s => (
                      <div key={s.seat_no} style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: 4, padding: '6px 8px', fontSize: 11.5 }}>
                        <span style={{ fontWeight: 700, color: '#831238' }}>Seat {s.seat_no}</span>
                        <span style={{ marginLeft: 6, fontWeight: 600 }}>{s.reg_no}</span><br />
                        <span style={{ color: '#555' }}>{s.name}</span><br />
                        <span className={`badge-dept ${deptClass(s.dept)}`} style={{ fontSize: 10 }}>{s.dept} Y{s.year}</span>
                      </div>
                    ))}
                    {hall.students.length > 6 && (
                      <div style={{ padding: '6px 8px', fontSize: 12, color: '#888', display: 'flex', alignItems: 'center' }}>
                        +{hall.students.length - 6} more students…
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AllocationPage;
