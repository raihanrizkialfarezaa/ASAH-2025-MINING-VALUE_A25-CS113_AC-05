import { seedUsers } from './users.seed.js';
import {
  seedMiningSite,
  seedLoadingPoints,
  seedDumpingPoints,
  seedRoadSegments,
} from './locations.seed.js';
import { seedTrucks, seedExcavators, seedOperators } from './equipment.seed.js';
import { seedWeatherLogs, seedMaintenanceLogs, seedProductionRecords } from './operational.seed.js';
import logger from '../../src/config/logger.js';

async function main() {
  try {
    logger.info('Starting database seeding...');

    logger.info('Seeding users...');
    const users = await seedUsers();
    logger.info(`Created ${users.length} users`);

    logger.info('Seeding mining site...');
    const miningSite = await seedMiningSite();
    logger.info(`Created mining site: ${miningSite.name}`);

    logger.info('Seeding loading points...');
    const loadingPoints = await seedLoadingPoints(miningSite.id);
    logger.info(`Created ${loadingPoints.length} loading points`);

    logger.info('Seeding dumping points...');
    const dumpingPoints = await seedDumpingPoints(miningSite.id);
    logger.info(`Created ${dumpingPoints.length} dumping points`);

    logger.info('Seeding road segments...');
    const roadSegments = await seedRoadSegments(miningSite.id);
    logger.info(`Created ${roadSegments.length} road segments`);

    logger.info('Seeding trucks...');
    const trucks = await seedTrucks();
    logger.info(`Created ${trucks.length} trucks`);

    logger.info('Seeding excavators...');
    const excavators = await seedExcavators(loadingPoints);
    logger.info(`Created ${excavators.length} excavators`);

    logger.info('Seeding operators...');
    const operatorUserIds = users.filter((u) => u.role === 'OPERATOR').map((u) => u.id);
    const operators = await seedOperators(operatorUserIds);
    logger.info(`Created ${operators.length} operators`);

    logger.info('Seeding weather logs...');
    const weatherLogs = await seedWeatherLogs(miningSite.id);
    logger.info(`Created ${weatherLogs.length} weather logs`);

    logger.info('Seeding maintenance logs...');
    const maintenanceLogs = await seedMaintenanceLogs(trucks, excavators);
    logger.info(`Created ${maintenanceLogs.length} maintenance logs`);

    logger.info('Seeding production records...');
    const productionRecords = await seedProductionRecords(miningSite.id);
    logger.info(`Created ${productionRecords.length} production records`);

    logger.info('Database seeding completed successfully!');
  } catch (error) {
    logger.error('Error during seeding:', error);
    throw error;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
