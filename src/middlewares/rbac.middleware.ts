import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { Role } from '@prisma/client';

export const authorizeRoles = (...allowedRoles: Role[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
        }

        next();
    };
};
