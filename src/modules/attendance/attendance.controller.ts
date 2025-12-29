import { Request, Response } from 'express';
import { AttendanceService } from './attendance.service';
import { z } from 'zod';
import { Role } from '@prisma/client';

const createSessionSchema = z.object({
    courseId: z.string(),
    startTime: z.string().transform(str => new Date(str)),
    endTime: z.string().transform(str => new Date(str)),
});

const markAttendanceSchema = z.object({
    sessionId: z.string(),
    studentId: z.string(),
    status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
});

export class AttendanceController {
    private attendanceService: AttendanceService;

    constructor() {
        this.attendanceService = new AttendanceService();
    }

    createSession = async (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const teacherId = req.user.userId;
            const { courseId, startTime, endTime } = createSessionSchema.parse(req.body);
            const session = await this.attendanceService.createSession(courseId, teacherId, startTime, endTime);
            res.status(201).json(session);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    mark = async (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const teacherId = req.user.userId;
            const { sessionId, studentId, status } = markAttendanceSchema.parse(req.body);
            const record = await this.attendanceService.markAttendance(sessionId, studentId, status, teacherId);
            res.status(201).json(record);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    getMyAttendance = async (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const studentId = req.user.userId;
            const records = await this.attendanceService.getStudentAttendance(studentId);
            res.json(records);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
