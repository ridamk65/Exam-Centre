import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { examDate } = await req.json();
    if (!examDate) return Response.json({ error: "examDate is required" }, { status: 400 });

    const targetDate = new Date(examDate);
    const schedules = await prisma.examSchedule.findMany({
      where: {
        examDate: {
          gte: new Date(targetDate.setHours(0, 0, 0, 0)),
          lte: new Date(targetDate.setHours(23, 59, 59, 999))
        }
      }
    });

    if (!schedules.length) return Response.json({ error: "No exams scheduled for this date." }, { status: 400 });

    const halls = await prisma.hall.findMany({ orderBy: { hall_no: 'asc' } });
    if (!halls.length) return Response.json({ error: "No halls available. Please add halls first." }, { status: 400 });

    const students = await prisma.student.findMany();

    // Group students by dept-year
    const groups: Record<string, { dept: string; year: number; subject: string; scheduleId: string; students: any[] }> = {};
    schedules.forEach(s => {
      const year = Math.max(1, Math.floor(s.semester / 2));
      const key = `${s.branch}_${year}`;
      if (!groups[key]) groups[key] = { dept: s.branch, year: year, subject: s.subjectName, scheduleId: s.id, students: [] };
      const matching = students.filter(st => st.dept === s.branch && st.year === year);
      groups[key].students.push(...matching);
    });

    const groupList = Object.values(groups);
    if (groupList.length === 0) return Response.json({ error: "No students found for scheduled departments." }, { status: 400 });

    // Interleave students
    let interleaved: any[] = [];
    const maxLen = Math.max(...groupList.map(g => g.students.length));
    for (let i = 0; i < maxLen; i++) {
      groupList.forEach(g => {
        if (i < g.students.length) {
          interleaved.push({ ...g.students[i], group: `${g.dept} Y${g.year}`, subject: g.subject, scheduleId: g.scheduleId });
        }
      });
    }

    if (groupList.length === 1) {
      interleaved = groupList[0].students.map(s => ({
        ...s, group: `${groupList[0].dept} Y${groupList[0].year}`, subject: groupList[0].subject, scheduleId: groupList[0].scheduleId
      }));
    }

    // Clear old allocations for this date to support regeneration
    const scheduleIds = schedules.map(s => s.id);
    await prisma.allocation.deleteMany({
      where: { examScheduleId: { in: scheduleIds } }
    });

    const allocationResult: any[] = [];
    let seatIndex = 0;
    let hallIndex = 0;
    const dbAllocations = [];

    while (seatIndex < interleaved.length && hallIndex < halls.length) {
      const hall = halls[hallIndex];
      const hallStudents = [];
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

        dbAllocations.push({
          studentId: st.id,
          hallId: hall.id,
          examScheduleId: st.scheduleId,
          seatNumber: seatNum,
          rowNumber: Math.ceil(seatNum / (hall.seats_per_row || 10)),
          columnNumber: ((seatNum - 1) % (hall.seats_per_row || 10)) + 1,
        });

        seatIndex++;
        seatNum++;
      }

      if (hallStudents.length > 0) {
        allocationResult.push({
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

    // Insert to DB
    if (dbAllocations.length > 0) {
      await prisma.allocation.createMany({
        data: dbAllocations
      });
    }

    return Response.json({
      id: Date.now().toString(),
      exam_date: examDate,
      generated_at: new Date().toISOString(),
      total_students: interleaved.length,
      halls_used: allocationResult.length,
      departments: schedules.map(s => `${s.branch} Y${Math.max(1, Math.floor(s.semester / 2))}`).join(', '),
      halls: allocationResult
    });

  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to generate allocation" }, { status: 500 });
  }
}
