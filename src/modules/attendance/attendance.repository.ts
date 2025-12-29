import { Prisma, Attendance, AttendanceSession } from '@prisma/client';
import { prisma } from '../../config/database';

export class AttendanceRepository {
    async createSession(data: Prisma.AttendanceSessionCreateInput): Promise<AttendanceSession> {
        return prisma.attendanceSession.create({ data });
    }

    async findSessionById(id: string): Promise<AttendanceSession | null> {
        return prisma.attendanceSession.findUnique({ where: { id } });
    }

    async createAttendance(data: Prisma.AttendanceCreateInput): Promise<Attendance> {
        return prisma.attendance.create({ data });
    }

    async updateAttendance(id: string, data: Prisma.AttendanceUpdateInput): Promise<Attendance> {
        return prisma.attendance.update({ where: { id }, data });
    }

    async findByStudent(studentId: string): Promise<Attendance[]> {
        return prisma.attendance.findMany({
            where: { studentId },
            include: { session: { include: { course: true } } },
        });
    }

    async findByCourse(courseId: string): Promise<Attendance[]> {
        return prisma.attendance.findMany({
            where: { session: { courseId } },
            include: { student: true, session: true },
        });
    }
}
