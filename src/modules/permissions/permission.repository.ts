import { Prisma, Permission } from '@prisma/client';
import { prisma } from '../../config/database';

export class PermissionRepository {
    async grant(data: Prisma.PermissionCreateInput): Promise<Permission> {
        return prisma.permission.create({ data });
    }

    async revoke(id: string): Promise<Permission> {
        return prisma.permission.delete({ where: { id } });
    }

    async checkPermission(userId: string, resource: string, action: string): Promise<boolean> {
        const perm = await prisma.permission.findUnique({
            where: {
                userId_resource_action: {
                    userId,
                    resource,
                    action
                }
            }
        });
        return !!perm;
    }

    async listMyGrants(userId: string) {
        return prisma.permission.findMany({ where: { grantedBy: userId } });
    }

    async listMyPermissions(userId: string) {
        return prisma.permission.findMany({ where: { userId } });
    }
}
