import { query } from '../database/index.js';

export async function getAllOrganizations() {
  const { rows } = await query(
    `SELECT organization_id, organization_name, description
     FROM organizations
     ORDER BY organization_name`,
  );
  return rows;
}

export async function getOrganizationById(organizationId) {
  const { rows } = await query(
    `SELECT organization_id, organization_name, description
     FROM organizations
     WHERE organization_id = $1`,
    [organizationId],
  );
  return rows[0] ?? null;
}

export async function getProjectsByOrganizationId(organizationId) {
  const { rows } = await query(
    `SELECT project_id, project_name, description, project_date
     FROM service_projects
     WHERE organization_id = $1
     ORDER BY project_date, project_id`,
    [organizationId],
  );
  return rows;
}
