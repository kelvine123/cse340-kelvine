import { query } from '../database/index.js';

export const getUpcomingProjects = async (numberOfProjects) => {
  if (!Number.isInteger(numberOfProjects) || numberOfProjects < 1) {
    throw new TypeError('The project limit must be a positive integer.');
  }

  const { rows } = await query(
    `SELECT project.project_id, project.project_name, project.description,
            project.project_date, project.location,
            organization.organization_id, organization.organization_name
     FROM service_projects AS project
     JOIN organizations AS organization
       ON organization.organization_id = project.organization_id
     WHERE project.project_date >= CURRENT_DATE
     ORDER BY project.project_date, project.project_id
     LIMIT $1`,
    [numberOfProjects],
  );
  return rows;
};

export const getProjectDetails = async (projectId) => {
  const { rows } = await query(
    `SELECT project.project_id, project.project_name, project.description,
            project.project_date, project.location,
            organization.organization_id, organization.organization_name
     FROM service_projects AS project
     JOIN organizations AS organization
       ON organization.organization_id = project.organization_id
     WHERE project.project_id = $1`,
    [projectId],
  );
  return rows[0] ?? null;
};

export const getProjectsByOrganizationId = async (organizationId) => {
  const { rows } = await query(
    `SELECT project.project_id, project.project_name, project.project_date
     FROM service_projects AS project
     WHERE project.organization_id = $1
     ORDER BY project.project_date, project.project_id`,
    [organizationId],
  );
  return rows;
};

export const getProjectsByCategoryId = async (categoryId) => {
  const { rows } = await query(
    `SELECT project.project_id, project.project_name, project.project_date
     FROM service_projects AS project
     JOIN project_categories AS project_category
       ON project_category.project_id = project.project_id
     WHERE project_category.category_id = $1
     ORDER BY project.project_date, project.project_id`,
    [categoryId],
  );
  return rows;
};
