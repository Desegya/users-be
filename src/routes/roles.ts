// src/routes/roles.ts
import { Router } from 'express';
import { body } from 'express-validator';
import {
  listRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
} from '../controllers/roleController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { authorize } from '../middleware/authorize';
import { ALL_PERMISSIONS, Permission } from '../utils/permissions';

const router = Router();

// Protect all role routes
router.use(protect);

// Build a set of validators for each known permission key:
const permissionValidators = ALL_PERMISSIONS.map((perm) =>
  body(`permissions.${perm}`)
    .optional()
    .isBoolean()
    .withMessage(`permissions.${perm} must be true or false`)
);

// GET /api/roles
router.get('/', listRoles);

// GET /api/roles/:id
router.get('/:id', getRole);

// POST /api/roles
router.post(
  '/',
  authorize('admin', 'manager'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('permissions')
      .isObject()
      .withMessage('permissions must be an object'),
    ...permissionValidators,
  ],
  validate,
  createRole
);

// PUT /api/roles/:id
router.put(
  '/:id',
  authorize('admin', 'manager'),
  [
    body('name').optional().notEmpty(),
    body('permissions')
      .optional()
      .isObject()
      .withMessage('permissions must be an object'),
    ...permissionValidators,
  ],
  validate,
  updateRole
);

// DELETE /api/roles/:id
router.delete('/:id', authorize('admin'), deleteRole);

export default router;
