import { User, Role } from '@prisma/client';
import { UserRepository } from './user.repository';
import { hashPassword } from '../../utils/crypto';
import { logger } from '../../utils/logger';

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(data: any): Promise<User> {
        // Basic validation or transformation
        if (data.password) {
            data.password = await hashPassword(data.password);
        }

        // Default role assignment logic if needed
        // e.g. check if it's the first user -> ADMIN

        return this.userRepository.create(data);
    }

    async getUserProfile(userId: string): Promise<User | null> {
        return this.userRepository.findById(userId);
    }

    async updateUser(userId: string, data: any): Promise<User> {
        return this.userRepository.update(userId, data);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findByEmail(email);
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.findAll();
    }
}
