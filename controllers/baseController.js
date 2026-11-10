import { promisify } from 'node:util';
import { getAllCategories } from '../src/models/categories.js';

const createPageController = (viewName, pageTitle, currentPage) => async (request, response, next) => {
  try {
    const renderView = promisify(response.render.bind(response));
    const pageHtml = await renderView(viewName, { pageTitle, currentPage });
    response.send(pageHtml);
  } catch (error) {
    next(error);
  }
};

export const buildHome = createPageController('index', 'Home', 'home');
export const buildOrganizations = createPageController('organizations', 'Organizations', 'organizations');
export const buildProjects = createPageController('projects', 'Projects', 'projects');
export const buildCategories = async (request, response, next) => {
  try {
    const categories = await getAllCategories();
    const renderView = promisify(response.render.bind(response));
    const pageHtml = await renderView('categories', {
      pageTitle: 'Categories',
      currentPage: 'categories',
      categories,
    });
    response.send(pageHtml);
  } catch (error) {
    next(error);
  }
};
