import { query } from '../database/index.js';

export const getAllProjects = async () => {
  const { rows } = await query(
    `SELECT project.project_id, project.project_name, project.description,
            project.location, organization.organization_name
     FROM service_projects AS project
     JOIN organizations AS organization
       ON organization.organization_id = project.organization_id
     ORDER BY project.project_id`,
  );
  return rows;
};
