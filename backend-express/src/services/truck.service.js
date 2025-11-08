import prisma from '../config/database.js';
import ApiError from '../utils/apiError.js';
import { getPaginationParams, calculatePagination } from '../utils/pagination.js';
import { TRUCK_STATUS } from '../config/constants.js';

export const truckService = {
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

    const [trucks, total] = await Promise.all([
      prisma.truck.findMany({
        where,
        skip,
        take: limit,
        include: {
          currentOperator: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                },
              },
            },
          },
        },
        orderBy: { code: 'asc' },
      }),
      prisma.truck.count({ where }),
    ]);

    return {
      trucks,
      pagination: calculatePagination(page, limit, total),
    };
  },

  async getById(id) {
    const truck = await prisma.truck.findUnique({
      where: { id },
      include: {
        currentOperator: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                username: true,
              },
            },
          },
        },
        haulingActivities: {
          take: 10,
          orderBy: { loadingStartTime: 'desc' },
          include: {
            loadingPoint: true,
            dumpingPoint: true,
          },
        },
        maintenanceLogs: {
          take: 5,
          orderBy: { actualDate: 'desc' },
        },
      },
    });

    if (!truck) {
      throw ApiError.notFound('Truck not found');
    }

    return truck;
  },

  async create(data) {
    const existingTruck = await prisma.truck.findUnique({
      where: { code: data.code },
    });

    if (existingTruck) {
      throw ApiError.conflict('Truck code already exists');
    }

    const truck = await prisma.truck.create({
      data,
    });

    return truck;
  },

  async update(id, data) {
    const truck = await prisma.truck.findUnique({
      where: { id },
    });

    if (!truck) {
      throw ApiError.notFound('Truck not found');
    }

    if (data.code && data.code !== truck.code) {
      const existingTruck = await prisma.truck.findUnique({
        where: { code: data.code },
      });

      if (existingTruck) {
        throw ApiError.conflict('Truck code already exists');
      }
    }

    const updatedTruck = await prisma.truck.update({
      where: { id },
      data,
    });

    return updatedTruck;
  },

  async delete(id) {
    const truck = await prisma.truck.findUnique({
      where: { id },
    });

    if (!truck) {
      throw ApiError.notFound('Truck not found');
    }

    const activeHauling = await prisma.haulingActivity.findFirst({
      where: {
        truckId: id,
        status: { notIn: ['COMPLETED', 'CANCELLED'] },
      },
    });

    if (activeHauling) {
      throw ApiError.badRequest('Cannot delete truck with active hauling activities');
    }

    await prisma.truck.delete({
      where: { id },
    });

    return { message: 'Truck deleted successfully' };
  },

  async updateStatus(id, status, location, reason) {
    const truck = await prisma.truck.findUnique({
      where: { id },
    });

    if (!truck) {
      throw ApiError.notFound('Truck not found');
    }

    const [updatedTruck] = await Promise.all([
      prisma.truck.update({
        where: { id },
        data: {
          status,
          ...(location && { currentLocation: location }),
        },
      }),
      prisma.equipmentStatusLog.create({
        data: {
          truckId: id,
          previousStatus: truck.status,
          currentStatus: status,
          statusReason: reason,
          location,
        },
      }),
    ]);

    return updatedTruck;
  },

  async getByStatus(status) {
    const trucks = await prisma.truck.findMany({
      where: { status, isActive: true },
      include: {
        currentOperator: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
      orderBy: { code: 'asc' },
    });

    return trucks;
  },

  async getPerformance(id, startDate, endDate) {
    const truck = await prisma.truck.findUnique({
      where: { id },
    });

    if (!truck) {
      throw ApiError.notFound('Truck not found');
    }

    const where = {
      truckId: id,
      status: 'COMPLETED',
    };

    if (startDate || endDate) {
      where.loadingStartTime = {};
      if (startDate) where.loadingStartTime.gte = new Date(startDate);
      if (endDate) where.loadingStartTime.lte = new Date(endDate);
    }

    const [haulingActivities, totalTrips, avgMetrics] = await Promise.all([
      prisma.haulingActivity.findMany({
        where,
        select: {
          totalCycleTime: true,
          loadWeight: true,
          fuelConsumed: true,
          distance: true,
          isDelayed: true,
          delayMinutes: true,
        },
      }),
      prisma.haulingActivity.count({ where }),
      prisma.haulingActivity.aggregate({
        where,
        _avg: {
          totalCycleTime: true,
          loadWeight: true,
          fuelConsumed: true,
          loadEfficiency: true,
        },
        _sum: {
          loadWeight: true,
          distance: true,
          fuelConsumed: true,
        },
      }),
    ]);

    const delayedTrips = haulingActivities.filter((h) => h.isDelayed).length;
    const delayRate = totalTrips > 0 ? (delayedTrips / totalTrips) * 100 : 0;

    return {
      truck: {
        id: truck.id,
        code: truck.code,
        name: truck.name,
      },
      period: { startDate, endDate },
      totalTrips,
      delayedTrips,
      delayRate: parseFloat(delayRate.toFixed(2)),
      avgCycleTime: avgMetrics._avg.totalCycleTime || 0,
      avgLoadWeight: avgMetrics._avg.loadWeight || 0,
      avgLoadEfficiency: avgMetrics._avg.loadEfficiency || 0,
      totalLoadWeight: avgMetrics._sum.loadWeight || 0,
      totalDistance: avgMetrics._sum.distance || 0,
      totalFuelConsumed: avgMetrics._sum.fuelConsumed || 0,
    };
  },

  async assignOperator(truckId, operatorId) {
    const [truck, operator] = await Promise.all([
      prisma.truck.findUnique({ where: { id: truckId } }),
      prisma.operator.findUnique({ where: { id: operatorId } }),
    ]);

    if (!truck) {
      throw ApiError.notFound('Truck not found');
    }

    if (!operator) {
      throw ApiError.notFound('Operator not found');
    }

    if (operator.status !== 'ACTIVE') {
      throw ApiError.badRequest('Operator is not available');
    }

    if (truck.status !== TRUCK_STATUS.IDLE && truck.status !== TRUCK_STATUS.STANDBY) {
      throw ApiError.badRequest('Truck must be in IDLE or STANDBY status to assign operator');
    }

    const updatedTruck = await prisma.truck.update({
      where: { id: truckId },
      data: { currentOperatorId: operatorId },
      include: {
        currentOperator: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
    });

    return updatedTruck;
  },
};
