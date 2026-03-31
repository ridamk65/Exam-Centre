// ──────────────────────────────────────────────
//  EXAM SEATING SYSTEM – Shared Utilities (TypeScript)
//  Sathyabama Institute of Science & Technology
// ──────────────────────────────────────────────

/* ── Types ────────────────────────────────────── */
export interface Student {
  id?: string;
  reg_no: string;
  name: string;
  dept: string;
  year: number;
  semester?: number;
  phone?: string;
}

export interface Hall {
  id?: string;
  hall_no: string;
  block_name: string;
  floor: number;
  capacity: number;
  rows?: number;
  seats_per_row?: number;
}

export interface ExamSchedule {
  id?: string;
  exam_date: string;
  dept: string;
  year: number;
  subject: string;
}

export interface AllocatedStudent extends Student {
  seat_no: number;
  group: string;
  subject: string;
}

export interface AllocatedHall {
  hall_no: string;
  block: string;
  floor: number;
  capacity: number;
  allocated: number;
  students: AllocatedStudent[];
}

export interface Allocation {
  id: number;
  exam_date: string;
  generated_at: string;
  total_students: number;
  halls_used: number;
  departments: string;
  halls: AllocatedHall[];
}

/* ── Data Store ──────────────────────────────── */
export function getData<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]') || [];
  } catch {
    return [];
  }
}

export function setData<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

/* ── Seed default data ───────────────────────── */
export function seedData(): void {
  if (getData<number>('seeded').length) return;

  const students: Student[] = [
    { reg_no: '43601001', name: 'ARUN KUMAR R',    dept: 'CSE',  year: 1 },
    { reg_no: '43601002', name: 'BHAVANI S',        dept: 'CSE',  year: 1 },
    { reg_no: '43601003', name: 'CHAKRAVARTHI M',   dept: 'CSE',  year: 1 },
    { reg_no: '43601004', name: 'DEEPIKA N',         dept: 'CSE',  year: 1 },
    { reg_no: '43601005', name: 'ELAVARASAN K',      dept: 'CSE',  year: 1 },
    { reg_no: '43601006', name: 'FAMITHA A',         dept: 'CSE',  year: 1 },
    { reg_no: '43602001', name: 'GANESH P',          dept: 'ECE',  year: 2 },
    { reg_no: '43602002', name: 'HARINI V',          dept: 'ECE',  year: 2 },
    { reg_no: '43602003', name: 'ISWARYA M',         dept: 'ECE',  year: 2 },
    { reg_no: '43602004', name: 'JAYANTHI K',        dept: 'ECE',  year: 2 },
    { reg_no: '43602005', name: 'KARTHIK S',         dept: 'ECE',  year: 2 },
    { reg_no: '43602006', name: 'LAVANYA R',         dept: 'ECE',  year: 2 },
    { reg_no: '43603001', name: 'MOHAN D',           dept: 'MECH', year: 3 },
    { reg_no: '43603002', name: 'NITHYA P',          dept: 'MECH', year: 3 },
    { reg_no: '43603003', name: 'OVIYA S',           dept: 'MECH', year: 3 },
    { reg_no: '43603004', name: 'PRIYA T',           dept: 'MECH', year: 3 },
    { reg_no: '43604001', name: 'RAGHU V',           dept: 'IT',   year: 1 },
    { reg_no: '43604002', name: 'SANGEETHA L',       dept: 'IT',   year: 1 },
    { reg_no: '43604003', name: 'THILAGA M',         dept: 'IT',   year: 1 },
    { reg_no: '43604004', name: 'UDHAYA K',          dept: 'IT',   year: 1 },
    { reg_no: '43605001', name: 'VASANTH R',         dept: 'EEE',  year: 2 },
    { reg_no: '43605002', name: 'WIDYA P',           dept: 'EEE',  year: 2 },
    { reg_no: '43605003', name: 'XAVIER J',          dept: 'EEE',  year: 2 },
    { reg_no: '43605004', name: 'YAMINI K',          dept: 'EEE',  year: 2 },
    { reg_no: '43606001', name: 'ANAND S',           dept: 'CIVIL',year: 3 },
    { reg_no: '43606002', name: 'BALA M',            dept: 'CIVIL',year: 3 },
    { reg_no: '43606003', name: 'CHANDRU N',         dept: 'CIVIL',year: 3 },
    { reg_no: '43606004', name: 'DIVYA T',           dept: 'CIVIL',year: 3 },
    { reg_no: '43613011', name: 'PAVITHRA P',        dept: 'CSE',  year: 3 },
    { reg_no: '43613012', name: 'POOJA R',           dept: 'IT',   year: 2 },
  ];

  const halls: Hall[] = [
    { hall_no: 'H101', block_name: 'A', floor: 1, capacity: 40 },
    { hall_no: 'H102', block_name: 'A', floor: 1, capacity: 40 },
    { hall_no: 'H201', block_name: 'B', floor: 2, capacity: 30 },
    { hall_no: 'H202', block_name: 'B', floor: 2, capacity: 30 },
    { hall_no: 'H301', block_name: 'C', floor: 3, capacity: 50 },
  ];

  const exam_schedule: ExamSchedule[] = [
    { id: "1", exam_date: '2026-03-20', dept: 'CSE',  year: 1, subject: 'Data Structures' },
    { id: "2", exam_date: '2026-03-20', dept: 'IT',   year: 1, subject: 'Programming in C' },
    { id: "3", exam_date: '2026-03-20', dept: 'ECE',  year: 2, subject: 'Digital Electronics' },
    { id: "4", exam_date: '2026-03-20', dept: 'EEE',  year: 2, subject: 'Circuit Theory' },
    { id: "5", exam_date: '2026-03-21', dept: 'MECH', year: 3, subject: 'Thermodynamics' },
    { id: "6", exam_date: '2026-03-21', dept: 'CIVIL',year: 3, subject: 'Structural Analysis' },
    { id: "7", exam_date: '2026-03-21', dept: 'CSE',  year: 3, subject: 'Operating Systems' },
  ];

  setData('students', students);
  setData('halls', halls);
  setData('exam_schedule', exam_schedule);
  setData('allocations', []);
  setData('seeded', [1]);
}

