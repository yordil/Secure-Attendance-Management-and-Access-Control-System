import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { User, Role } from '@prisma/client';

// Simple mapping of Role to Clearance Level
// 0: Public, 1: Internal, 2: Confidential
const RoleClearance = {
    [Role.STUDENT]: 1, // Access to Internal (and own Confidential via ABAC)
    [Role.TEACHER]: 1,
    [Role.DIRECTOR]: 2,
    [Role.ADMIN]: 3,
};

const DataClassificationLevel = {
    PUBLIC: 0,
    INTERNAL: 1,
    CONFIDENTIAL: 2,
};

export const enforceMac = (requiredLevel: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL') => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const userRole = req.user.role as Role;
        const userClearance = RoleClearance[userRole] || 0;
        const resourceLevel = DataClassificationLevel[requiredLevel];

        if (userClearance < resourceLevel) {
            // Exception: Students accessing their own data (handled in ABAC/Service usually, but we can verify here if needed)
            // For strict MAC, we deny.
            // We will rely on ABAC for exceptions.
            return res.status(403).json({ error: 'Access denied: Security Clearance too low' });
        }

        next();
    };
};
