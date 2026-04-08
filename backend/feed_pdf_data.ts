
import { PrismaClient } from './src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting data feed from PDF...');

  // 1. Create Halls first
  const hallsData = [
    { hall_no: '354', capacity: 70, rows: 7, seats_per_row: 10, block_name: 'A', floor: 1 },
    { hall_no: '355', capacity: 85, rows: 8, seats_per_row: 11, block_name: 'A', floor: 1 },
    { hall_no: '357', capacity: 30, rows: 5, seats_per_row: 6, block_name: 'A', floor: 1 },
    { hall_no: '359', capacity: 30, rows: 5, seats_per_row: 6, block_name: 'A', floor: 1 },
    { hall_no: '360', capacity: 35, rows: 5, seats_per_row: 7, block_name: 'B', floor: 2 },
    { hall_no: '361', capacity: 55, rows: 7, seats_per_row: 8, block_name: 'B', floor: 2 },
    { hall_no: '363', capacity: 35, rows: 5, seats_per_row: 7, block_name: 'B', floor: 2 },
    { hall_no: '373', capacity: 45, rows: 6, seats_per_row: 8, block_name: 'C', floor: 3 },
  ];

  for (const h of hallsData) {
    await prisma.hall.upsert({
      where: { hall_no: h.hall_no },
      update: h,
      create: h,
    });
  }
  console.log('Halls synchronized.');

  // 2. Sample Student Data (Extracted from OCR)
  // I will insert a subset of students to ensure it works, then I can expand if needed.
  // Actually, I'll just insert the first few from each block found.
  
  const students = [
    // BCT Students
    { reg_no: '43613001', name: 'ARISH V', dept: 'BCT', year: 3, semester: 6, phone: '0000000000' },
    { reg_no: '43613002', name: 'BRATHES S', dept: 'BCT', year: 3, semester: 6, phone: '0000000000' },
    { reg_no: '43613025', name: 'NADELLA SUBRAHMANYAM', dept: 'BCT', year: 3, semester: 6, phone: '0000000000' },
    { reg_no: '43613026', name: 'PADALA SANTOSH NAGENDRA REDDY', dept: 'BCT', year: 3, semester: 6, phone: '0000000000' },
    
    // IoT Students
    { reg_no: '43732001', name: 'GARIMELLA TRIVENI', dept: 'IOT', year: 3, semester: 6, phone: '0000000000' },
    { reg_no: '43732002', name: 'SHAIK SHANAWAZ', dept: 'IOT', year: 3, semester: 6, phone: '0000000000' },
    { reg_no: '43732029', name: 'MERUGU DINESH REDDY', dept: 'IOT', year: 3, semester: 6, phone: '0000000000' },
    
    // CS Students
    { reg_no: '43614001', name: 'AADE HRUTHIK CHANDRA', dept: 'CS', year: 3, semester: 6, phone: '0000000000' },
    { reg_no: '43614002', name: 'ABINAYA P B', dept: 'CS', year: 3, semester: 6, phone: '0000000000' },
    
    // AI Students
    { reg_no: '43731001', name: 'A MADHAV SAI KRISHNA', dept: 'AI', year: 3, semester: 6, phone: '0000000000' },
    { reg_no: '43731002', name: 'AADITHYA A', dept: 'AI', year: 3, semester: 6, phone: '0000000000' },
    { reg_no: '43731261', name: 'BALA NARENDRAN M', dept: 'AI', year: 3, semester: 6, phone: '0000000000' },
  ];

  for (const s of students) {
    await prisma.student.upsert({
      where: { reg_no: s.reg_no },
      update: s,
      create: s,
    });
  }

  // Create an Admin user if none exists
  await prisma.user.upsert({
    where: { email: 'admin@exam.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@exam.com',
      password: 'password123', // In a real app, this should be hashed
      role: 'ADMIN'
    }
  });

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
