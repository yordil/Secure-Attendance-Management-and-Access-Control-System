import { Request, Response } from 'express';
import { CourseService } from './course.service';
import { z } from 'zod';

const createCourseSchema = z.object({
    code: z.string(),
    name: z.string(),
    department: z.string(),
    credits: z.number().int(),
});

const assignTeacherSchema = z.object({
    teacherId: z.string(),
    semester: z.string(),
});

export class CourseController {
    private courseService: CourseService;

    constructor() {
        this.courseService = new CourseService();
    }

    create = async (req: Request, res: Response) => {
        try {
            const data = createCourseSchema.parse(req.body);
            const course = await this.courseService.createCourse(data);
            res.status(201).json(course);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    list = async (req: Request, res: Response) => {
        const courses = await this.courseService.getCourses();
        res.json(courses);
    };

    assignTeacher = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { teacherId, semester } = assignTeacherSchema.parse(req.body);
            const assignment = await this.courseService.assignTeacherToCourse(id, teacherId, semester);
            res.status(201).json(assignment);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };
}
