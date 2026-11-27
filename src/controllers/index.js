import { getVolunteerProjectsForUser } from '../models/volunteers.js';
import { withErrorHandling } from './controllerUtils.js';

export const showHomePage = withErrorHandling(async (request, response) => {
  const volunteerProjects = request.path === '/dashboard'
    ? await getVolunteerProjectsForUser(request.session.user.user_id)
    : [];
  response.render('index', {
    pageTitle: request.path === '/dashboard' ? 'Dashboard' : 'Home',
    currentPage: request.path === '/dashboard' ? 'dashboard' : 'home',
    volunteerProjects,
  });
});
