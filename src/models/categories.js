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

export const createCategory = async (categoryName) => {
  const { rows } = await query(
    `INSERT INTO categories (category_name)
     VALUES ($1)
     RETURNING category_id, category_name`,
    [categoryName],
  );
  return rows[0];
};

export const updateCategory = async (categoryId, categoryName) => {
  const { rows } = await query(
    `UPDATE categories
     SET category_name = $2
     WHERE category_id = $1
     RETURNING category_id, category_name`,
    [categoryId, categoryName],
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
