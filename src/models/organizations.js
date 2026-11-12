import { query } from '../database/index.js';

export const getAllOrganizations = async () => {
  const { rows } = await query(
    `SELECT organization_id, organization_name, description, contact_email, logo
     FROM organizations
     ORDER BY organization_name`,
  );
  return rows;
};
