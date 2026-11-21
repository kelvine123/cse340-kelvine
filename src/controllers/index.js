export const showHomePage = (request, response) => {
  response.render('index', {
    pageTitle: request.path === '/dashboard' ? 'Dashboard' : 'Home',
    currentPage: request.path === '/dashboard' ? 'dashboard' : 'home',
  });
};
