import prisma from '../config/database.js';
import ApiError from '../utils/apiError.js';

export const loadingPointService = {
  async getAll(query) {
    const where = {};

    if (query.miningSiteId) {
      where.miningSiteId = query.miningSiteId;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive === 'true';
    }

    const loadingPoints = await prisma.loadingPoint.findMany({
      where,
      include: {
        miningSite: {
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
            status: true,
          },
        },
      },
      orderBy: { code: 'asc' },
    });

    return loadingPoints;
  },

  async getById(id) {
    const loadingPoint = await prisma.loadingPoint.findUnique({
      where: { id },
      include: {
        miningSite: true,
        excavator: true,
        queueLogs: {
          take: 20,
          orderBy: { timestamp: 'desc' },
          include: {
            truck: {
              select: { code: true, name: true },
            },
          },
        },
      },
    });

    if (!loadingPoint) {
      throw ApiError.notFound('Loading point not found');
    }

    return loadingPoint;
  },

  async create(data) {
    const existingLoadingPoint = await prisma.loadingPoint.findUnique({
      where: { code: data.code },
    });

    if (existingLoadingPoint) {
      throw ApiError.conflict('Loading point code already exists');
    }

    const loadingPoint = await prisma.loadingPoint.create({
      data,
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

    return loadingPoint;
  },

  async update(id, data) {
    const loadingPoint = await prisma.loadingPoint.findUnique({
      where: { id },
    });

    if (!loadingPoint) {
      throw ApiError.notFound('Loading point not found');
    }

    if (data.code && data.code !== loadingPoint.code) {
      const existingLoadingPoint = await prisma.loadingPoint.findUnique({
        where: { code: data.code },
      });

      if (existingLoadingPoint) {
        throw ApiError.conflict('Loading point code already exists');
      }
    }

    const updatedLoadingPoint = await prisma.loadingPoint.update({
      where: { id },
      data,
    });

    return updatedLoadingPoint;
  },

  async delete(id) {
    const loadingPoint = await prisma.loadingPoint.findUnique({
      where: { id },
    });

    if (!loadingPoint) {
      throw ApiError.notFound('Loading point not found');
    }

    await prisma.loadingPoint.delete({
      where: { id },
    });

    return { message: 'Loading point deleted successfully' };
  },
};

export const dumpingPointService = {
  async getAll(query) {
    const where = {};

    if (query.miningSiteId) {
      where.miningSiteId = query.miningSiteId;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive === 'true';
    }

    const dumpingPoints = await prisma.dumpingPoint.findMany({
      where,
      include: {
        miningSite: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
      orderBy: { code: 'asc' },
    });

    return dumpingPoints;
  },

  async getById(id) {
    const dumpingPoint = await prisma.dumpingPoint.findUnique({
      where: { id },
      include: {
        miningSite: true,
        haulingActivities: {
          take: 20,
          orderBy: { dumpingStartTime: 'desc' },
          include: {
            truck: {
              select: { code: true, name: true },
            },
          },
        },
      },
    });

    if (!dumpingPoint) {
      throw ApiError.notFound('Dumping point not found');
    }

    return dumpingPoint;
  },

  async create(data) {
    const existingDumpingPoint = await prisma.dumpingPoint.findUnique({
      where: { code: data.code },
    });

    if (existingDumpingPoint) {
      throw ApiError.conflict('Dumping point code already exists');
    }

    const dumpingPoint = await prisma.dumpingPoint.create({
      data,
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

    return dumpingPoint;
  },

  async update(id, data) {
    const dumpingPoint = await prisma.dumpingPoint.findUnique({
      where: { id },
    });

    if (!dumpingPoint) {
      throw ApiError.notFound('Dumping point not found');
    }

    if (data.code && data.code !== dumpingPoint.code) {
      const existingDumpingPoint = await prisma.dumpingPoint.findUnique({
        where: { code: data.code },
      });

      if (existingDumpingPoint) {
        throw ApiError.conflict('Dumping point code already exists');
      }
    }

    const updatedDumpingPoint = await prisma.dumpingPoint.update({
      where: { id },
      data,
    });

    return updatedDumpingPoint;
  },

  async delete(id) {
    const dumpingPoint = await prisma.dumpingPoint.findUnique({
      where: { id },
    });

    if (!dumpingPoint) {
      throw ApiError.notFound('Dumping point not found');
    }

    await prisma.dumpingPoint.delete({
      where: { id },
    });

    return { message: 'Dumping point deleted successfully' };
  },
};

export const roadSegmentService = {
  async getAll(query) {
    const where = {};

    if (query.miningSiteId) {
      where.miningSiteId = query.miningSiteId;
    }

    if (query.condition) {
      where.condition = query.condition;
    }

    const roadSegments = await prisma.roadSegment.findMany({
      where,
      include: {
        miningSite: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
      orderBy: { code: 'asc' },
    });

    return roadSegments;
  },

  async getById(id) {
    const roadSegment = await prisma.roadSegment.findUnique({
      where: { id },
      include: {
        miningSite: true,
      },
    });

    if (!roadSegment) {
      throw ApiError.notFound('Road segment not found');
    }

    return roadSegment;
  },

  async create(data) {
    const existingRoadSegment = await prisma.roadSegment.findUnique({
      where: { code: data.code },
    });

    if (existingRoadSegment) {
      throw ApiError.conflict('Road segment code already exists');
    }

    const roadSegment = await prisma.roadSegment.create({
      data,
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

    return roadSegment;
  },

  async update(id, data) {
    const roadSegment = await prisma.roadSegment.findUnique({
      where: { id },
    });

    if (!roadSegment) {
      throw ApiError.notFound('Road segment not found');
    }

    if (data.code && data.code !== roadSegment.code) {
      const existingRoadSegment = await prisma.roadSegment.findUnique({
        where: { code: data.code },
      });

      if (existingRoadSegment) {
        throw ApiError.conflict('Road segment code already exists');
      }
    }

    const updatedRoadSegment = await prisma.roadSegment.update({
      where: { id },
      data,
    });

    return updatedRoadSegment;
  },

  async delete(id) {
    const roadSegment = await prisma.roadSegment.findUnique({
      where: { id },
    });

    if (!roadSegment) {
      throw ApiError.notFound('Road segment not found');
    }

    await prisma.roadSegment.delete({
      where: { id },
    });

    return { message: 'Road segment deleted successfully' };
  },
};
