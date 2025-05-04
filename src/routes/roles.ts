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

const router = Router();

// Protect all role routes
router.use(protect);

// GET /api/roles
router.get('/', listRoles);

// GET /api/roles/:id
router.get('/:id', getRole);

// POST /api/roles
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('permissions')
      .isArray()
      .withMessage('Permissions must be an array of strings'),
  ],
  validate,
  createRole
);

// PUT /api/roles/:id
router.put(
  '/:id',
  [
    body('name').optional().notEmpty(),
    body('permissions').optional().isArray(),
  ],
  validate,
  updateRole
);

// DELETE /api/roles/:id
router.delete('/:id', deleteRole);

export default router;
