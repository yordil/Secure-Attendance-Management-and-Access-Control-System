import { Router } from 'express';
import { CourseController } from './course.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import { Role } from '@prisma/client';

const router = Router();
const courseController = new CourseController();

// Only DIRECTOR and ADMIN can create courses
router.post(
    '/',
    authenticate,
    authorizeRoles(Role.DIRECTOR, Role.ADMIN),
    courseController.create
);

// All authenticated users can view courses? Or maybe just internal
router.get('/', authenticate, courseController.list);

// Assign teacher: DIRECTOR only
router.post(
    '/:id/assign',
    authenticate,
    authorizeRoles(Role.DIRECTOR),
    courseController.assignTeacher
);

export const courseRoutes = router;
