import { getCategoriesByProjectId } from '../src/models/categories.js';
import { getProjectById, getUpcomingProjects } from '../src/models/projects.js';
import { isValidId, renderNotFound, renderPage } from './controllerUtils.js';

export async function buildProjects(request, response, next) {
  try {
    const projects = await getUpcomingProjects();
    await renderPage(response, 'projects', {
      pageTitle: 'Projects',
      currentPage: 'projects',
      projects,
    });
  } catch (error) {
    next(error);
  }
}

export async function buildProjectDetail(request, response, next) {
  try {
    const { id } = request.params;
    if (!isValidId(id)) {
      await renderNotFound(response, 'Project not found', 'We could not find that service project.');
      return;
    }

    const project = await getProjectById(Number(id));
    if (!project) {
      await renderNotFound(response, 'Project not found', 'We could not find that service project.');
      return;
    }

    const categories = await getCategoriesByProjectId(project.project_id);
    await renderPage(response, 'project', {
      pageTitle: project.project_name,
      currentPage: 'projects',
      project,
      categories,
    });
  } catch (error) {
    next(error);
  }
}
