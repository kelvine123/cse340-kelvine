import {
  createProject as createProjectModel,
  getProjectDetails,
  getProjectEditDetails,
  getUpcomingProjects,
  updateProject as updateProjectModel,
} from '../models/projects.js';
import {
  getAllCategories,
  getCategoriesByProjectId,
} from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import {
  addProjectVolunteer,
  isProjectVolunteer,
  removeProjectVolunteer,
} from '../models/volunteers.js';
import {
  createNotFoundError,
  parseRouteId,
  withErrorHandling,
} from './controllerUtils.js';
import { getValidationErrors } from '../middleware/validation.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const getProjectForm = (request) => {
  const body = request.body || {};
  const rawCategoryIds = body.category_ids;
  const categoryIds = Array.isArray(rawCategoryIds)
    ? rawCategoryIds
    : rawCategoryIds ? [rawCategoryIds] : [];

  return {
    project_name: typeof body.project_name === 'string'
      ? body.project_name.trim()
      : '',
    description: typeof body.description === 'string'
      ? body.description.trim()
      : '',
    project_date: typeof body.project_date === 'string'
      ? body.project_date.trim()
      : '',
    location: typeof body.location === 'string'
      ? body.location.trim()
      : '',
    organization_id: typeof body.organization_id === 'string'
      ? body.organization_id
      : '',
    category_ids: categoryIds.map((value) => (
      typeof value === 'string' ? value : ''
    )),
  };
};

const getProjectErrors = (project, organizations, categories, errors) => {
  if (!organizations.some((organization) => (
    String(organization.organization_id) === project.organization_id
  )) && !errors.organization_id) {
    errors.organization_id = 'Choose an organization.';
  }

  const availableCategoryIds = new Set(categories.map((category) => (
    String(category.category_id)
  )));
  if (
    project.category_ids.some((categoryId) => !availableCategoryIds.has(categoryId))
    && !errors.category_ids
  ) {
    errors.category_ids = 'Choose valid project categories.';
  }
  return errors;
};

const renderProjectForm = (
  response,
  project,
  organizations,
  categories,
  errors = {},
  status = 200,
) => {
  const isEditing = Boolean(project.project_id);
  const projectDate = project.project_date instanceof Date
    ? project.project_date.toISOString().slice(0, 10)
    : project.project_date || '';

  response.status(status).render('project-form', {
    pageTitle: isEditing ? 'Edit Service Project' : 'Create Service Project',
    currentPage: 'projects',
    heading: isEditing ? 'Edit service project' : 'Create a service project',
    submitLabel: isEditing ? 'Save project' : 'Create project',
    action: isEditing ? `/edit-project/${project.project_id}` : '/new-project',
    project: { ...project, project_date: projectDate },
    organizations,
    categories,
    errors,
  });
};

const getProjectFormOptions = async () => Promise.all([
  getAllOrganizations(),
  getAllCategories(),
]);

export const showProjectsPage = withErrorHandling(async (request, response) => {
  const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
  response.render('projects', {
    pageTitle: 'Upcoming Service Projects',
    currentPage: 'projects',
    projects,
  });
});

export const createProjectPage = withErrorHandling(async (request, response) => {
  const [organizations, categories] = await getProjectFormOptions();
  renderProjectForm(response, {
    project_name: '',
    description: '',
    project_date: '',
    location: '',
    organization_id: '',
    category_ids: [],
  }, organizations, categories);
});

export const createProject = withErrorHandling(async (request, response) => {
  const [organizations, categories] = await getProjectFormOptions();
  const project = getProjectForm(request);
  const errors = getProjectErrors(
    project,
    organizations,
    categories,
    getValidationErrors(request),
  );
  if (Object.keys(errors).length > 0) {
    return renderProjectForm(response, project, organizations, categories, errors, 400);
  }

  project.organization_id = Number(project.organization_id);
  project.category_ids = project.category_ids.map(Number);
  const projectId = await createProjectModel(project);
  response.redirect(`/project/${projectId}`);
});

export const editProjectPage = withErrorHandling(async (request, response) => {
  const projectId = parseRouteId(request.params.id, 'Service project');
  const [project, [organizations, categories]] = await Promise.all([
    getProjectEditDetails(projectId),
    getProjectFormOptions(),
  ]);
  if (!project) {
    throw createNotFoundError('Service project');
  }
  renderProjectForm(response, project, organizations, categories);
});

export const updateProject = withErrorHandling(async (request, response) => {
  const projectId = parseRouteId(request.params.id, 'Service project');
  const existingProject = await getProjectEditDetails(projectId);
  if (!existingProject) {
    throw createNotFoundError('Service project');
  }

  const [organizations, categories] = await getProjectFormOptions();
  const project = { ...existingProject, ...getProjectForm(request) };
  const errors = getProjectErrors(
    project,
    organizations,
    categories,
    getValidationErrors(request),
  );
  if (Object.keys(errors).length > 0) {
    return renderProjectForm(response, project, organizations, categories, errors, 400);
  }

  project.organization_id = Number(project.organization_id);
  project.category_ids = project.category_ids.map(Number);
  const updated = await updateProjectModel(projectId, project);
  if (!updated) {
    throw createNotFoundError('Service project');
  }
  response.redirect(`/project/${projectId}`);
});

export const showProjectDetailsPage = withErrorHandling(async (request, response) => {
  const projectId = parseRouteId(request.params.id, 'Service project');
  const project = await getProjectDetails(projectId);
  if (!project) {
    throw createNotFoundError('Service project');
  }

  const [categories, isVolunteer] = await Promise.all([
    getCategoriesByProjectId(projectId),
    request.session?.user
      ? isProjectVolunteer(projectId, request.session.user.user_id)
      : false,
  ]);
  response.render('project', {
    pageTitle: project.project_name,
    currentPage: 'projects',
    project,
    categories,
    isVolunteer,
  });
});

export const volunteerForProject = withErrorHandling(async (request, response) => {
  const projectId = parseRouteId(request.params.id, 'Service project');
  const project = await getProjectDetails(projectId);
  if (!project) {
    throw createNotFoundError('Service project');
  }

  const added = await addProjectVolunteer(projectId, request.session.user.user_id);
  request.session.flashMessage = added
    ? 'You are now volunteering for this project.'
    : 'You are already volunteering for this project.';
  response.redirect(`/project/${projectId}`);
});

const removeVolunteer = async (request, response, redirectToDashboard) => {
  const projectId = parseRouteId(request.params.id, 'Service project');
  const project = await getProjectDetails(projectId);
  if (!project) {
    throw createNotFoundError('Service project');
  }

  const removed = await removeProjectVolunteer(projectId, request.session.user.user_id);
  request.session.flashMessage = removed
    ? 'You are no longer volunteering for this project.'
    : 'You were not signed up for this project.';
  response.redirect(redirectToDashboard ? '/dashboard' : `/project/${projectId}`);
};

export const removeVolunteerFromProject = withErrorHandling((request, response) => (
  removeVolunteer(request, response, false)
));

export const removeVolunteerFromDashboard = withErrorHandling((request, response) => (
  removeVolunteer(request, response, true)
));
