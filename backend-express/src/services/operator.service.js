import prisma from '../config/database.js';
import ApiError from '../utils/apiError.js';
import { getPaginationParams, calculatePagination } from '../utils/pagination.js';

export const operatorService = {
  async getAll(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const where = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { user: { fullName: { contains: query.search, mode: 'insensitive' } } },
        { user: { email: { contains: query.search, mode: 'insensitive' } } },
        { employeeNumber: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [operators, total] = await Promise.all([
      prisma.operator.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              isActive: true,
              role: true,
            },
          },
        },
        orderBy: { user: { fullName: 'asc' } },
      }),
      prisma.operator.count({ where }),
    ]);

    return {
      operators,
      pagination: calculatePagination(page, limit, total),
    };
  },

  async getById(id) {
    const operator = await prisma.operator.findUnique({
      where: { id },
      include: {
        user: true,
        trucks: {
          select: {
            id: true,
            code: true,
            name: true,
            status: true,
          },
        },
        haulingActivities: {
          take: 10,
          orderBy: { loadingStartTime: 'desc' },
          include: {
            truck: { select: { code: true, name: true } },
            excavator: { select: { code: true, name: true } },
          },
        },
      },
    });

    if (!operator) {
      throw ApiError.notFound('Operator not found');
    }

    return operator;
  },

  async create(data) {
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    if (user.role !== 'OPERATOR') {
      throw ApiError.badRequest('User must have OPERATOR role');
    }

    const existingOperator = await prisma.operator.findUnique({
      where: { userId: data.userId },
    });

    if (existingOperator) {
      throw ApiError.conflict('Operator already exists for this user');
    }

    const operator = await prisma.operator.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return operator;
  },

  async update(id, data) {
    const operator = await prisma.operator.findUnique({
      where: { id },
    });

    if (!operator) {
      throw ApiError.notFound('Operator not found');
    }

    const updatedOperator = await prisma.operator.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return updatedOperator;
  },

  async delete(id) {
    const operator = await prisma.operator.findUnique({
      where: { id },
    });

    if (!operator) {
      throw ApiError.notFound('Operator not found');
    }

    const activeHauling = await prisma.haulingActivity.findFirst({
      where: {
        operatorId: id,
        status: { notIn: ['COMPLETED', 'CANCELLED'] },
      },
    });

    if (activeHauling) {
      throw ApiError.badRequest('Cannot delete operator with active hauling activities');
    }

    await prisma.operator.delete({
      where: { id },
    });

    return { message: 'Operator deleted successfully' };
  },

  async getPerformance(id, startDate, endDate) {
    const operator = await prisma.operator.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    if (!operator) {
      throw ApiError.notFound('Operator not found');
    }

    const where = {
      operatorId: id,
      status: 'COMPLETED',
    };

    if (startDate || endDate) {
      where.loadingStartTime = {};
      if (startDate) where.loadingStartTime.gte = new Date(startDate);
      if (endDate) where.loadingStartTime.lte = new Date(endDate);
    }

    const [totalTrips, metrics] = await Promise.all([
      prisma.haulingActivity.count({ where }),
      prisma.haulingActivity.aggregate({
        where,
        _avg: {
          cycleTime: true,
          loadWeight: true,
        },
        _sum: {
          loadWeight: true,
        },
      }),
    ]);

    return {
      operator: {
        id: operator.id,
        name: operator.user.fullName,
      },
      period: { startDate, endDate },
      totalTrips,
      avgCycleTime: metrics._avg.cycleTime || 0,
      avgLoadWeight: metrics._avg.loadWeight || 0,
      totalLoadWeight: metrics._sum.loadWeight || 0,
    };
  },
};
