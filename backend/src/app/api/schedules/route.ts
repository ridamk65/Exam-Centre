import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const schedules = await prisma.examSchedule.findMany();
        return Response.json(schedules.map(s => ({
            id: s.id,
            exam_date: s.examDate.toISOString().split('T')[0],
            dept: s.branch,
            year: Math.max(1, Math.floor(s.semester / 2)),
            subject: s.subjectName
        })));
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const data = await prisma.examSchedule.create({
            data: {
                subjectCode: "CODE_001",
                subjectName: body.subject,
                examDate: new Date(body.exam_date),
                startTime: "09:00 AM",
                endTime: "12:00 PM",
                semester: Number(body.year) * 2,
                branch: body.dept
            }
        });

        return Response.json({ message: "Schedule added", data });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
