import { query } from '../database/index.js';

export const getUpcomingProjects = async () => {
  const { rows } = await query(
    `SELECT project.project_id, project.project_name, project.description,
            project.location, project.project_date, organization.organization_id,
            organization.organization_name
     FROM service_projects AS project
     JOIN organizations AS organization
       ON organization.organization_id = project.organization_id
     WHERE project.project_date >= CURRENT_DATE
     ORDER BY project.project_date, project.project_id
     LIMIT 5`,
  );
  return rows;
};

export const getProjectById = async (projectId) => {
  const { rows } = await query(
    `SELECT project.project_id, project.project_name, project.description,
            project.location, project.project_date, organization.organization_id,
            organization.organization_name
     FROM service_projects AS project
     JOIN organizations AS organization
       ON organization.organization_id = project.organization_id
     WHERE project.project_id = $1`,
    [projectId],
  );
  return rows[0] ?? null;
};
