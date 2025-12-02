import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkDashboardData() {
  try {
    console.log('=== Checking Dashboard Data ===\n');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      trucksCount,
      excavatorsCount,
      operatorsCount,
      productionCount,
      haulingCount,
      sitesCount,
      loadingPointsCount,
      dumpingPointsCount,
      roadSegmentsCount,
      todayProduction,
      fuelConsumption,
      maintenanceLogs,
      weatherData,
    ] = await Promise.all([
      prisma.truck.count(),
      prisma.excavator.count(),
      prisma.operator.count(),
      prisma.productionTarget.count(),
      prisma.haulingActivity.count(),
      prisma.miningSite.count(),
      prisma.loadingPoint.count(),
      prisma.dumpingPoint.count(),
      prisma.roadSegment.count(),
      prisma.productionTarget.findMany({
        where: {
          recordDate: {
            gte: today,
          },
        },
        include: {
          miningSite: true,
        },
      }),
      prisma.fuelConsumption.findMany({
        where: {
          recordDate: {
            gte: today,
          },
        },
        take: 10,
      }),
      prisma.maintenanceLog.findMany({
        where: {
          OR: [{ status: 'SCHEDULED' }, { status: 'IN_PROGRESS' }],
        },
        take: 10,
        orderBy: {
          scheduledDate: 'asc',
        },
      }),
      prisma.weatherCondition.findFirst({
        orderBy: {
          recordDate: 'desc',
        },
      }),
    ]);

    console.log('Fleet Status:');
    console.log(`- Total Trucks: ${trucksCount}`);
    console.log(`- Total Excavators: ${excavatorsCount}`);
    console.log(`- Total Operators: ${operatorsCount}\n`);

    console.log('Location Data:');
    console.log(`- Mining Sites: ${sitesCount}`);
    console.log(`- Loading Points: ${loadingPointsCount}`);
    console.log(`- Dumping Points: ${dumpingPointsCount}`);
    console.log(`- Road Segments: ${roadSegmentsCount}\n`);

    console.log('Operations:');
    console.log(`- Total Hauling Activities: ${haulingCount}`);
    console.log(`- Production Targets: ${productionCount}\n`);

    console.log(`Today's Production (${today.toLocaleDateString('id-ID')}):`);
    if (todayProduction.length > 0) {
      todayProduction.forEach((prod) => {
        console.log(
          `- Site: ${prod.miningSite?.name || 'N/A'}, Target: ${prod.targetProduction}t, Actual: ${prod.actualProduction}t`
        );
      });
    } else {
      console.log('- No production data for today');
    }
    console.log('');

    console.log('Fuel Consumption Today:');
    if (fuelConsumption.length > 0) {
      const totalFuel = fuelConsumption.reduce((sum, f) => sum + (f.litersUsed || 0), 0);
      console.log(`- Total: ${totalFuel.toFixed(2)} liters`);
      console.log(`- Records: ${fuelConsumption.length}`);
    } else {
      console.log('- No fuel consumption data for today');
    }
    console.log('');

    console.log('Maintenance Status:');
    if (maintenanceLogs.length > 0) {
      console.log(`- Scheduled/In Progress: ${maintenanceLogs.length}`);
      maintenanceLogs.forEach((log) => {
        console.log(`  * ${log.equipmentType} - ${log.description} (${log.status})`);
      });
    } else {
      console.log('- No pending maintenance');
    }
    console.log('');

    console.log('Weather:');
    if (weatherData) {
      console.log(`- Condition: ${weatherData.condition}`);
      console.log(`- Temperature: ${weatherData.temperature}°C`);
      console.log(`- Rainfall: ${weatherData.rainfall}mm`);
      console.log(`- Last Update: ${weatherData.recordDate.toLocaleString('id-ID')}`);
    } else {
      console.log('- No weather data available');
    }
  } catch (error) {
    console.error('Error checking dashboard data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDashboardData();
