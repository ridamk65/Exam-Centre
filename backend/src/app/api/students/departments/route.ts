
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Fetch unique departments from the student table
        const departments = await prisma.student.findMany({
            select: {
                dept: true
            },
            distinct: ['dept']
        });

        const deptList = departments.map(d => d.dept).sort();

        return NextResponse.json(deptList);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
