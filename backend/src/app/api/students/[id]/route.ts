import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { id } = await params;
        
        const payload = {
            ...body,
            year: body.year ? Number(body.year) : undefined,
            semester: body.semester ? Number(body.semester) : undefined,
        };

        const data = await prisma.student.update({
            where: { id: id },
            data: payload
        });

        return Response.json({ message: "Student updated", data });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        await prisma.student.delete({
            where: { id: id }
        });
        return Response.json({ message: "Student deleted" });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
