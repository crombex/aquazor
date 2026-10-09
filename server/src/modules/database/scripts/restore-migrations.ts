import { Pool } from 'pg';
import 'dotenv/config'

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || 'aquazor_password',
  database: process.env.DB_NAME || 'aquazor',
});

async function restoreMigrations() {
  const client = await pool.connect()

  try {
    console.log('Restoring database (public schema)...')
    await client.query('BEGIN')
    await client.query('DROP SCHEMA public CASCADE')
    await client.query('CREATE SCHEMA public')
    await client.query('COMMIT')
    console.log('Public schema was successfully restored!')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error(`Error while executing SQL: ${error}`)
  } finally {
    client.release()
    await pool.end()
  }
}

restoreMigrations()