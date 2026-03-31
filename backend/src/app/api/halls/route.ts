import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Convert string fields to numbers where strictly necessary if Postman sends strings
        const payload = {
            ...body,
            floor: body.floor ? Number(body.floor) : 0,
            capacity: body.capacity ? Number(body.capacity) : 0,
            rows: body.rows ? Number(body.rows) : 0,
            seats_per_row: body.seats_per_row ? Number(body.seats_per_row) : 0,
        };

        const data = await prisma.hall.create({
            data: payload
        });

        return Response.json({
            message: "Hall added successfully",
            data
        });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const data = await prisma.hall.findMany();
        return Response.json(data);
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
