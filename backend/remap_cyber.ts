
import { PrismaClient } from './src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('--- RENAMING CS TO CYBER ---');
  
  // 1. Update Student table
  const students = await prisma.student.updateMany({
    where: { dept: 'CS' },
    data: { dept: 'CYBER' }
  });
  console.log(`Updated ${students.count} students from CS to CYBER.`);

  // 2. Update ExamSchedule table
  const schedules = await prisma.examSchedule.updateMany({
    where: { branch: 'CS' },
    data: { branch: 'CYBER' }
  });
  console.log(`Updated ${schedules.count} exam schedules from CS to CYBER.`);

  console.log('SUCCESS: All "CS" references have been remapped to "CYBER".');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
