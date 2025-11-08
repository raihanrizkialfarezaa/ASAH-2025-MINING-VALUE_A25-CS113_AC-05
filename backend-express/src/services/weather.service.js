import prisma from '../config/database.js';
import ApiError from '../utils/apiError.js';
import { getPaginationParams, calculatePagination } from '../utils/pagination.js';

export const weatherService = {
  async getAll(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const where = {};

    if (query.miningSiteId) {
      where.miningSiteId = query.miningSiteId;
    }

    if (query.condition) {
      where.condition = query.condition;
    }

    if (query.riskLevel) {
      where.riskLevel = query.riskLevel;
    }

    if (query.isOperational !== undefined) {
      where.isOperational = query.isOperational === 'true';
    }

    if (query.startDate || query.endDate) {
      where.timestamp = {};
      if (query.startDate) where.timestamp.gte = new Date(query.startDate);
      if (query.endDate) where.timestamp.lte = new Date(query.endDate);
    }

    const [logs, total] = await Promise.all([
      prisma.weatherLog.findMany({
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
        orderBy: { timestamp: 'desc' },
      }),
      prisma.weatherLog.count({ where }),
    ]);

    return {
      logs,
      pagination: calculatePagination(page, limit, total),
    };
  },

  async getById(id) {
    const log = await prisma.weatherLog.findUnique({
      where: { id },
      include: {
        miningSite: true,
      },
    });

    if (!log) {
      throw ApiError.notFound('Weather log not found');
    }

    return log;
  },

  async create(data) {
    const riskLevel = this.calculateRiskLevel(data);
    const isOperational = this.assessOperational(data);

    const log = await prisma.weatherLog.create({
      data: {
        ...data,
        riskLevel,
        isOperational,
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

    return log;
  },

  async update(id, data) {
    const log = await prisma.weatherLog.findUnique({
      where: { id },
    });

    if (!log) {
      throw ApiError.notFound('Weather log not found');
    }

    const riskLevel = data.condition ? this.calculateRiskLevel(data) : undefined;
    const isOperational = data.condition ? this.assessOperational(data) : undefined;

    const updatedLog = await prisma.weatherLog.update({
      where: { id },
      data: {
        ...data,
        ...(riskLevel && { riskLevel }),
        ...(isOperational !== undefined && { isOperational }),
      },
    });

    return updatedLog;
  },

  async delete(id) {
    const log = await prisma.weatherLog.findUnique({
      where: { id },
    });

    if (!log) {
      throw ApiError.notFound('Weather log not found');
    }

    await prisma.weatherLog.delete({
      where: { id },
    });

    return { message: 'Weather log deleted successfully' };
  },

  async getLatest(miningSiteId) {
    const where = {};
    if (miningSiteId) {
      where.miningSiteId = miningSiteId;
    }

    const latestLog = await prisma.weatherLog.findFirst({
      where,
      orderBy: { timestamp: 'desc' },
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

    if (!latestLog) {
      throw ApiError.notFound('No weather logs found');
    }

    return latestLog;
  },

  calculateRiskLevel(data) {
    const { condition, windSpeed, rainfall, visibility } = data;

    if (condition === 'BADAI' || rainfall > 50 || (windSpeed && windSpeed > 60)) {
      return 'CRITICAL';
    }

    if (condition === 'HUJAN_LEBAT' || rainfall > 20 || visibility === 'VERY_POOR') {
      return 'HIGH';
    }

    if (condition === 'HUJAN_SEDANG' || condition === 'KABUT' || visibility === 'POOR') {
      return 'MEDIUM';
    }

    return 'LOW';
  },

  assessOperational(data) {
    const { condition, windSpeed, rainfall, visibility } = data;

    if (
      condition === 'BADAI' ||
      rainfall > 50 ||
      (windSpeed && windSpeed > 60) ||
      visibility === 'VERY_POOR'
    ) {
      return false;
    }

    if (condition === 'HUJAN_LEBAT' && visibility === 'POOR') {
      return false;
    }

    return true;
  },
};
