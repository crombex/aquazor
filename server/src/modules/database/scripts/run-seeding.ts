import { Pool } from 'pg';
import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import 'dotenv/config'

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'aquazor_user',
  password: process.env.DB_PASSWORD || 'aquazor_password',
  database: process.env.DB_NAME || 'aquazor',
});

async function runSeeding() {
  console.log('Reading seeds path...');

  const filePaths = readdirSync(path.resolve(__dirname, '../seeds')).sort().map(filename => {
    return path.resolve(__dirname, '../', `seeds/${filename}`)
  });
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    
    for (const filePath of filePaths) {
      const fileDataSQL = readFileSync(filePath, {encoding: 'utf-8'})
      console.log(`Executing ${path.basename(filePath)} SQL script...`)
      await client.query(fileDataSQL)
    }

    await client.query('COMMIT');

  } catch (error){
    await client.query('ROLLBACK');
    console.log('Server can not execute SQL scripts');
    console.log('Error: ', error)
  } finally {
    client.release();
    await pool.end();
  }
}

runSeeding();
