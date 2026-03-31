import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const data = await prisma.student.findMany();
        return Response.json(data);
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Ensure year and semester are numbers if sent as strings from postman
        const payload = {
            ...body,
            year: body.year ? Number(body.year) : undefined,
            semester: body.semester ? Number(body.semester) : undefined,
        };

        const data = await prisma.student.create({
            data: payload
        });

        return Response.json({ message: "Student added", data });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
