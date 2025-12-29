import { Prisma, AuditLog } from '@prisma/client';
import { prisma } from '../../config/database';

export class AuditRepository {
    async create(data: Prisma.AuditLogCreateInput): Promise<AuditLog> {
        return prisma.auditLog.create({ data });
    }

    async findAll(): Promise<AuditLog[]> {
        return prisma.auditLog.findMany({
            orderBy: { timestamp: 'desc' },
            include: { user: { select: { email: true, role: true } } }
        });
    }
}
