import { renderPage } from './controllerUtils.js';

const createPageController = (viewName, pageTitle, currentPage) => async (request, response, next) => {
  try {
    await renderPage(response, viewName, { pageTitle, currentPage });
  } catch (error) {
    next(error);
  }
};

export const buildHome = createPageController('index', 'Home', 'home');
