import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { z } from 'zod';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string(),
    lastName: z.string(),
    // role: z.enum(['DIRECTOR', 'TEACHER', 'STUDENT']).optional(), // Optional: let admin assign roles later or default to STUDENT
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    register = async (req: Request, res: Response) => {
        try {
            const data = registerSchema.parse(req.body);
            const result = await this.authService.register(data);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const data = loginSchema.parse(req.body);
            const result = await this.authService.login(data);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    };

    refreshToken = async (req: Request, res: Response) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                throw new Error('Refresh token required');
            }
            const result = await this.authService.refreshToken(refreshToken);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    };

    generateMfa = async (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const userId = req.user.userId;
            const result = await this.authService.generateMfaSecret(userId);
            res.json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    verifyMfa = async (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const userId = req.user.userId;
            const { token } = req.body;
            const isValid = await this.authService.verifyMfaWait(userId, token);
            if (isValid) {
                res.json({ message: 'MFA Verified and Enabled' });
            } else {
                res.status(400).json({ error: 'Invalid Token' });
            }
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };
}
