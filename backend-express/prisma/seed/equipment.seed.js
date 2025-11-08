import prisma from '../../src/config/database.js';

export const seedTrucks = async () => {
  const trucks = [
    {
      code: 'TRK-001',
      name: 'Hauler 001',
      brand: 'Komatsu',
      model: 'HD785-7',
      yearManufacture: 2020,
      capacity: 91.0,
      fuelCapacity: 950.0,
      status: 'IDLE',
      totalHours: 4580,
      totalDistance: 123456.8,
      currentLocation: 'Loading Point LP-001',
      isActive: true,
    },
    {
      code: 'TRK-002',
      name: 'Hauler 002',
      brand: 'Komatsu',
      model: 'HD785-7',
      yearManufacture: 2021,
      capacity: 91.0,
      fuelCapacity: 950.0,
      status: 'IDLE',
      totalHours: 3200,
      totalDistance: 95000.5,
      currentLocation: 'Loading Point LP-001',
      isActive: true,
    },
    {
      code: 'TRK-003',
      name: 'Hauler 003',
      brand: 'Hitachi',
      model: 'EH3500ACII',
      yearManufacture: 2019,
      capacity: 181.0,
      fuelCapacity: 2500.0,
      status: 'IDLE',
      totalHours: 5600,
      totalDistance: 145000.0,
      currentLocation: 'Dumping Point DP-001',
      isActive: true,
    },
    {
      code: 'TRK-004',
      name: 'Hauler 004',
      brand: 'Caterpillar',
      model: '777F',
      yearManufacture: 2020,
      capacity: 100.0,
      fuelCapacity: 1100.0,
      status: 'MAINTENANCE',
      totalHours: 4100,
      totalDistance: 110000.0,
      currentLocation: 'Workshop',
      isActive: true,
    },
    {
      code: 'TRK-005',
      name: 'Hauler 005',
      brand: 'Komatsu',
      model: 'HD785-7',
      yearManufacture: 2021,
      capacity: 91.0,
      fuelCapacity: 950.0,
      status: 'IDLE',
      totalHours: 2800,
      totalDistance: 78000.0,
      currentLocation: 'Loading Point LP-002',
      isActive: true,
    },
  ];

  const created = [];
  for (const data of trucks) {
    const truck = await prisma.truck.upsert({
      where: { code: data.code },
      update: {},
      create: data,
    });
    created.push(truck);
  }

  return created;
};

export const seedExcavators = async () => {
  const excavators = [
    {
      code: 'EXC-001',
      name: 'Excavator Alpha',
      brand: 'Komatsu',
      model: 'PC400',
      yearManufacture: 2019,
      bucketCapacity: 2.3,
      status: 'ACTIVE',
      totalHours: 6800,
      currentLocation: 'Loading Point LP-001',
      isActive: true,
    },
    {
      code: 'EXC-002',
      name: 'Excavator Beta',
      brand: 'Hitachi',
      model: 'ZX470',
      yearManufacture: 2020,
      bucketCapacity: 2.5,
      status: 'ACTIVE',
      totalHours: 5200,
      currentLocation: 'Loading Point LP-002',
      isActive: true,
    },
  ];

  const created = [];
  for (const data of excavators) {
    const excavator = await prisma.excavator.upsert({
      where: { code: data.code },
      update: {},
      create: data,
    });
    created.push(excavator);
  }

  return created;
};

export const seedOperators = async (operatorUserIds) => {
  const operators = [];

  for (let i = 0; i < operatorUserIds.length; i++) {
    operators.push({
      userId: operatorUserIds[i],
      employeeNumber: `EMP-OP-${String(i + 1).padStart(3, '0')}`,
      licenseNumber: `LIC-${String(i + 1).padStart(6, '0')}`,
      licenseType: 'OPERATOR_ALAT_BERAT',
      licenseExpiry: new Date('2025-12-31'),
      competency: { truck: true, excavator: false },
      status: 'ACTIVE',
      shift: i % 3 === 0 ? 'SHIFT_1' : i % 3 === 1 ? 'SHIFT_2' : 'SHIFT_3',
      totalHours: 2000 + i * 500,
      rating: 4.5 + i * 0.1,
      joinDate: new Date('2023-01-15'),
    });
  }

  const created = [];
  for (const data of operators) {
    const operator = await prisma.operator.upsert({
      where: { userId: data.userId },
      update: {},
      create: data,
    });
    created.push(operator);
  }

  return created;
};
