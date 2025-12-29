import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export const checkTimeAccess = (startHour: number, endHour: number) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const now = new Date();
        const currentHour = now.getHours();

        if (currentHour < startHour || currentHour >= endHour) {
            // Allow Admins/Directors to bypass time restrictions?
            if (req.user?.role === 'ADMIN' || req.user?.role === 'DIRECTOR') {
                return next();
            }
            return res.status(403).json({ error: 'Access denied: Outside of allowed hours' });
        }

        next();
    };
};
