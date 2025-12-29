import { Request, Response } from 'express';
import { PermissionRepository } from './permission.repository';

export class PermissionController {
    private permissionRepo: PermissionRepository;

    constructor() {
        this.permissionRepo = new PermissionRepository();
    }

    grant = async (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const grantedBy = req.user.userId;
            const { userId, resource, action } = req.body;

            // In a real system, verify that 'grantedBy' actually owns the 'resource'

            const perm = await this.permissionRepo.grant({
                user: { connect: { id: userId } },
                resource,
                action,
                grantedBy
            });
            res.json(perm);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    revoke = async (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const requesterId = req.user.userId;
            const { id } = req.params;
            // Verify ownership logic would go here
            await this.permissionRepo.revoke(id);
            res.json({ message: 'Permission revoked' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    list = async (req: Request, res: Response) => {
        // @ts-ignore
        const userId = req.user.userId;
        const permissions = await this.permissionRepo.listMyPermissions(userId);
        res.json(permissions);
    }
}
