import { getInitializedDataSource } from '../src/database/database.provider';
import * as dotenv from 'dotenv';
import * as path from 'path';
// Load environment variables from .env file
dotenv.config({
  path: path.resolve(__dirname, '../.env.local'),
});
async function initTestDatabase() {
  try {
    const dataSource = await getInitializedDataSource('auth_db', '3307');

    await dataSource.synchronize();
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

initTestDatabase();
