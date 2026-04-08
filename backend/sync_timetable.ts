
import { PrismaClient } from './src/generated/prisma';

const prisma = new PrismaClient();

const timetableData = [
  // 20-04-2026
  { date: '2026-04-20', dept: 'CS', subject: 'Compiler Design' },
  { date: '2026-04-20', dept: 'AI', subject: 'Neural Networks and Deep Learning' },
  { date: '2026-04-20', dept: 'BCT', subject: 'Building Private Blockchain' },
  { date: '2026-04-20', dept: 'IoT', subject: 'Optimization Techniques for Computing' },
  
  // 21-04-2026
  { date: '2026-04-21', dept: 'CS', subject: 'Network Security' },
  { date: '2026-04-21', dept: 'AI', subject: 'Computational Intelligence' },
  { date: '2026-04-21', dept: 'BCT', subject: 'Devops' },
  { date: '2026-04-21', dept: 'IoT', subject: 'IoT Application Development' },
  
  // 27-04-2026
  { date: '2026-04-27', dept: 'CS', subject: 'Machine Learning' },
  { date: '2026-04-27', dept: 'AI', subject: 'Natural Language Processing' },
  { date: '2026-04-27', dept: 'BCT', subject: 'Intrusion Detection System' },
  { date: '2026-04-27', dept: 'IoT', subject: 'IoT in Big Data Analytics' },
  
  // 28-04-2026
  { date: '2026-04-28', dept: 'CS', subject: 'Parallel and Distributed Computing' },
  { date: '2026-04-28', dept: 'AI', subject: 'Predictive and Advanced Analytics' },
  { date: '2026-04-28', dept: 'BCT', subject: 'Smart Contracts' },
  { date: '2026-04-28', dept: 'IoT', subject: 'Predictive and Advanced Analytics' }
];

async function main() {
  console.log('--- SYNCING CAE 2 TIME TABLE ---');
  
  // Clear existing schedules to avoid duplicates if re-running
  await prisma.examSchedule.deleteMany({});
  console.log('Cleared existing exam schedules.');

  const schedules = timetableData.map(item => ({
    subjectCode: `CAE2_${item.dept}_${item.date.replace(/-/g, '')}`,
    subjectName: item.subject,
    examDate: new Date(item.date),
    startTime: "09:15 AM",
    endTime: "11:15 AM",
    semester: 6, // 3rd Year = Semester 6
    branch: item.dept
  }));

  await prisma.examSchedule.createMany({
    data: schedules
  });

  console.log(`SUCCESS: Imported ${schedules.length} exam schedules for CAE 2.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
