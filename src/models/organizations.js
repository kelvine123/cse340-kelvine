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
