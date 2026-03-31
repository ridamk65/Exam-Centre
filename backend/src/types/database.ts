// ─────────────────────────────────────────────────────────────
//  Exam Seating System — Database TypeScript Types
//  These mirror the Prisma schema and are used throughout the app
// ─────────────────────────────────────────────────────────────

export type UserRole = "ADMIN" | "STAFF";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // always hashed, never expose in API responses
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  branch: string;
  semester: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Hall {
  id: string;
  hallName: string;
  block: string;
  floor: number;
  totalSeats: number;
  rows: number;
  columns: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExamSchedule {
  id: string;
  subjectCode: string;
  subjectName: string;
  examDate: Date;
  startTime: string;
  endTime: string;
  semester: number;
  branch: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Allocation {
  id: string;
  studentId: string;
  hallId: string;
  examScheduleId: string;
  seatNumber: number;
  rowNumber: number;
  columnNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────────────────────
//  Relation-Enriched Types (for API responses / join queries)
// ─────────────────────────────────────────────────────────────

export interface AllocationWithDetails extends Allocation {
  student: Student;
  hall: Hall;
  examSchedule: ExamSchedule;
}

export interface StudentWithAllocations extends Student {
  allocations: AllocationWithDetails[];
}

export interface HallWithAllocations extends Hall {
  allocations: AllocationWithDetails[];
}

// ─────────────────────────────────────────────────────────────
//  DTO / Input Types (for creating/updating records)
// ─────────────────────────────────────────────────────────────

export type CreateStudentInput = Omit<Student, "id" | "createdAt" | "updatedAt">;
export type CreateHallInput = Omit<Hall, "id" | "createdAt" | "updatedAt">;
export type CreateExamScheduleInput = Omit<ExamSchedule, "id" | "createdAt" | "updatedAt">;
export type CreateAllocationInput = Omit<Allocation, "id" | "createdAt" | "updatedAt">;
