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

export const withTransaction = async (operation) => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be configured to retrieve community data.');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await operation(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      throw new AggregateError(
        [error, rollbackError],
        'The database operation failed and its transaction could not be rolled back.',
      );
    }
    throw error;
  } finally {
    client.release();
  }
};

export default pool;
