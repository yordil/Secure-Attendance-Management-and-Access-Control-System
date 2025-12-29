import { Router } from 'express';
import { PermissionController } from './permission.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();
const permController = new PermissionController();

router.post('/grant', authenticate, permController.grant);
router.delete('/:id', authenticate, permController.revoke);
router.get('/', authenticate, permController.list);

export const permissionRoutes = router;
