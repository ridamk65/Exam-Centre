import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        let dateParam = searchParams.get("date");

        if (!dateParam) {
            const latestSchedule = await prisma.examSchedule.findFirst({
                orderBy: { examDate: 'desc' }
            });
            if (!latestSchedule) return Response.json(null);
            dateParam = latestSchedule.examDate.toISOString().split('T')[0];
        }

        const targetDate = new Date(dateParam);
        
        // Find schedules for this date
        const schedules = await prisma.examSchedule.findMany({
            where: {
                examDate: {
                    gte: new Date(targetDate.setHours(0, 0, 0, 0)),
                    lte: new Date(targetDate.setHours(23, 59, 59, 999))
                }
            }
        });

        if (!schedules.length) {
            return Response.json(null); // No allocation history for this date
        }

        const scheduleIds = schedules.map(s => s.id);

        const allocations = await prisma.allocation.findMany({
            where: { examScheduleId: { in: scheduleIds } },
            include: { student: true, hall: true, examSchedule: true },
            orderBy: [{ hall: { hall_no: 'asc' } }, { seatNumber: 'asc' }]
        });

        if (!allocations.length) {
            return Response.json(null);
        }

        // Reconstruct the JSON shape the frontend expects
        const hallGroups: Record<string, any> = {};
        allocations.forEach(a => {
            if (!hallGroups[a.hall.hall_no]) {
                hallGroups[a.hall.hall_no] = {
                    hall_no: a.hall.hall_no,
                    block: a.hall.block_name,
                    floor: a.hall.floor,
                    capacity: a.hall.capacity,
                    allocated: 0,
                    students: []
                };
            }
            hallGroups[a.hall.hall_no].allocated++;
            hallGroups[a.hall.hall_no].students.push({
                seat_no: a.seatNumber,
                reg_no: a.student.reg_no,
                name: a.student.name,
                dept: a.student.dept,
                year: a.student.year,
                group: `${a.student.dept} Y${a.student.year}`,
                subject: a.examSchedule.subjectName
            });
        });

        return Response.json({
            id: schedules[0].id,
            exam_date: dateParam,
            generated_at: allocations[0].createdAt.toISOString(),
            total_students: allocations.length,
            halls_used: Object.keys(hallGroups).length,
            departments: schedules.map(s => `${s.branch} Y${Math.max(1, Math.floor(s.semester / 2))}`).join(', '),
            halls: Object.values(hallGroups)
        });

    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