/* ── Badge helpers ───────────────────────────── */
export function deptClass(dept: string): string {
  const map: Record<string, string> = {
    CSE: 'cse', ECE: 'ece', MECH: 'mech', CIVIL: 'civil', IT: 'it', EEE: 'eee', BME: 'bme',
  };
  return map[dept?.toUpperCase()] || 'cse';
}

export function yearClass(y: number): string {
  return ['', 'y1', 'y2', 'y3', 'y4'][y] || 'y1';
}

/* ── Generate ID ─────────────────────────────── */
export function genId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

/* ── Format Date ─────────────────────────────── */
export function fmtDate(d: string): string {
  if (!d) return '—';
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* ── Seating Allocation Engine ───────────────── */
export function generateAllocation(examDate: string): Allocation | { error: string } {
  const schedules = getData<ExamSchedule>('exam_schedule').filter(e => e.exam_date === examDate);
  if (!schedules.length) return { error: 'No exams scheduled for this date.' };

  const students = getData<Student>('students');
  const halls = getData<Hall>('halls');
  if (!halls.length) return { error: 'No halls available. Please add halls first.' };

  // Group students by dept-year
  const groups: Record<string, { dept: string; year: number; subject: string; students: Student[] }> = {};
  schedules.forEach(s => {
    const key = `${s.dept}_${s.year}`;
    if (!groups[key]) groups[key] = { dept: s.dept, year: s.year, subject: s.subject, students: [] };
    const matching = students.filter(st => st.dept === s.dept && st.year === s.year);
    groups[key].students.push(...matching);
  });

  const groupList = Object.values(groups);
  if (groupList.length === 0) return { error: 'No students found for scheduled departments.' };

  // Interleave students from all groups
  let interleaved: (Student & { group: string; subject: string })[] = [];
  const maxLen = Math.max(...groupList.map(g => g.students.length));
  for (let i = 0; i < maxLen; i++) {
    groupList.forEach(g => {
      if (i < g.students.length) {
        interleaved.push({ ...g.students[i], group: `${g.dept} Y${g.year}`, subject: g.subject });
      }
    });
  }

  if (groupList.length === 1) {
    interleaved = groupList[0].students.map(s => ({
      ...s, group: `${groupList[0].dept} Y${groupList[0].year}`, subject: groupList[0].subject,
    }));
  }

  // Allocate to halls
  const allocation: AllocatedHall[] = [];
  let seatIndex = 0;
  let hallIndex = 0;
  const allocationId = genId();

  while (seatIndex < interleaved.length && hallIndex < halls.length) {
    const hall = halls[hallIndex];
    const hallStudents: AllocatedStudent[] = [];
    const maxSeats = hall.capacity;
    let seatNum = 1;

    while (seatIndex < interleaved.length && seatNum <= maxSeats) {
      const st = interleaved[seatIndex];
      hallStudents.push({
        seat_no: seatNum,
        reg_no: st.reg_no,
        name: st.name,
        dept: st.dept,
        year: st.year,
        group: st.group,
        subject: st.subject,
      });
      seatIndex++;
      seatNum++;
    }

    if (hallStudents.length > 0) {
      allocation.push({
        hall_no: hall.hall_no,
        block: hall.block_name,
        floor: hall.floor,
        capacity: hall.capacity,
        allocated: hallStudents.length,
        students: hallStudents,
      });
    }
    hallIndex++;
  }

  const result: Allocation = {
    id: allocationId,
    exam_date: examDate,
    generated_at: new Date().toISOString(),
    total_students: interleaved.length,
    halls_used: allocation.length,
    departments: schedules.map(s => `${s.dept} Y${s.year}`).join(', '),
    halls: allocation,
  };

  const allocs = getData<Allocation>('allocations');
  const filtered = allocs.filter(a => a.exam_date !== examDate);
  filtered.push(result);
  setData('allocations', filtered);

  return result;
}

/* ── Toast hook helper (returns show function) ── */
export type ToastType = 'success' | 'error' | 'info' | 'warning';
