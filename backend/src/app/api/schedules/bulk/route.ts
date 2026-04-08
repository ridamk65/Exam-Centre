
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items } = body;

        if (!items || !Array.isArray(items)) {
            return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
        }

        const formattedItems = items.map((item: any) => {
            // Flexible column matching
            const subject = item.Subject || item.subject || item["Subject Name"] || item["Subject & Syllabus"];
            const date = item.Date || item.date || item["Exam Date"] || item["Examination Date"];
            const dept = item.Dept || item.dept || item.Branch || item.Department || item["Target Dept."];
            const year = item.Year || item.year || item.Level || item["Study Year"] || 1;

            if (!subject || !date || !dept) {
                console.warn("Skipping invalid row:", item);
                return null;
            }

            return {
                subjectCode: item.Code || "CODE_GEN",
                subjectName: String(subject).trim(),
                examDate: new Date(date),
                startTime: item["Start Time"] || "09:00 AM",
                endTime: item["End Time"] || "12:00 PM",
                semester: Number(year) * 2,
                branch: String(dept).trim().toUpperCase()
            };
        }).filter(Boolean);

        if (formattedItems.length === 0) {
            return NextResponse.json({ error: "No valid rows found in sheet" }, { status: 400 });
        }

        // Perform bulk create
        await prisma.examSchedule.createMany({
            data: formattedItems as any
        });

        return NextResponse.json({ 
            message: "Bulk sync successful", 
            count: formattedItems.length 
        });

    } catch (error: any) {
        console.error("Bulk Upload Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
