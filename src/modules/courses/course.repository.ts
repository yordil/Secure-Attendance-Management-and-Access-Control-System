import { Prisma, Course } from '@prisma/client';
import { prisma } from '../../config/database';

export class CourseRepository {
    async create(data: Prisma.CourseCreateInput): Promise<Course> {
        return prisma.course.create({ data });
    }

    async findById(id: string): Promise<Course | null> {
        return prisma.course.findUnique({ where: { id } });
    }

    async findAll(): Promise<Course[]> {
        return prisma.course.findMany();
    }

    async assignTeacher(courseId: string, teacherId: string, semester: string) {
        return prisma.teacherAssignment.create({
            data: {
                courseId,
                teacherId,
                semester,
            },
        });
    }
}
