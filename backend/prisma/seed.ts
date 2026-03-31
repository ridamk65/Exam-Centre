import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── 1. Admin User ──────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@examcentre.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@examcentre.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin created:", admin.email);

  // ── 2. Exam Halls ──────────────────────────────────────────
  const hallsData = [
    { hall_no: "Hall A101", block_name: "Block A", floor: 1, capacity: 60, rows: 6, seats_per_row: 10 },
    { hall_no: "Hall A102", block_name: "Block A", floor: 1, capacity: 60, rows: 6, seats_per_row: 10 },
    { hall_no: "Hall B201", block_name: "Block B", floor: 2, capacity: 40, rows: 5, seats_per_row: 8  },
    { hall_no: "Hall B202", block_name: "Block B", floor: 2, capacity: 40, rows: 5, seats_per_row: 8  },
    { hall_no: "Hall C301", block_name: "Block C", floor: 3, capacity: 80, rows: 8, seats_per_row: 10 },
  ];

  for (const hall of hallsData) {
    await prisma.hall.upsert({
      where: { hall_no: hall.hall_no },
      update: {},
      create: hall,
    });
  }
  console.log(`✅ ${hallsData.length} halls seeded`);

  // ── 3. Students ────────────────────────────────────────────
  // Wipe previous students to ensure our GET API only shows these correct 10 mock students
  await prisma.allocation.deleteMany({});
  await prisma.student.deleteMany({});

  const studentsData = [
    { reg_no: "22CS001", name: "Anjali",  dept: "CSE", year: 3, semester: 6, phone: "9876543210" },
    { reg_no: "22CS002", name: "Pooja",   dept: "CSE", year: 3, semester: 6, phone: "9876543211" },
    { reg_no: "22CS003", name: "Sneha",   dept: "CSE", year: 3, semester: 6, phone: "9876543212" },
    { reg_no: "22EC004", name: "Meena",   dept: "ECE", year: 3, semester: 6, phone: "9876543213" },
    { reg_no: "22EC005", name: "Lakshmi", dept: "ECE", year: 3, semester: 6, phone: "9876543214" },
    { reg_no: "22EC006", name: "Kavya",   dept: "ECE", year: 3, semester: 6, phone: "9876543215" },
    { reg_no: "22IT007", name: "Divya",   dept: "IT",  year: 3, semester: 6, phone: "9876543216" },
    { reg_no: "22IT008", name: "Priya",   dept: "IT",  year: 3, semester: 6, phone: "9876543217" },
    { reg_no: "22IT009", name: "Nisha",   dept: "IT",  year: 3, semester: 6, phone: "9876543218" },
    { reg_no: "22IT010", name: "Swathi",  dept: "IT",  year: 3, semester: 6, phone: "9876543219" }
  ];

  for (const student of studentsData) {
    await prisma.student.upsert({
      where: { reg_no: student.reg_no },
      update: {},
      create: student,
    });
  }
  console.log(`✅ ${studentsData.length} mock students seeded`);

  // ── 4. Exam Schedules ──────────────────────────────────────
  const schedulesData = [
    {
      subjectCode: "CS301",
      subjectName: "Data Structures & Algorithms",
      examDate: new Date("2026-04-10"),
      startTime: "09:00",
      endTime: "12:00",
      semester: 3,
      branch: "CSE",
    },
    {
      subjectCode: "CS302",
      subjectName: "Operating Systems",
      examDate: new Date("2026-04-12"),
      startTime: "09:00",
      endTime: "12:00",
      semester: 3,
      branch: "CSE",
    },
    {
      subjectCode: "EC301",
      subjectName: "Digital Electronics",
      examDate: new Date("2026-04-11"),
      startTime: "14:00",
      endTime: "17:00",
      semester: 3,
      branch: "ECE",
    },
    {
      subjectCode: "ME301",
      subjectName: "Thermodynamics",
      examDate: new Date("2026-04-13"),
      startTime: "09:00",
      endTime: "12:00",
      semester: 3,
      branch: "ME",
    },
  ];

  for (const schedule of schedulesData) {
    await prisma.examSchedule.upsert({
      where: {
        // Using a compound unique approach via findFirst + create
        id: (
          await prisma.examSchedule.findFirst({
            where: { subjectCode: schedule.subjectCode, examDate: schedule.examDate },
          })
        )?.id ?? "new",
      },
      update: {},
      create: schedule,
    });
  }
  console.log(`✅ ${schedulesData.length} exam schedules seeded`);

  // ── 5. Allocations ─────────────────────────────────────────
  const allStudents = await prisma.student.findMany();
  const allSchedules = await prisma.examSchedule.findMany();
  const allHalls = await prisma.hall.findMany();

  let seatCounter = 1;
  for (const schedule of allSchedules) {
    const matchingStudents = allStudents.filter(
      (s: { id: string; dept: string; semester: number }) =>
        s.dept === schedule.branch && s.semester === schedule.semester
    );
    const hall = allHalls[0]; // assign to first hall for seed

    for (const student of matchingStudents) {
      const existing = await prisma.allocation.findUnique({
        where: {
          studentId_examScheduleId: {
            studentId: student.id,
            examScheduleId: schedule.id,
          },
        },
      });

      if (!existing) {
        const row = Math.ceil(seatCounter / hall.seats_per_row);
        const col = ((seatCounter - 1) % hall.seats_per_row) + 1;

        await prisma.allocation.create({
          data: {
            studentId: student.id,
            hallId: hall.id,
            examScheduleId: schedule.id,
            seatNumber: seatCounter,
            rowNumber: row,
            columnNumber: col,
          },
        });
        seatCounter++;
      }
    }
  }

  const totalAllocations = await prisma.allocation.count();
  console.log(`✅ ${totalAllocations} allocations seeded`);
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
