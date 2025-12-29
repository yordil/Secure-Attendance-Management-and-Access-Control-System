import { Router } from 'express';
import { AuditController } from './audit.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import { Role } from '@prisma/client';

const router = Router();
const auditController = new AuditController();

// Only Admins/Directors can view audit logs
router.get('/', authenticate, authorizeRoles(Role.ADMIN, Role.DIRECTOR), auditController.list);

export const auditRoutes = router;
