import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { User } from '@prisma/client';

export type PolicyCheck = (user: User, resourceId?: string) => Promise<boolean>;

export const checkPolicy = (policy: PolicyCheck) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        try {
            const resourceId = req.params.id; // Assuming resource ID is in params if needed
            const allowed = await policy(req.user, resourceId);

            if (!allowed) {
                return res.status(403).json({ error: 'Access denied: Policy violation' });
            }

            next();
        } catch (error) {
            return res.status(500).json({ error: 'Policy evaluation failed' });
        }
    };
};
