import { Request, Response } from 'express';
import { UserService } from './user.service';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    getProfile = async (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const userId = req.user.userId;
            const user = await this.userService.getUserProfile(userId);
            res.json(user);
        } catch (error: any) {
            res.status(404).json({ error: 'User not found' });
        }
    }

    updateProfile = async (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const userId = req.user.userId;
            // Prevent role/email updates here for security
            const { firstName, lastName, department } = req.body;
            const updated = await this.userService.updateUser(userId, { firstName, lastName, department });
            res.json(updated);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
