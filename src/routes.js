import express from 'express';
import {
  createCategoryPage,
  createCategory,
  editCategoryPage,
  updateCategory,
  showCategoriesPage,
  showCategoryDetailsPage,
} from './controllers/categories.js';
import { showTestErrorPage } from './controllers/errors.js';
import { showHomePage } from './controllers/index.js';
import {
  createOrganizationPage,
  createOrganization,
  editOrganizationPage,
  updateOrganization,
  showOrganizationsPage,
  showOrganizationDetailsPage,
} from './controllers/organizations.js';
import {
  createProjectPage,
  createProject,
  editProjectPage,
  updateProject,
  showProjectsPage,
  showProjectDetailsPage,
} from './controllers/projects.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/new-organization', createOrganizationPage);
router.post('/new-organization', createOrganization);
router.get('/edit-organization/:id', editOrganizationPage);
router.post('/edit-organization/:id', updateOrganization);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/projects', showProjectsPage);
router.get('/new-project', createProjectPage);
router.post('/new-project', createProject);
router.get('/edit-project/:id', editProjectPage);
router.post('/edit-project/:id', updateProject);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', showCategoriesPage);
router.get('/new-category', createCategoryPage);
router.post('/new-category', createCategory);
router.get('/edit-category/:id', editCategoryPage);
router.post('/edit-category/:id', updateCategory);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/test-error', showTestErrorPage);

export default router;
