import {
  createOrganization as createOrganizationModel,
  getAllOrganizations,
  getOrganizationDetails,
  updateOrganization as updateOrganizationModel,
} from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import {
  createNotFoundError,
  parseRouteId,
  withErrorHandling,
} from './controllerUtils.js';

const getOrganizationForm = (request) => {
  const body = request.body || {};
  return {
    organization_name: typeof body.organization_name === 'string'
      ? body.organization_name.trim()
      : '',
    description: typeof body.description === 'string'
      ? body.description.trim()
      : '',
    contact_email: typeof body.contact_email === 'string'
      ? body.contact_email.trim()
      : '',
    logo: typeof body.logo === 'string' ? body.logo.trim() : '',
  };
};

const getOrganizationErrors = (organization) => {
  const errors = {};
  if (!organization.organization_name) {
    errors.organization_name = 'Enter an organization name.';
  } else if (organization.organization_name.length < 3) {
    errors.organization_name = 'Organization name must be at least 3 characters.';
  } else if (organization.organization_name.length > 150) {
    errors.organization_name = 'Organization name must be 150 characters or fewer.';
  }

  if (!organization.description || organization.description.length < 3) {
    errors.description = 'Enter a description of at least 3 characters.';
  }
  if (
    !organization.contact_email
    || organization.contact_email.length > 254
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(organization.contact_email)
  ) {
    errors.contact_email = 'Enter a valid contact email address.';
  }
  return errors;
};

const renderOrganizationForm = (response, organization, errors = {}, status = 200) => {
  const isEditing = Boolean(organization.organization_id);
  response.status(status).render('organization-form', {
    pageTitle: isEditing ? 'Edit Organization' : 'Create Organization',
    currentPage: 'organizations',
    heading: isEditing ? 'Edit organization' : 'Create an organization',
    submitLabel: isEditing ? 'Save organization' : 'Create organization',
    action: isEditing
      ? `/edit-organization/${organization.organization_id}`
      : '/new-organization',
    organization,
    errors,
  });
};

export const showOrganizationsPage = withErrorHandling(async (request, response) => {
  const organizations = await getAllOrganizations();
  response.render('organizations', {
    pageTitle: 'Organizations',
    currentPage: 'organizations',
    organizations,
  });
});

export const createOrganizationPage = (request, response) => {
  renderOrganizationForm(response, {
    organization_name: '',
    description: '',
    contact_email: '',
    logo: '',
  });
};

export const createOrganization = withErrorHandling(async (request, response) => {
  const organization = getOrganizationForm(request);
  const errors = getOrganizationErrors(organization);
  if (Object.keys(errors).length > 0) {
    return renderOrganizationForm(response, organization, errors, 400);
  }

  await createOrganizationModel(organization);
  response.redirect('/organizations');
});

export const editOrganizationPage = withErrorHandling(async (request, response) => {
  const organizationId = parseRouteId(request.params.id, 'Organization');
  const organization = await getOrganizationDetails(organizationId);
  if (!organization) {
    throw createNotFoundError('Organization');
  }
  renderOrganizationForm(response, organization);
});

export const updateOrganization = withErrorHandling(async (request, response) => {
  const organizationId = parseRouteId(request.params.id, 'Organization');
  const existingOrganization = await getOrganizationDetails(organizationId);
  if (!existingOrganization) {
    throw createNotFoundError('Organization');
  }

  const organization = {
    ...existingOrganization,
    ...getOrganizationForm(request),
  };
  const errors = getOrganizationErrors(organization);
  if (Object.keys(errors).length > 0) {
    return renderOrganizationForm(response, organization, errors, 400);
  }

  const updatedOrganization = await updateOrganizationModel(organizationId, organization);
  if (!updatedOrganization) {
    throw createNotFoundError('Organization');
  }
  response.redirect(`/organization/${organizationId}`);
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
