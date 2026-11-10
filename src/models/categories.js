import pool from '../database/index.js';

export async function getAllCategories() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be configured to retrieve categories.');
  }

  const { rows } = await pool.query(
    'SELECT category_id, category_name FROM categories ORDER BY category_id',
  );
  return rows;
}
