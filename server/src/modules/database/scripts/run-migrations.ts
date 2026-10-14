import { Pool } from 'pg';
import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import { IMigration } from '../types';
import { hashFromFile } from '../../../common/utils/hash-from-file';
import 'dotenv/config';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || 'aquazor_password',
  database: process.env.DB_NAME || 'aquazor',
});

async function runMigrations() {
  console.log('Reading migrations path...');

  const filePaths = readdirSync(path.resolve(__dirname, '../migrations'))
    .sort()
    .map((filename) => {
      return path.resolve(__dirname, '../', `migrations/${filename}`);
    });
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('Starting SQL with initializing migration table...');
    const sqlScript = readFileSync(filePaths.shift()!, { encoding: 'utf-8' });
    await client.query(sqlScript);
    console.log(
      'SQL with initializing migration table has been successfuly executed',
    );

    console.log('Reading migration table...');
    const migrations = Object.fromEntries(
      (await client.query<IMigration>('SELECT * FROM migrations;')).rows.map(
        (elem: IMigration) => [elem.filename, elem],
      ),
    );
    console.log('Successfuly read migration table');

    console.log('Starting checking files and hashes...');

    for (const filePath of filePaths) {
      const fileHash = await hashFromFile(filePath, 'sha256');
      const fileBaseName = path.basename(filePath);

      if (!(fileBaseName in migrations)) {
        await client.query(
          `
          INSERT INTO migrations (filename, hash) VALUES($1 ,$2)  
        `,
          [fileBaseName, fileHash],
        );

        await client.query(readFileSync(filePath, { encoding: 'utf-8' }));
        console.log(`Applied new migration: ${fileBaseName}`);
      } else if (migrations[fileBaseName].hash !== fileHash) {
        throw new Error(
          `Migration file ${fileBaseName} has been edited and can not been executed!`,
        );
      } else {
        console.log(
          `Migration ${fileBaseName} already exists in database, so it was skipped`,
        );
      }
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.log('Server can not execute SQL scripts');
    console.log('Error: ', error);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations(); // eslint-disable-line @typescript-eslint/no-floating-promises
