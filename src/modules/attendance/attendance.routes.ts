import { Router } from 'express';
import { AttendanceController } from './attendance.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import { Role } from '@prisma/client';

const router = Router();
const attendanceController = new AttendanceController();

// Teacher creates session
router.post('/session', authenticate, authorizeRoles(Role.TEACHER, Role.ADMIN), attendanceController.createSession);

// Teacher marks attendance
router.post('/mark', authenticate, authorizeRoles(Role.TEACHER), attendanceController.mark);

// Student views own attendance
router.get('/my-attendance', authenticate, authorizeRoles(Role.STUDENT), attendanceController.getMyAttendance);

export const attendanceRoutes = router;
