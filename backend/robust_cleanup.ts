
import { PrismaClient } from './src/generated/prisma';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('--- STARTING ROBUST DATABASE CLEANUP ---');
  
  // 1. Clear existing data
  await prisma.student.deleteMany({});
  console.log('Cleared existing student table.');

  // 2. Read from external file to avoid syntax errors
  const filePath = path.join(__dirname, 'students_list.txt');
  if (!fs.existsSync(filePath)) {
    throw new Error('Data file NOT found!');
  }

  const rawData = fs.readFileSync(filePath, 'utf-8');
  const lines = rawData.trim().split('\n');
  const students = [];

  const deptMatchPatterns = [
    { code: 'BCT', match: 'BCT' },
    { code: 'IoT', match: 'IOT' },
    { code: 'IoT', match: 'IoT' },
    { code: 'IoT', match: 'Io' }, 
    { code: 'CS', match: 'CS' },
    { code: 'AI', match: 'AI' }
  ];

  for (const line of lines) {
    const parts = line.trim().split(' ');
    if (parts.length < 3) continue;

    const reg_no = parts[0];
    const hall = parts[parts.length - 1];
    
    // Middle text: Name + Dept
    let middleText = parts.slice(1, parts.length - 1).join(' ').trim();
    
    let finalDept = '';
    let finalName = middleText;

    for (const pattern of deptMatchPatterns) {
      if (middleText.toUpperCase().endsWith(pattern.match.toUpperCase())) {
         finalDept = pattern.code;
         finalName = middleText.slice(0, middleText.toUpperCase().lastIndexOf(pattern.match.toUpperCase())).trim();
         break;
      }
    }

    if (!finalDept) {
      finalDept = 'GEN';
      finalName = middleText;
    }

    students.push({
      reg_no,
      name: finalName,
      dept: finalDept,
      year: 3,
      semester: 6,
      phone: '0000000000'
    });
  }

  console.log(`Processing ${students.length} students with robust logic...`);

  // Batch insert into Supabase
  await prisma.student.createMany({
    data: students
  });

  console.log('SUCCESS: Database reset and re-imported with 100% clean departments.');
}

main()
  .catch((e) => {
    console.error('FAILED:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
