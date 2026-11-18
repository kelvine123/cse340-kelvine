import { query } from '../database/index.js';

export const getAllOrganizations = async () => {
  const { rows } = await query(
    `SELECT organization_id, organization_name, description, contact_email, logo
     FROM organizations
     ORDER BY organization_name`,
  );
  return rows;
};

export const getOrganizationDetails = async (organizationId) => {
  const { rows } = await query(
    `SELECT organization_id, organization_name, description, contact_email, logo
     FROM organizations
     WHERE organization_id = $1`,
    [organizationId],
  );
  return rows[0] ?? null;
};

export const createOrganization = async (organization) => {
  const { rows } = await query(
    `INSERT INTO organizations (organization_name, description, contact_email, logo)
     VALUES ($1, $2, $3, $4)
     RETURNING organization_id, organization_name, description, contact_email, logo`,
    [
      organization.organization_name,
      organization.description,
      organization.contact_email,
      organization.logo || null,
    ],
  );
  return rows[0];
};

export const updateOrganization = async (organizationId, organization) => {
  const { rows } = await query(
    `UPDATE organizations
     SET organization_name = $2,
         description = $3,
         contact_email = $4,
         logo = $5
     WHERE organization_id = $1
     RETURNING organization_id, organization_name, description, contact_email, logo`,
    [
      organizationId,
      organization.organization_name,
      organization.description,
      organization.contact_email,
      organization.logo || null,
    ],
  );
  return rows[0] ?? null;
};
