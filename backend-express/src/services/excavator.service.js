import prisma from '../config/database.js';
import ApiError from '../utils/apiError.js';
import { getPaginationParams, calculatePagination } from '../utils/pagination.js';

export const excavatorService = {
  async getAll(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const where = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive === 'true';
    }

    if (query.search) {
      where.OR = [
        { code: { contains: query.search, mode: 'insensitive' } },
        { name: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [excavators, total] = await Promise.all([
      prisma.excavator.findMany({
        where,
        skip,
        take: limit,
        include: {
          loadingPoints: true,
        },
        orderBy: { code: 'asc' },
      }),
      prisma.excavator.count({ where }),
    ]);

    return {
      excavators,
      pagination: calculatePagination(page, limit, total),
    };
  },

  async getById(id) {
    const excavator = await prisma.excavator.findUnique({
      where: { id },
      include: {
        loadingPoints: {
          include: {
            queueLogs: {
              take: 10,
              orderBy: { timestamp: 'desc' },
            },
          },
        },
        haulingActivities: {
          take: 10,
          orderBy: { loadingStartTime: 'desc' },
          include: {
            truck: { select: { id: true, code: true, name: true } },
          },
        },
        maintenanceLogs: {
          take: 5,
          orderBy: { actualDate: 'desc' },
        },
      },
    });

    if (!excavator) {
      throw ApiError.notFound('Excavator not found');
    }

    return excavator;
  },

  async create(data) {
    const existingExcavator = await prisma.excavator.findUnique({
      where: { code: data.code },
    });

    if (existingExcavator) {
      throw ApiError.conflict('Excavator code already exists');
    }

    const excavator = await prisma.excavator.create({
      data,
    });

    return excavator;
  },

  async update(id, data) {
    const excavator = await prisma.excavator.findUnique({
      where: { id },
    });

    if (!excavator) {
      throw ApiError.notFound('Excavator not found');
    }

    if (data.code && data.code !== excavator.code) {
      const existingExcavator = await prisma.excavator.findUnique({
        where: { code: data.code },
      });

      if (existingExcavator) {
        throw ApiError.conflict('Excavator code already exists');
      }
    }

    const updatedExcavator = await prisma.excavator.update({
      where: { id },
      data,
    });

    return updatedExcavator;
  },

  async delete(id) {
    const excavator = await prisma.excavator.findUnique({
      where: { id },
    });

    if (!excavator) {
      throw ApiError.notFound('Excavator not found');
    }

    const activeHauling = await prisma.haulingActivity.findFirst({
      where: {
        excavatorId: id,
        status: { notIn: ['COMPLETED', 'CANCELLED'] },
      },
    });

    if (activeHauling) {
      throw ApiError.badRequest('Cannot delete excavator with active hauling activities');
    }

    await prisma.excavator.delete({
      where: { id },
    });

    return { message: 'Excavator deleted successfully' };
  },

  async updateStatus(id, status, location, reason) {
    const excavator = await prisma.excavator.findUnique({
      where: { id },
    });

    if (!excavator) {
      throw ApiError.notFound('Excavator not found');
    }

    const [updatedExcavator] = await Promise.all([
      prisma.excavator.update({
        where: { id },
        data: {
          status,
          ...(location && { currentLocation: location }),
        },
      }),
      prisma.equipmentStatusLog.create({
        data: {
          excavatorId: id,
          previousStatus: excavator.status,
          currentStatus: status,
          statusReason: reason,
          location,
        },
      }),
    ]);

    return updatedExcavator;
  },

  async getPerformance(id, startDate, endDate) {
    const excavator = await prisma.excavator.findUnique({
      where: { id },
    });

    if (!excavator) {
      throw ApiError.notFound('Excavator not found');
    }

    const where = {
      excavatorId: id,
      status: 'COMPLETED',
    };

    if (startDate || endDate) {
      where.loadingStartTime = {};
      if (startDate) where.loadingStartTime.gte = new Date(startDate);
      if (endDate) where.loadingStartTime.lte = new Date(endDate);
    }

    const [totalLoads, avgMetrics] = await Promise.all([
      prisma.haulingActivity.count({ where }),
      prisma.haulingActivity.aggregate({
        where,
        _avg: {
          loadingDuration: true,
          loadWeight: true,
        },
        _sum: {
          loadWeight: true,
        },
      }),
    ]);

    return {
      excavator: {
        id: excavator.id,
        code: excavator.code,
        name: excavator.name,
      },
      period: { startDate, endDate },
      totalLoads,
      avgLoadingDuration: avgMetrics._avg.loadingDuration || 0,
      avgLoadWeight: avgMetrics._avg.loadWeight || 0,
      totalLoadWeight: avgMetrics._sum.loadWeight || 0,
    };
  },
};
