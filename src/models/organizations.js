import { query } from '../database/index.js';

export const getAllOrganizations = async () => {
  const { rows } = await query(
    `SELECT organization_id, organization_name, description, contact_email, logo
     FROM organizations
     ORDER BY organization_name`,
  );
  return rows;
};

export const getOrganizationById = async (organizationId) => {
  const { rows } = await query(
    `SELECT organization_id, organization_name, description, contact_email, logo
     FROM organizations
     WHERE organization_id = $1`,
    [organizationId],
  );
  return rows[0] ?? null;
};

export const getProjectsByOrganizationId = async (organizationId) => {
  const { rows } = await query(
    `SELECT project_id, project_name, description, location, project_date
     FROM service_projects
     WHERE organization_id = $1
     ORDER BY project_date, project_id`,
    [organizationId],
  );
  return rows;
};
