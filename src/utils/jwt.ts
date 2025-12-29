import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '@prisma/client';

export const signAccessToken = (user: User) => {
    return jwt.sign(
        { userId: user.id, role: user.role, email: user.email },
        env.JWT_SECRET,
        { expiresIn: '15m' }
    );
};

export const signRefreshToken = (user: User) => {
    return jwt.sign(
        { userId: user.id, role: user.role, email: user.email },
        env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
};

export const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    } catch (error) {
        return null;
    }
};

export const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
    } catch (error) {
        return null;
    }
};
