import { promisify } from 'node:util';

export const renderPage = async (response, viewName, viewData) => {
  const renderView = promisify(response.render.bind(response));
  const pageHtml = await renderView(viewName, viewData);
  response.send(pageHtml);
};

export const isValidId = (id) => {
  return /^\d+$/.test(id) && Number.isSafeInteger(Number(id)) && Number(id) > 0;
};

export const renderNotFound = async (response, pageTitle, message) => {
  response.status(404);
  await renderPage(response, '404', { pageTitle, message });
};
