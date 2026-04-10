import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = await req.json();
        const { id } = await params;
        
        const payload = {
            ...body,
            floor: body.floor ? Number(body.floor) : 0,
            capacity: body.capacity ? Number(body.capacity) : 0,
            rows: body.rows ? Number(body.rows) : 0,
            seats_per_row: body.seats_per_row ? Number(body.seats_per_row) : 0,
        };

        const data = await prisma.hall.update({
            where: { id: id },
            data: payload
        });

        return Response.json({ message: "Hall updated", data });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.hall.delete({
            where: { id: id }
        });
        return Response.json({ message: "Hall deleted" });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
