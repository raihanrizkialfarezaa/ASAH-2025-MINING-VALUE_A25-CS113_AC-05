import prisma from '../../src/config/database.js';

export const seedWeatherLogs = async (miningSiteId) => {
  const now = new Date();
  const logs = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const conditions = ['CERAH', 'BERAWAN', 'HUJAN_RINGAN', 'HUJAN_SEDANG'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];

    const riskLevels = {
      CERAH: 'LOW',
      BERAWAN: 'LOW',
      HUJAN_RINGAN: 'MEDIUM',
      HUJAN_SEDANG: 'HIGH',
    };

    logs.push({
      miningSiteId,
      condition,
      temperature: 28 + Math.random() * 5,
      humidity: 60 + Math.random() * 30,
      windSpeed: 5 + Math.random() * 15,
      rainfall: condition.includes('HUJAN') ? 10 + Math.random() * 30 : 0,
      visibility: condition === 'HUJAN_SEDANG' ? 'POOR' : 'GOOD',
      riskLevel: riskLevels[condition],
      isOperational: !condition.includes('HUJAN_SEDANG'),
      timestamp: date,
    });
  }

  const created = [];
  for (const log of logs) {
    const weatherLog = await prisma.weatherLog.create({ data: log });
    created.push(weatherLog);
  }

  return created;
};

export const seedMaintenanceLogs = async (trucks, excavators) => {
  const logs = [];
  let counter = 1;

  if (trucks.length > 0) {
    logs.push({
      maintenanceNumber: `MNT-${new Date().getFullYear()}${String(counter++).padStart(4, '0')}`,
      truckId: trucks[0].id,
      maintenanceType: 'PREVENTIVE',
      description: 'Scheduled PM 500 hours service',
      scheduledDate: new Date('2025-01-15'),
      actualDate: new Date('2025-01-15'),
      duration: 480,
      cost: 2500000,
      status: 'COMPLETED',
      mechanicName: 'Bambang Susilo',
      downtimeHours: 8.0,
    });

    logs.push({
      maintenanceNumber: `MNT-${new Date().getFullYear()}${String(counter++).padStart(4, '0')}`,
      truckId: trucks[3].id,
      maintenanceType: 'CORRECTIVE',
      description: 'Engine repair - fuel injection system',
      scheduledDate: new Date('2025-01-10'),
      actualDate: new Date('2025-01-10'),
      duration: 720,
      cost: 15000000,
      status: 'IN_PROGRESS',
      mechanicName: 'Andi Saputra',
      downtimeHours: 12.0,
    });
  }

  if (excavators.length > 0) {
    logs.push({
      maintenanceNumber: `MNT-${new Date().getFullYear()}${String(counter++).padStart(4, '0')}`,
      excavatorId: excavators[0].id,
      maintenanceType: 'PREVENTIVE',
      description: 'Hydraulic system check',
      scheduledDate: new Date('2025-01-20'),
      actualDate: new Date('2025-01-20'),
      duration: 240,
      cost: 1500000,
      status: 'SCHEDULED',
      mechanicName: 'Hendra Wijaya',
      downtimeHours: 0,
    });
  }

  const created = [];
  for (const log of logs) {
    const maintenanceLog = await prisma.maintenanceLog.create({ data: log });
    created.push(maintenanceLog);
  }

  return created;
};

export const seedProductionRecords = async (miningSiteId) => {
  const records = [];
  const now = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const target = 5000 + Math.random() * 1000;
    const actual = target * (0.85 + Math.random() * 0.25);

    records.push({
      miningSiteId,
      recordDate: date,
      shift: i % 3 === 0 ? 'SHIFT_1' : i % 3 === 1 ? 'SHIFT_2' : 'SHIFT_3',
      targetProduction: target,
      actualProduction: actual,
      achievement: (actual / target) * 100,
      avgCalori: 5200 + Math.random() * 300,
      avgAshContent: 8 + Math.random() * 2,
      avgSulfur: 0.5 + Math.random() * 0.3,
      totalTrips: Math.floor(40 + Math.random() * 20),
      totalDistance: 150 + Math.random() * 50,
      avgCycleTime: 45 + Math.random() * 15,
      trucksOperating: 4 + Math.floor(Math.random() * 2),
      excavatorsOperating: 2,
      utilizationRate: 75 + Math.random() * 20,
      remarks: i === 0 ? 'Weather delay affected production' : null,
    });
  }

  const created = [];
  for (const record of records) {
    const productionRecord = await prisma.productionRecord.create({ data: record });
    created.push(productionRecord);
  }

  return created;
};
