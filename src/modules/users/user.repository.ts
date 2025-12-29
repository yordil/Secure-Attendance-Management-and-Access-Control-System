import { Prisma, User, Role } from '@prisma/client';
import { prisma } from '../../config/database';

export class UserRepository {
    async create(data: Prisma.UserCreateInput): Promise<User> {
        return prisma.user.create({ data });
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } });
    }

    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } });
    }

    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return prisma.user.update({
            where: { id },
            data,
        });
    }

    async findAll(params?: { skip?: number; take?: number; where?: Prisma.UserWhereInput }): Promise<User[]> {
        const { skip, take, where } = params || {};
        return prisma.user.findMany({
            skip,
            take,
            where,
        });
    }
}
