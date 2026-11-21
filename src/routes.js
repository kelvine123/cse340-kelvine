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
import {
  loginPage,
  login,
  logout,
  registerPage,
  register,
  showUsersPage,
} from './controllers/auth.js';
import { requireLogin, requireRole } from './middleware/auth.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/dashboard', requireLogin, showHomePage);
router.get('/register', registerPage);
router.post('/register', register);
router.get('/login', loginPage);
router.post('/login', login);
router.post('/logout', logout);
router.get('/users', requireRole('admin'), showUsersPage);
router.get('/organizations', showOrganizationsPage);
router.get('/new-organization', requireRole('admin'), createOrganizationPage);
router.post('/new-organization', requireRole('admin'), createOrganization);
router.get('/edit-organization/:id', requireRole('admin'), editOrganizationPage);
router.post('/edit-organization/:id', requireRole('admin'), updateOrganization);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/projects', showProjectsPage);
router.get('/new-project', requireRole('admin'), createProjectPage);
router.post('/new-project', requireRole('admin'), createProject);
router.get('/edit-project/:id', requireRole('admin'), editProjectPage);
router.post('/edit-project/:id', requireRole('admin'), updateProject);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', showCategoriesPage);
router.get('/new-category', requireRole('admin'), createCategoryPage);
router.post('/new-category', requireRole('admin'), createCategory);
router.get('/edit-category/:id', requireRole('admin'), editCategoryPage);
router.post('/edit-category/:id', requireRole('admin'), updateCategory);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/test-error', showTestErrorPage);

export default router;
