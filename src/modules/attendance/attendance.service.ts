import { AttendanceRepository } from './attendance.repository';
import { Prisma, AttendanceStatus, Role } from '@prisma/client';
import { CourseRepository } from '../courses/course.repository';

export class AttendanceService {
    private attendanceRepository: AttendanceRepository;
    private courseRepository: CourseRepository; // To check assignments

    constructor() {
        this.attendanceRepository = new AttendanceRepository();
        this.courseRepository = new CourseRepository();
    }

    async createSession(courseId: string, teacherId: string, startTime: Date, endTime: Date) {
        // Verify teacher is assigned to course logic could go here
        return this.attendanceRepository.createSession({
            course: { connect: { id: courseId } },
            teacher: { connect: { id: teacherId } },
            startTime,
            endTime
        });
    }

    async markAttendance(sessionId: string, studentId: string, status: AttendanceStatus, teacherId: string) {
        const session = await this.attendanceRepository.findSessionById(sessionId);
        if (!session) throw new Error('Session not found');

        // Rule: Teacher must be the one who created the session or assigned to course
        if (session.teacherId !== teacherId) {
            // Strict enforcement: Only the session owner can mark attendance?
            // Or check course assignment. For now, strict session owner.
            throw new Error('Access denied: You are not the instructor for this session');
        }

        // Rule: Time-based RuBAC
        const now = new Date();
        if (now < session.startTime || now > session.endTime) {
            throw new Error('Attendance window is closed');
        }

        return this.attendanceRepository.createAttendance({
            session: { connect: { id: sessionId } },
            student: { connect: { id: studentId } },
            status,
        });
    }

    async getStudentAttendance(studentId: string) {
        return this.attendanceRepository.findByStudent(studentId);
    }

    async getCourseAttendance(courseId: string, requesterId: string, requesterRole: Role) {
        // ABAC/RBAC Check
        if (requesterRole === Role.STUDENT) {
            throw new Error('Access denied');
        }
        return this.attendanceRepository.findByCourse(courseId);
    }
}
