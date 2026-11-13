import {
  getProjectDetails,
  getUpcomingProjects,
} from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import {
  createNotFoundError,
  parseRouteId,
  withErrorHandling,
} from './controllerUtils.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

export const showProjectsPage = withErrorHandling(async (request, response) => {
  const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
  response.render('projects', {
    pageTitle: 'Upcoming Service Projects',
    currentPage: 'projects',
    projects,
  });
});

export const showProjectDetailsPage = withErrorHandling(async (request, response) => {
  const projectId = parseRouteId(request.params.id, 'Service project');
  const project = await getProjectDetails(projectId);
  if (!project) {
    throw createNotFoundError('Service project');
  }

  const categories = await getCategoriesByProjectId(projectId);
  response.render('project', {
    pageTitle: project.project_name,
    currentPage: 'projects',
    project,
    categories,
  });
});
