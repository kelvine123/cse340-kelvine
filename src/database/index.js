import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = (...args) => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be configured to retrieve community data.');
  }

  return pool.query(...args);
};

export default pool;
