import prisma from '../config/database.js';
import ApiError from '../utils/apiError.js';
import { getPaginationParams, calculatePagination } from '../utils/pagination.js';

export const vesselService = {
  async getAll(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const where = {};

    if (query.status) where.status = query.status;
    if (query.isActive !== undefined) where.isActive = query.isActive === 'true';
    if (query.search) {
      where.OR = [
        { code: { contains: query.search, mode: 'insensitive' } },
        { name: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [vessels, total] = await Promise.all([
      prisma.vessel.findMany({ where, skip, take: limit, orderBy: { code: 'asc' } }),
      prisma.vessel.count({ where }),
    ]);

    return { vessels, pagination: calculatePagination(page, limit, total) };
  },

  async getById(id) {
    const vessel = await prisma.vessel.findUnique({ where: { id } });
    if (!vessel) throw ApiError.notFound('Vessel not found');
    return vessel;
  },

  async create(data) {
    const existing = await prisma.vessel.findUnique({ where: { code: data.code } });
    if (existing) throw ApiError.conflict('Vessel code already exists');
    const vessel = await prisma.vessel.create({ data });
    return vessel;
  },

  async update(id, data) {
    const vessel = await prisma.vessel.findUnique({ where: { id } });
    if (!vessel) throw ApiError.notFound('Vessel not found');
    if (data.code && data.code !== vessel.code) {
      const existing = await prisma.vessel.findUnique({ where: { code: data.code } });
      if (existing) throw ApiError.conflict('Vessel code already exists');
    }
    const updated = await prisma.vessel.update({ where: { id }, data });
    return updated;
  },

  async delete(id) {
    const vessel = await prisma.vessel.findUnique({ where: { id } });
    if (!vessel) throw ApiError.notFound('Vessel not found');
    const linkedShipment = await prisma.shipmentRecord.findFirst({ where: { vesselId: id } });
    if (linkedShipment)
      throw ApiError.badRequest('Cannot delete vessel with existing shipment records');
    await prisma.vessel.delete({ where: { id } });
    return { message: 'Vessel deleted successfully' };
  },
};
