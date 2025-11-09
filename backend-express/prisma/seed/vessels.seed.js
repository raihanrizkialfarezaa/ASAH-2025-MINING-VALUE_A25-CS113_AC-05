import prisma from '../../src/config/database.js';

export const seedVessels = async () => {
  const vessels = [
    {
      code: 'MV-BRN-001',
      name: 'MV Borneo Kencana',
      vesselType: 'MOTHER_VESSEL',
      gt: 8500,
      dwt: 12000,
      loa: 120,
      capacity: 11000,
      owner: 'PT Tambang Nusantara',
      isOwned: true,
      status: 'AVAILABLE',
      currentLocation: 'Balikpapan',
      isActive: true,
    },
    {
      code: 'BRG-001',
      name: 'Barge Nusantara-01',
      vesselType: 'BARGE',
      gt: 1200,
      dwt: 3000,
      loa: 60,
      capacity: 2800,
      owner: 'PT Tambang Nusantara',
      isOwned: false,
      status: 'LOADING',
      currentLocation: 'Tanjung Bara',
      isActive: true,
    },
    {
      code: 'BRG-002',
      name: 'Barge Lontar-02',
      vesselType: 'BARGE',
      gt: 1300,
      dwt: 3200,
      loa: 62,
      capacity: 3000,
      owner: 'PT Chartersindo',
      isOwned: false,
      status: 'SAILING',
      currentLocation: 'Enroute to Suralaya',
      isActive: true,
    },
    {
      code: 'TUG-01',
      name: 'Tugboat Samudra-1',
      vesselType: 'TUG_BOAT',
      gt: 250,
      dwt: 500,
      loa: 25,
      capacity: 0,
      owner: 'PT Tug Services',
      isOwned: true,
      status: 'AVAILABLE',
      currentLocation: 'Kariangau',
      isActive: true,
    },
  ];

  const created = [];
  for (const data of vessels) {
    const v = await prisma.vessel.create({ data });
    created.push(v);
  }

  const jettyBerths = [
    {
      code: 'JT-01',
      name: 'Muara Pantai Berth A',
      portName: 'Muara Pantai',
      maxVesselSize: 13000,
      maxDraft: 8.5,
      hasConveyor: true,
      loadingCapacity: 450,
    },
    {
      code: 'JT-02',
      name: 'Kariangau Berth 2',
      portName: 'Kariangau',
      maxVesselSize: 5000,
      maxDraft: 6.0,
      hasConveyor: false,
      loadingCapacity: 120,
    },
  ];

  const createdJetties = [];
  for (const j of jettyBerths) {
    const jb = await prisma.jettyBerth.create({ data: j });
    createdJetties.push(jb);
  }

  const schedules = [
    {
      scheduleNumber: 'SCH-20251101-001',
      vesselId: created[0].id,
      voyageNumber: 'VY-1001',
      loadingPort: 'Tanjung Bara',
      destination: 'Suralaya',
      etaLoading: new Date('2025-11-12T06:00:00Z'),
      etsLoading: new Date('2025-11-12T18:00:00Z'),
      etaDestination: new Date('2025-11-15T08:00:00Z'),
      plannedQuantity: 10000,
      buyer: 'PT Semen Indonesia',
      contractNumber: 'CN-PLN-001',
      status: 'SCHEDULED',
    },
    {
      scheduleNumber: 'SCH-20251102-002',
      vesselId: created[1].id,
      voyageNumber: 'VY-2001',
      loadingPort: 'Tanjung Bara',
      destination: 'Lontar',
      etaLoading: new Date('2025-11-10T20:00:00Z'),
      etsLoading: new Date('2025-11-11T02:00:00Z'),
      etaDestination: new Date('2025-11-11T14:00:00Z'),
      plannedQuantity: 2800,
      buyer: 'PLN',
      contractNumber: 'CN-PLN-002',
      status: 'LOADING',
    },
  ];

  const createdSchedules = [];
  for (const s of schedules) {
    const sc = await prisma.sailingSchedule.create({ data: s });
    createdSchedules.push(sc);
  }

  const shipments = [
    {
      shipmentNumber: 'SHP-20251112-001',
      vesselId: created[0].id,
      sailingScheduleId: createdSchedules[0].id,
      shipmentDate: new Date('2025-11-12T08:00:00Z'),
      loadingDate: new Date('2025-11-12T08:30:00Z'),
      coalType: 'ICI-1',
      quantity: 9950,
      calorie: 5200,
      totalMoisture: 8.5,
      ashContent: 6.0,
      sulfurContent: 0.3,
      stockpileOrigin: 'ROM-PIT-01',
      buyer: 'PT Semen Indonesia',
      destination: 'Suralaya',
      surveyorName: 'Surveyor PTX',
      blNumber: 'BL-10001',
      coaNumber: 'COA-10001',
      freightCost: 12.5,
      totalFreight: 124375,
    },
    {
      shipmentNumber: 'SHP-20251110-002',
      vesselId: created[1].id,
      sailingScheduleId: createdSchedules[1].id,
      shipmentDate: new Date('2025-11-10T21:00:00Z'),
      loadingDate: new Date('2025-11-10T21:30:00Z'),
      coalType: 'ICI-2',
      quantity: 2750,
      calorie: 4800,
      totalMoisture: 9.2,
      ashContent: 7.1,
      sulfurContent: 0.35,
      stockpileOrigin: 'ROM-PIT-02',
      buyer: 'PLN',
      destination: 'Lontar',
      surveyorName: 'Surveyor AB',
      blNumber: 'BL-10002',
      coaNumber: 'COA-10002',
      freightCost: 15.0,
      totalFreight: 41250,
    },
  ];

  const createdShipments = [];
  for (const sh of shipments) {
    const sp = await prisma.shipmentRecord.create({ data: sh });
    createdShipments.push(sp);
  }

  const bargeLoads = [
    {
      loadingNumber: 'BLD-20251110-01',
      vesselCode: created[1].code,
      vesselName: created[1].name,
      loadingDate: new Date('2025-11-10T20:30:00Z'),
      shift: 'SHIFT_2',
      startTime: new Date('2025-11-10T20:30:00Z'),
      endTime: new Date('2025-11-10T23:00:00Z'),
      stockpileSource: 'Stockpile A',
      quantity: 2750,
      loaderUsed: 'Komatsu PC2000-1',
      bargeTrips: 6,
      weatherCondition: 'BERAWAN',
      tidalCondition: 'Normal',
      delayMinutes: 10,
      delayReason: 'Tide adjustment',
    },
  ];

  for (const bl of bargeLoads) {
    await prisma.bargeLoadingLog.create({ data: bl });
  }

  const berthings = [
    {
      jettyBerthId: createdJetties[0].id,
      vesselCode: created[0].code,
      vesselName: created[0].name,
      arrivalTime: new Date('2025-11-12T05:30:00Z'),
      berthingTime: new Date('2025-11-12T06:00:00Z'),
      loadingStart: new Date('2025-11-12T06:30:00Z'),
      loadingEnd: new Date('2025-11-12T18:00:00Z'),
      departureTime: new Date('2025-11-12T18:30:00Z'),
      draftArrival: 7.8,
      draftDeparture: 8.0,
      waitingTime: 45,
    },
  ];

  for (const b of berthings) {
    await prisma.berthingLog.create({ data: b });
  }

  return created;
};
