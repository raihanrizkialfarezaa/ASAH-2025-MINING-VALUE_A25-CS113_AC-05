import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testAPIData() {
  try {
    console.log('\n=== TESTING API DATA AVAILABILITY ===\n');

    const excavators = await prisma.excavator.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        code: true,
        model: true,
        status: true,
      },
      take: 10,
    });
    console.log(`✓ Active Excavators: ${excavators.length}`);
    excavators.forEach((exc) => {
      console.log(`  - ${exc.code}: ${exc.model} (${exc.status})`);
    });

    const roadSegments = await prisma.roadSegment.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        code: true,
        name: true,
        distance: true,
      },
      take: 10,
    });
    console.log(`\n✓ Active Road Segments: ${roadSegments.length}`);
    roadSegments.forEach((road) => {
      console.log(`  - ${road.code}: ${road.name} (${road.distance}km)`);
    });

    const schedules = await prisma.sailingSchedule.findMany({
      where: {
        status: 'SCHEDULED',
      },
      include: {
        vessel: {
          select: {
            code: true,
            name: true,
          },
        },
      },
      take: 10,
    });
    console.log(`\n✓ Scheduled Sailings: ${schedules.length}`);
    schedules.forEach((sch) => {
      console.log(`  - ${sch.scheduleNumber}: ${sch.vessel.name} - ${sch.plannedQuantity}T`);
    });

    console.log('\n=== ALL DATA AVAILABLE FOR PARAMETER FORM ===\n');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testAPIData();
