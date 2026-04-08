import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const regNo = searchParams.get("reg_no");

        if (!regNo) {
            return Response.json({ error: "reg_no parameter is required" }, { status: 400 });
        }

        const allocation = await prisma.allocation.findFirst({
            where: { student: { reg_no: regNo } },
            include: { student: true, hall: true, examSchedule: true },
            orderBy: { createdAt: 'desc' }
        });

        if (!allocation) {
            return Response.json(null);
        }

        return Response.json({
            student_name: allocation.student.name,
            hall_no: allocation.hall.hall_no,
            seat_no: allocation.seatNumber,
            exam_date: allocation.examSchedule.examDate.toISOString().split('T')[0],
            subject: allocation.examSchedule.subjectName
        });

    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
