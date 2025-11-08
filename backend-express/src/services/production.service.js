import prisma from '../config/database.js';
import ApiError from '../utils/apiError.js';
import { getPaginationParams, calculatePagination } from '../utils/pagination.js';

export const productionService = {
  async getAll(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const where = {};

    if (query.miningSiteId) {
      where.miningSiteId = query.miningSiteId;
    }

    if (query.startDate || query.endDate) {
      where.recordDate = {};
      if (query.startDate) where.recordDate.gte = new Date(query.startDate);
      if (query.endDate) where.recordDate.lte = new Date(query.endDate);
    }

    const [records, total] = await Promise.all([
      prisma.productionRecord.findMany({
        where,
        skip,
        take: limit,
        include: {
          miningSite: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
        },
        orderBy: { recordDate: 'desc' },
      }),
      prisma.productionRecord.count({ where }),
    ]);

    return {
      records,
      pagination: calculatePagination(page, limit, total),
    };
  },

  async getById(id) {
    const record = await prisma.productionRecord.findUnique({
      where: { id },
      include: {
        miningSite: true,
      },
    });

    if (!record) {
      throw ApiError.notFound('Production record not found');
    }

    return record;
  },

  async create(data) {
    const achievement =
      data.targetTonnage > 0 ? (data.actualTonnage / data.targetTonnage) * 100 : 0;

    const record = await prisma.productionRecord.create({
      data: {
        ...data,
        achievement,
      },
      include: {
        miningSite: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    return record;
  },

  async update(id, data) {
    const record = await prisma.productionRecord.findUnique({
      where: { id },
    });

    if (!record) {
      throw ApiError.notFound('Production record not found');
    }

    const targetTonnage = data.targetTonnage ?? record.targetTonnage;
    const actualTonnage = data.actualTonnage ?? record.actualTonnage;
    const achievement = targetTonnage > 0 ? (actualTonnage / targetTonnage) * 100 : 0;

    const updatedRecord = await prisma.productionRecord.update({
      where: { id },
      data: {
        ...data,
        achievement,
      },
    });

    return updatedRecord;
  },

  async delete(id) {
    const record = await prisma.productionRecord.findUnique({
      where: { id },
    });

    if (!record) {
      throw ApiError.notFound('Production record not found');
    }

    await prisma.productionRecord.delete({
      where: { id },
    });

    return { message: 'Production record deleted successfully' };
  },

  async getStatistics(miningSiteId, startDate, endDate) {
    const where = {};

    if (miningSiteId) {
      where.miningSiteId = miningSiteId;
    }

    if (startDate || endDate) {
      where.recordDate = {};
      if (startDate) where.recordDate.gte = new Date(startDate);
      if (endDate) where.recordDate.lte = new Date(endDate);
    }

    const aggregates = await prisma.productionRecord.aggregate({
      where,
      _sum: {
        actualProduction: true,
        targetProduction: true,
        totalTrips: true,
      },
      _avg: {
        achievement: true,
        avgCycleTime: true,
      },
      _count: {
        id: true,
      },
    });

    return {
      totalProduction: aggregates._sum.actualProduction || 0,
      avgAchievement: aggregates._avg.achievement || 0,
      totalTrips: aggregates._sum.totalTrips || 0,
      avgCycleTime: aggregates._avg.avgCycleTime || 0,
      totalRecords: aggregates._count.id || 0,
    };
  },
};
