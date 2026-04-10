import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = await req.json();
        const { id } = await params;
        
        const data = await prisma.examSchedule.update({
            where: { id: id },
            data: {
                subjectName: body.subject,
                examDate: new Date(body.exam_date),
                semester: Number(body.year) * 2,
                branch: body.dept
            }
        });

        return Response.json({ message: "Schedule updated", data });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.examSchedule.delete({
            where: { id: id }
        });
        return Response.json({ message: "Schedule deleted" });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
