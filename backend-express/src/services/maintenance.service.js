import prisma from '../config/database.js';
import ApiError from '../utils/apiError.js';
import { getPaginationParams, calculatePagination } from '../utils/pagination.js';

export const maintenanceService = {
  async getAll(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const where = {};

    if (query.truckId) {
      where.truckId = query.truckId;
    }

    if (query.excavatorId) {
      where.excavatorId = query.excavatorId;
    }

    if (query.supportEquipmentId) {
      where.supportEquipmentId = query.supportEquipmentId;
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.startDate || query.endDate) {
      where.actualDate = {};
      if (query.startDate) where.actualDate.gte = new Date(query.startDate);
      if (query.endDate) where.actualDate.lte = new Date(query.endDate);
    }

    const [logs, total] = await Promise.all([
      prisma.maintenanceLog.findMany({
        where,
        skip,
        take: limit,
        include: {
          truck: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
          excavator: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
          supportEquipment: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
        },
        orderBy: { actualDate: 'desc' },
      }),
      prisma.maintenanceLog.count({ where }),
    ]);

    return {
      logs,
      pagination: calculatePagination(page, limit, total),
    };
  },

  async getById(id) {
    const log = await prisma.maintenanceLog.findUnique({
      where: { id },
      include: {
        truck: true,
        excavator: true,
        supportEquipment: true,
      },
    });

    if (!log) {
      throw ApiError.notFound('Maintenance log not found');
    }

    return log;
  },

  async create(data) {
    const equipmentCount = [data.truckId, data.excavatorId, data.supportEquipmentId].filter(
      Boolean
    ).length;

    if (equipmentCount !== 1) {
      throw ApiError.badRequest('Exactly one equipment must be specified');
    }

    const log = await prisma.maintenanceLog.create({
      data,
      include: {
        truck: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        excavator: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        supportEquipment: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    return log;
  },

  async update(id, data) {
    const log = await prisma.maintenanceLog.findUnique({
      where: { id },
    });

    if (!log) {
      throw ApiError.notFound('Maintenance log not found');
    }

    const updatedLog = await prisma.maintenanceLog.update({
      where: { id },
      data,
    });

    return updatedLog;
  },

  async delete(id) {
    const log = await prisma.maintenanceLog.findUnique({
      where: { id },
    });

    if (!log) {
      throw ApiError.notFound('Maintenance log not found');
    }

    await prisma.maintenanceLog.delete({
      where: { id },
    });

    return { message: 'Maintenance log deleted successfully' };
  },

  async getUpcoming(days = 7) {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const logs = await prisma.maintenanceLog.findMany({
      where: {
        scheduledDate: {
          gte: now,
          lte: futureDate,
        },
        status: 'SCHEDULED',
      },
      include: {
        truck: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        excavator: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        supportEquipment: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
      orderBy: { scheduledDate: 'asc' },
    });

    return logs;
  },
};
