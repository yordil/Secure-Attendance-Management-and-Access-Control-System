import { Role, AttendanceStatus } from './src/generated/prisma/client';
import * as bcrypt from 'bcrypt';

// We need to import the prisma instance from config or create a new one for seeding
// The seed script usually runs with ts-node
import { prisma } from './src/config/database';

async function main() {
    console.log('Start seeding ...');

    const password = await bcrypt.hash('password123', 10);

    // 1. Create Users
    const usersData = [
        {
            email: 'zekarias@gmail.com',
            firstName: 'Zekarias',
            lastName: 'Director',
            role: Role.DIRECTOR,
            department: 'Administration',
        },
        {
            email: 'yordanos@gmail.com',
            firstName: 'Yordanos',
            lastName: 'Admin',
            role: Role.ADMIN,
            department: 'IT',
        },
        {
            email: 'yonathan@gmail.com',
            firstName: 'Yonathan',
            lastName: 'Teacher',
            role: Role.TEACHER,
            department: 'Computer Science',
        },
        {
            email: 'yohannes@gmail.com',
            firstName: 'Yohannes',
            lastName: 'Student',
            role: Role.STUDENT,
            department: 'Computer Science',
        },
        {
            email: 'yonas@gmail.com',
            firstName: 'Yonas',
            lastName: 'Student',
            role: Role.STUDENT,
            department: 'Computer Science',
        },
        {
            email: 'abebe@gmail.com',
            firstName: 'Abebe',
            lastName: 'Student',
            role: Role.STUDENT,
            department: 'Engineering',
        },
    ];

    for (const u of usersData) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
                email: u.email,
                password,
                firstName: u.firstName,
                lastName: u.lastName,
                role: u.role,
                department: u.department,
                isVerified: true,
            },
        });
        console.log(`Created user: ${user.firstName} (${user.role})`);
    }

    // Create bunch of students
    const studentNames = [
        { f: 'Kebede', l: 'Alemu' },
        { f: 'Almaz', l: 'Girma' },
        { f: 'Chala', l: 'Bekele' },
        { f: 'Tigist', l: 'Haile' },
        { f: 'Dawit', l: 'Yohannes' },
        { f: 'Hanna', l: 'Tadesse' },
        { f: 'Solomon', l: 'Desta' },
        { f: 'Marta', l: 'Assefa' },
        { f: 'Elias', l: 'Tekle' },
        { f: 'Sara', l: 'Moges' },
    ];

    for (const n of studentNames) {
        const email = `${n.f.toLowerCase()}.${n.l.toLowerCase()}@gmail.com`;
        await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                password,
                firstName: n.f,
                lastName: n.l,
                role: Role.STUDENT,
                department: 'General Sciences',
                isVerified: true,
            },
        });
        console.log(`Created student: ${n.f} ${n.l}`);
    }

    // 2. Create Course
    const course = await prisma.course.upsert({
        where: { code: 'CS101' },
        update: {},
        create: {
            code: 'CS101',
            name: 'Introduction to Computer Science',
            department: 'Computer Science',
            credits: 4,
        },
    });
    console.log(`Created course: ${course.name}`);

    // 3. Assign Teacher
    const teacher = await prisma.user.findUnique({ where: { email: 'yonathan@gmail.com' } });
    if (teacher) {
        await prisma.teacherAssignment.upsert({
            where: {
                teacherId_courseId_semester: {
                    teacherId: teacher.id,
                    courseId: course.id,
                    semester: 'Fall 2025'
                }
            },
            update: {},
            create: {
                teacherId: teacher.id,
                courseId: course.id,
                semester: 'Fall 2025'
            }
        });
        console.log('Assigned teacher to course');
    }

    // 4. Create Attendance Session (Active)
    if (teacher) {
        const session = await prisma.attendanceSession.create({
            data: {
                courseId: course.id,
                teacherId: teacher.id,
                startTime: new Date(), // Starts now
                endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // Ends in 2 hours
                isActive: true
            }
        });
        console.log(`Created active attendance session: ${session.id}`);

        // 5. Mark Attendance for Zekarias (as Student for demo?) and others
        // Actually Zekarias is Director, let's mark for Yohannes
        const student = await prisma.user.findUnique({ where: { email: 'yohannes@gmail.com' } });
        if (student) {
            await prisma.attendance.create({
                data: {
                    sessionId: session.id,
                    studentId: student.id,
                    status: AttendanceStatus.PRESENT,
                    remarks: 'On time',
                }
            });
            console.log(`Marked PRESENT for ${student.firstName}`);
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
