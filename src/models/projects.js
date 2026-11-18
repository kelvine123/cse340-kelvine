import { query, withTransaction } from '../database/index.js';

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

export const createProject = async (project) => {
  return withTransaction(async (client) => {
    const { rows } = await client.query(
      `INSERT INTO service_projects (
         project_name, description, project_date, location, organization_id
       )
       VALUES ($1, $2, $3, $4, $5)
       RETURNING project_id`,
      [
        project.project_name,
        project.description,
        project.project_date,
        project.location,
        project.organization_id,
      ],
    );
    const projectId = rows[0].project_id;
    await setProjectCategories(client, projectId, project.category_ids);
    return projectId;
  });
};

export const updateProject = async (projectId, project) => {
  return withTransaction(async (client) => {
    const { rows } = await client.query(
      `UPDATE service_projects
       SET project_name = $2,
           description = $3,
           project_date = $4,
           location = $5,
           organization_id = $6
       WHERE project_id = $1
       RETURNING project_id`,
      [
        projectId,
        project.project_name,
        project.description,
        project.project_date,
        project.location,
        project.organization_id,
      ],
    );
    if (rows.length === 0) {
      return false;
    }

    await client.query('DELETE FROM project_categories WHERE project_id = $1', [projectId]);
    await setProjectCategories(client, projectId, project.category_ids);
    return true;
  });
};

const setProjectCategories = async (client, projectId, categoryIds) => {
  for (const categoryId of categoryIds) {
    await client.query(
      `INSERT INTO project_categories (project_id, category_id)
       VALUES ($1, $2)`,
      [projectId, categoryId],
    );
  }
};

export const getProjectEditDetails = async (projectId) => {
  const { rows } = await query(
    `SELECT project_id, project_name, description, project_date, location, organization_id
     FROM service_projects
     WHERE project_id = $1`,
    [projectId],
  );
  if (!rows[0]) {
    return null;
  }

  const categoryResult = await query(
    `SELECT category_id
     FROM project_categories
     WHERE project_id = $1
     ORDER BY category_id`,
    [projectId],
  );
  return {
    ...rows[0],
    category_ids: categoryResult.rows.map((row) => row.category_id),
  };
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
