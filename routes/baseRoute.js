import { Router } from 'express';
import { buildHome } from '../controllers/baseController.js';
import {
  buildCategories,
  buildCategoryDetail,
} from '../controllers/categoryController.js';
import {
  buildOrganizationDetail,
  buildOrganizations,
} from '../controllers/organizationController.js';
import {
  buildProjectDetail,
  buildProjects,
} from '../controllers/projectController.js';

const router = Router();

router.get('/', buildHome);
router.get('/organizations', buildOrganizations);
router.get('/organization/:id', buildOrganizationDetail);
router.get('/projects', buildProjects);
router.get('/project/:id', buildProjectDetail);
router.get('/categories', buildCategories);
router.get('/category/:id', buildCategoryDetail);

export default router;
