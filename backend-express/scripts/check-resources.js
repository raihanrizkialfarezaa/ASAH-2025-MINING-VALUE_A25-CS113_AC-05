import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkResources() {
  try {
    console.log('\n=== CHECKING DATABASE RESOURCES ===\n');

    const excavators = await prisma.excavator.findMany({
      take: 5,
      orderBy: { code: 'asc' },
    });
    console.log(`Excavators: ${excavators.length} found`);
    if (excavators.length > 0) {
      console.log('Sample:', JSON.stringify(excavators[0], null, 2));
    }

    const roadSegments = await prisma.roadSegment.findMany({
      take: 5,
      orderBy: { code: 'asc' },
    });
    console.log(`\nRoad Segments: ${roadSegments.length} found`);
    if (roadSegments.length > 0) {
      console.log('Sample:', JSON.stringify(roadSegments[0], null, 2));
    }

    const vessels = await prisma.vessel.findMany({
      take: 5,
      orderBy: { code: 'asc' },
    });
    console.log(`\nVessels: ${vessels.length} found`);
    if (vessels.length > 0) {
      console.log('Sample:', JSON.stringify(vessels[0], null, 2));
    }

    const schedules = await prisma.sailingSchedule.findMany({
      take: 5,
      orderBy: { etaLoading: 'desc' },
      include: {
        vessel: true,
      },
    });
    console.log(`\nSailing Schedules: ${schedules.length} found`);
    if (schedules.length > 0) {
      console.log('Sample:', JSON.stringify(schedules[0], null, 2));
    }

    console.log('\n=== DONE ===\n');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkResources();
