import prisma from '../config/database.js';
import ApiError from '../utils/apiError.js';
import { getPaginationParams, calculatePagination } from '../utils/pagination.js';

export const miningSiteService = {
  async getAll(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const where = {};

    if (query.isActive !== undefined) {
      where.isActive = query.isActive === 'true';
    }

    if (query.search) {
      where.OR = [
        { code: { contains: query.search, mode: 'insensitive' } },
        { name: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [sites, total] = await Promise.all([
      prisma.miningSite.findMany({
        where,
        skip,
        take: limit,
        include: {
          loadingPoints: true,
          dumpingPoints: true,
          weatherLogs: {
            take: 1,
            orderBy: { timestamp: 'desc' },
          },
        },
        orderBy: { code: 'asc' },
      }),
      prisma.miningSite.count({ where }),
    ]);

    return {
      sites,
      pagination: calculatePagination(page, limit, total),
    };
  },

  async getById(id) {
    const site = await prisma.miningSite.findUnique({
      where: { id },
      include: {
        loadingPoints: true,
        dumpingPoints: true,
        roadSegments: true,
        weatherLogs: {
          take: 10,
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!site) {
      throw ApiError.notFound('Mining site not found');
    }

    return site;
  },

  async create(data) {
    const existingSite = await prisma.miningSite.findUnique({
      where: { code: data.code },
    });

    if (existingSite) {
      throw ApiError.conflict('Mining site code already exists');
    }

    const site = await prisma.miningSite.create({
      data,
    });

    return site;
  },

  async update(id, data) {
    const site = await prisma.miningSite.findUnique({
      where: { id },
    });

    if (!site) {
      throw ApiError.notFound('Mining site not found');
    }

    if (data.code && data.code !== site.code) {
      const existingSite = await prisma.miningSite.findUnique({
        where: { code: data.code },
      });

      if (existingSite) {
        throw ApiError.conflict('Mining site code already exists');
      }
    }

    const updatedSite = await prisma.miningSite.update({
      where: { id },
      data,
    });

    return updatedSite;
  },

  async delete(id) {
    const site = await prisma.miningSite.findUnique({
      where: { id },
    });

    if (!site) {
      throw ApiError.notFound('Mining site not found');
    }

    await prisma.miningSite.delete({
      where: { id },
    });

    return { message: 'Mining site deleted successfully' };
  },
};
