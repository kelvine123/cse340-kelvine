import { query } from '../database/index.js';

export const getAllCategories = async () => {
  const { rows } = await query(
    'SELECT category_id, category_name FROM categories ORDER BY category_id',
  );
  return rows;
};

export const getCategoryDetails = async (categoryId) => {
  const { rows } = await query(
    `SELECT category_id, category_name
     FROM categories
     WHERE category_id = $1`,
    [categoryId],
  );
  return rows[0] ?? null;
};

export const getCategoriesByProjectId = async (projectId) => {
  const { rows } = await query(
    `SELECT category.category_id, category.category_name
     FROM categories AS category
     JOIN project_categories AS project_category
       ON project_category.category_id = category.category_id
     WHERE project_category.project_id = $1
     ORDER BY category.category_name`,
    [projectId],
  );
  return rows;
};
