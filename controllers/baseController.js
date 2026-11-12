import { promisify } from 'node:util';
import { getAllCategories } from '../src/models/categories.js';
import { getAllOrganizations } from '../src/models/organizations.js';
import { getAllProjects } from '../src/models/projects.js';

const renderPage = async (response, viewName, viewData) => {
  const renderView = promisify(response.render.bind(response));
  const pageHtml = await renderView(viewName, viewData);
  response.send(pageHtml);
};

const createPageController = (viewName, pageTitle, currentPage) => async (request, response, next) => {
  try {
    await renderPage(response, viewName, { pageTitle, currentPage });
  } catch (error) {
    next(error);
  }
};

export const buildHome = createPageController('index', 'Home', 'home');

export const buildOrganizations = async (request, response, next) => {
  try {
    const organizations = await getAllOrganizations();
    await renderPage(response, 'organizations', {
      pageTitle: 'Organizations',
      currentPage: 'organizations',
      organizations,
    });
  } catch (error) {
    next(error);
  }
};

export const buildProjects = async (request, response, next) => {
  try {
    const projects = await getAllProjects();
    await renderPage(response, 'projects', {
      pageTitle: 'Projects',
      currentPage: 'projects',
      projects,
    });
  } catch (error) {
    next(error);
  }
};

export const buildCategories = async (request, response, next) => {
  try {
    const categories = await getAllCategories();
    await renderPage(response, 'categories', {
      pageTitle: 'Categories',
      currentPage: 'categories',
      categories,
    });
  } catch (error) {
    next(error);
  }
};
