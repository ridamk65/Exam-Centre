
import { PrismaClient } from './src/generated/prisma';

const prisma = new PrismaClient();

const cyberCorrected = [
  { date: '2026-04-20', subject: 'Information Technology Security Evaluation' },
  { date: '2026-04-21', subject: 'Artificial Intelligence for Cyber Security' },
  { date: '2026-04-27', subject: 'Web Exploitation and Defence' },
  { date: '2026-04-28', subject: 'Cyber Threat Management Using AI' }
];

async function main() {
  console.log('--- CORRECTING CYBER SUBJECTS IN TIME TABLE ---');
  
  for (const item of cyberCorrected) {
    await prisma.examSchedule.updateMany({
      where: {
        branch: 'CYBER',
        examDate: new Date(item.date)
      },
      data: {
        subjectName: item.subject
      }
    });
    console.log(`Updated CYBER subject for ${item.date} to: ${item.subject}`);
  }

  console.log('SUCCESS: Cyber Security subjects have been perfectly corrected.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
