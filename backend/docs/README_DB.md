# 📦 Exam Seating System — Database Documentation

> **Person 1 Deliverable** — Database Schema, Migrations, Seed Data & ER Diagram

---

## 🗂️ File Structure

```
prisma/
├── schema.prisma          # Database schema (all tables & relations)
├── migrations/            # Auto-generated migration SQL files
└── seed.ts                # Dummy data seeder

src/
├── lib/
│   └── prisma.ts          # Singleton Prisma client (hot-reload safe)
└── types/
    └── database.ts        # TypeScript types for all DB models

docs/
└── er-diagram.png         # Entity-Relationship diagram

.env                       # Environment variables (DATABASE_URL etc.)
```

---

## 🗃️ Database: Supabase (PostgreSQL)

This project uses **[Supabase](https://supabase.com)** as the hosted PostgreSQL database provider, accessed through **Prisma ORM**.

### Tables

| Table            | Description                                              |
|------------------|----------------------------------------------------------|
| `users`          | Admin/staff accounts managing the system                 |
| `students`       | Student records (roll number, branch, semester, etc.)    |
| `halls`          | Exam hall details (capacity, rows, columns, block/floor) |
| `exam_schedules` | Exam timetable (subject, date, time, branch, semester)   |
| `allocations`    | Seat assignments linking Student ↔ Hall ↔ ExamSchedule   |

---

## 🔗 Relationships

```
Student      (1) ───── (M)   Allocation
Hall         (1) ───── (M)   Allocation
ExamSchedule (1) ───── (M)   Allocation
```

- A **Student** can have many **Allocations** (one per exam)
- A **Hall** hosts many **Allocations** (one per seat per exam)
- An **ExamSchedule** has many **Allocations** (one per student)
- **Unique constraints** prevent double-booking:
  - One student → one seat per exam (`studentId + examScheduleId`)
  - One seat → one student per exam (`hallId + examScheduleId + seatNumber`)

---

## 🖼️ ER Diagram

![Exam Seating System ER Diagram](./er-diagram.png)

---

## ⚙️ Setup Instructions

### 1. Configure Environment Variables

Copy the `.env` file and fill in your actual Supabase credentials:

```bash
# From Supabase Dashboard → Settings → Database → Connection string
DATABASE_URL="postgresql://postgres.[ref]:[password]@pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@pooler.supabase.com:5432/postgres"
```

### 2. Run Database Migration

```bash
npx prisma migrate dev --name init
```

This creates all tables in your Supabase database.

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Seed Dummy Data

```bash
npx prisma db seed
```

Seeds: 1 admin user, 5 halls, 20 students, 4 exam schedules, and allocations.

### 5. View Data (Prisma Studio)

```bash
npx prisma studio
```

Opens a browser-based GUI to browse your database at `http://localhost:5555`.

---

## 🔌 Using Prisma in the App

```typescript
import { prisma } from "@/lib/prisma";

// Example: Get all students
const students = await prisma.student.findMany();

// Example: Get allocations with details
const allocations = await prisma.allocation.findMany({
  include: { student: true, hall: true, examSchedule: true }
});
```

---

## 🤝 How This Connects to Other Team Members

| Person | Role         | Depends On                                |
|--------|--------------|-------------------------------------------|
| **1**  | **Database** | ← *You are here*                          |
| 2      | Backend APIs | Uses `prisma` client from `lib/prisma.ts` |
| 3      | Frontend UI  | Calls APIs built by Person 2              |
| 4      | Auth + Deploy| Uses `users` table for authentication     |

**Person 2** should import `prisma` from `@/lib/prisma` to query the database, and use types from `@/types/database` for type safety.

---

## 📋 Schema Summary

```prisma
model Student      { id, rollNumber, name, email, branch, semester }
model Hall         { id, hallName, block, floor, totalSeats, rows, columns }
model ExamSchedule { id, subjectCode, subjectName, examDate, startTime, endTime, semester, branch }
model Allocation   { id, studentId, hallId, examScheduleId, seatNumber, rowNumber, columnNumber }
model User         { id, name, email, password, role }
```
