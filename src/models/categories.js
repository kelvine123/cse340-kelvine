import { query } from '../database/index.js';

export const getAllCategories = async () => {
  const { rows } = await query(
    'SELECT category_id, category_name FROM categories ORDER BY category_id',
  );
  return rows;
};
