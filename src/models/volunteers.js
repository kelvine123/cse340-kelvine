import { query } from '../database/index.js';

export const addProjectVolunteer = async (projectId, userId) => {
  const { rows } = await query(
    `INSERT INTO project_volunteers (project_id, user_id)
     VALUES ($1, $2)
     ON CONFLICT (project_id, user_id) DO NOTHING
     RETURNING project_id`,
    [projectId, userId],
  );
  return rows.length > 0;
};

export const removeProjectVolunteer = async (projectId, userId) => {
  const { rows } = await query(
    `DELETE FROM project_volunteers
     WHERE project_id = $1 AND user_id = $2
     RETURNING project_id`,
    [projectId, userId],
  );
  return rows.length > 0;
};

export const isProjectVolunteer = async (projectId, userId) => {
  const { rows } = await query(
    `SELECT 1
     FROM project_volunteers
     WHERE project_id = $1 AND user_id = $2`,
    [projectId, userId],
  );
  return rows.length > 0;
};

export const getVolunteerProjectsForUser = async (userId) => {
  const { rows } = await query(
    `SELECT project.project_id, project.project_name, project.project_date,
            project.location, organization.organization_name
     FROM project_volunteers AS volunteer
     JOIN service_projects AS project
       ON project.project_id = volunteer.project_id
     JOIN organizations AS organization
       ON organization.organization_id = project.organization_id
     WHERE volunteer.user_id = $1
     ORDER BY project.project_date, project.project_id`,
    [userId],
  );
  return rows;
};
