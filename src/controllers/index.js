export const showHomePage = (request, response) => {
  response.render('index', {
    pageTitle: 'Home',
    currentPage: 'home',
  });
};
