import {
  getAllOrganizations,
  getOrganizationById,
  getProjectsByOrganizationId,
} from '../src/models/organizations.js';
import { isValidId, renderNotFound, renderPage } from './controllerUtils.js';

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

export const buildOrganizationDetail = async (request, response, next) => {
  try {
    const { id } = request.params;
    if (!isValidId(id)) {
      await renderNotFound(response, 'Organization not found', 'We could not find that organization.');
      return;
    };

    const organization = await getOrganizationById(Number(id));
    if (!organization) {
      await renderNotFound(response, 'Organization not found', 'We could not find that organization.');
      return;
    }

    const projects = await getProjectsByOrganizationId(organization.organization_id);
    await renderPage(response, 'organization', {
      pageTitle: organization.organization_name,
      currentPage: 'organizations',
      organization,
      projects,
    });
  } catch (error) {
    next(error);
  }
}
