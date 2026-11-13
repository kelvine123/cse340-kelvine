import {
  getAllOrganizations,
  getOrganizationDetails,
} from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import {
  createNotFoundError,
  parseRouteId,
  withErrorHandling,
} from './controllerUtils.js';

export const showOrganizationsPage = withErrorHandling(async (request, response) => {
  const organizations = await getAllOrganizations();
  response.render('organizations', {
    pageTitle: 'Organizations',
    currentPage: 'organizations',
    organizations,
  });
});

export const showOrganizationDetailsPage = withErrorHandling(async (request, response) => {
  const organizationId = parseRouteId(request.params.id, 'Organization');
  const organization = await getOrganizationDetails(organizationId);
  if (!organization) {
    throw createNotFoundError('Organization');
  }

  const projects = await getProjectsByOrganizationId(organizationId);
  response.render('organization', {
    pageTitle: organization.organization_name,
    currentPage: 'organizations',
    organization,
    projects,
  });
});
