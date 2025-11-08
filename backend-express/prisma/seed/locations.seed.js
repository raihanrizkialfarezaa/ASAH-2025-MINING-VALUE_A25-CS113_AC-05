import prisma from '../../src/config/database.js';

export const seedMiningSite = async () => {
  const site = await prisma.miningSite.upsert({
    where: { code: 'MS-001' },
    update: {},
    create: {
      code: 'MS-001',
      name: 'Pit Alpha Main Site',
      siteType: 'PIT',
      description: 'Main mining pit located in East Kalimantan',
      latitude: -0.5022,
      longitude: 117.1536,
      elevation: 150.5,
      capacity: 50000,
      isActive: true,
    },
  });

  return site;
};

export const seedLoadingPoints = async (miningSiteId) => {
  const loadingPoints = [
    {
      code: 'LP-001',
      name: 'Loading Point North A',
      miningSiteId,
      latitude: -0.5012,
      longitude: 117.1546,
      isActive: true,
    },
    {
      code: 'LP-002',
      name: 'Loading Point South B',
      miningSiteId,
      latitude: -0.5032,
      longitude: 117.1526,
      isActive: true,
    },
  ];

  const created = [];
  for (const data of loadingPoints) {
    const point = await prisma.loadingPoint.upsert({
      where: { code: data.code },
      update: {},
      create: data,
    });
    created.push(point);
  }

  return created;
};

export const seedDumpingPoints = async (miningSiteId) => {
  const dumpingPoints = [
    {
      code: 'DP-001',
      name: 'Dumping Point East',
      miningSiteId,
      dumpingType: 'STOCKPILE',
      latitude: -0.5042,
      longitude: 117.1556,
      capacity: 5000.0,
      currentStock: 1200.0,
      isActive: true,
    },
    {
      code: 'DP-002',
      name: 'Dumping Point West',
      miningSiteId,
      dumpingType: 'ROM_STOCKPILE',
      latitude: -0.5002,
      longitude: 117.1516,
      capacity: 6000.0,
      currentStock: 800.0,
      isActive: true,
    },
  ];

  const created = [];
  for (const data of dumpingPoints) {
    const point = await prisma.dumpingPoint.upsert({
      where: { code: data.code },
      update: {},
      create: data,
    });
    created.push(point);
  }

  return created;
};

export const seedRoadSegments = async (miningSiteId) => {
  const roadSegments = [
    {
      code: 'RS-001',
      name: 'Main Haul Road',
      miningSiteId,
      startPoint: 'LP-001',
      endPoint: 'DP-001',
      distance: 3.5,
      roadCondition: 'GOOD',
      maxSpeed: 40,
      gradient: 2.5,
    },
    {
      code: 'RS-002',
      name: 'Secondary Access Road',
      miningSiteId,
      startPoint: 'LP-002',
      endPoint: 'DP-002',
      distance: 2.8,
      roadCondition: 'FAIR',
      maxSpeed: 30,
      gradient: 3.0,
    },
  ];

  const created = [];
  for (const data of roadSegments) {
    const segment = await prisma.roadSegment.upsert({
      where: { code: data.code },
      update: {},
      create: data,
    });
    created.push(segment);
  }

  return created;
};
