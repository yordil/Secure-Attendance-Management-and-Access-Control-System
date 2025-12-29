import { Router } from 'express';
import { authRoutes } from './modules/auth/auth.routes';
import { courseRoutes } from './modules/courses/course.routes';
import { attendanceRoutes } from './modules/attendance/attendance.routes';
import { auditRoutes } from './modules/audit/audit.routes';
import { userRoutes } from './modules/users/user.routes';
import { permissionRoutes } from './modules/permissions/permission.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/audit', auditRoutes);
router.use('/users', userRoutes);
router.use('/permissions', permissionRoutes);
// router.use('/attendance', attendanceRoutes);

export { router as routes };
