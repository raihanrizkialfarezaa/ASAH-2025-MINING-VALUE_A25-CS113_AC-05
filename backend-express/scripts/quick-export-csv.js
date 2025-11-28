const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function exportToCSV() {
  console.log('=== Starting Database Export to CSV ===\n');

  const exportDir = path.join(__dirname, '..', '..', 'mining-ops-ai-main', 'data');

  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  try {
    const [trucks, excavators, operators, roadSegments, vessels, sailingSchedules] =
      await Promise.all([
        prisma.truck.findMany(),
        prisma.excavator.findMany(),
        prisma.operator.findMany(),
        prisma.roadSegment.findMany(),
        prisma.vessel.findMany(),
        prisma.sailingSchedule.findMany({ include: { vessel: true } }),
      ]);

    const convertToCSV = (data) => {
      if (!data || data.length === 0) return '';
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map((obj) => {
        return Object.values(obj)
          .map((val) => {
            if (val === null || val === undefined) return '';
            if (typeof val === 'object') return JSON.stringify(val).replace(/"/g, '""');
            return `"${String(val).replace(/"/g, '""')}"`;
          })
          .join(',');
      });
      return [headers, ...rows].join('\n');
    };

    fs.writeFileSync(path.join(exportDir, 'trucks.csv'), convertToCSV(trucks));
    console.log(`✓ Exported ${trucks.length} trucks`);

    fs.writeFileSync(path.join(exportDir, 'excavators.csv'), convertToCSV(excavators));
    console.log(`✓ Exported ${excavators.length} excavators`);

    fs.writeFileSync(path.join(exportDir, 'operators.csv'), convertToCSV(operators));
    console.log(`✓ Exported ${operators.length} operators`);

    fs.writeFileSync(path.join(exportDir, 'road_segments.csv'), convertToCSV(roadSegments));
    console.log(`✓ Exported ${roadSegments.length} road segments`);

    fs.writeFileSync(path.join(exportDir, 'vessels.csv'), convertToCSV(vessels));
    console.log(`✓ Exported ${vessels.length} vessels`);

    fs.writeFileSync(path.join(exportDir, 'sailing_schedules.csv'), convertToCSV(sailingSchedules));
    console.log(`✓ Exported ${sailingSchedules.length} sailing schedules`);

    console.log(`\n✅ All data exported to: ${exportDir}`);
  } catch (error) {
    console.error('❌ Export failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportToCSV();
