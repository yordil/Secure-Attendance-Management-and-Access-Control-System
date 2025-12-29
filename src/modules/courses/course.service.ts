import { CourseRepository } from './course.repository';
import { Prisma } from '@prisma/client';

export class CourseService {
    private courseRepository: CourseRepository;

    constructor() {
        this.courseRepository = new CourseRepository();
    }

    async createCourse(data: Prisma.CourseCreateInput) {
        return this.courseRepository.create(data);
    }

    async getCourses() {
        return this.courseRepository.findAll();
    }

    async assignTeacherToCourse(courseId: string, teacherId: string, semester: string) {
        return this.courseRepository.assignTeacher(courseId, teacherId, semester);
    }
}
