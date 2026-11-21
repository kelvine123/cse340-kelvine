export const requireLogin = (request, response, next) => {
  if (!request.session?.user) {
    request.session.flashMessage = 'Please log in to access that page.';
    return response.redirect('/login');
  }
  return next();
};

export const requireRole = (...allowedRoles) => (request, response, next) => {
  const user = request.session?.user;
  if (!user) {
    request.session.flashMessage = 'Please log in to access that page.';
    return response.redirect('/login');
  }
  if (!allowedRoles.includes(user.role)) {
    request.session.flashMessage = 'You do not have permission to access that page.';
    return response.redirect('/dashboard');
  }
  return next();
};
