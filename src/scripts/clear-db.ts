import { getDb } from '../config/database';
import path from 'path';
import fs from 'fs';

async function clearDatabase() {
  try {
    // Get the database path
    const dbPath = path.join(__dirname, '../../data/environmental.db');
    
    // Try to close any existing database connections
    try {
      const db = await getDb();
      await db.close();
    } catch (error) {
      console.log('No active database connection to close');
    }

    // Check if the database file exists
    if (fs.existsSync(dbPath)) {
      // Try to delete the file
      try {
        fs.unlinkSync(dbPath);
        console.log('Database cleared successfully');
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'EBUSY') {
          console.error('Database file is locked. Please make sure no applications are using it.');
          console.error('Try closing any running instances of the application and try again.');
        } else {
          console.error('Error deleting database file:', error);
        }
      }
    } else {
      console.log('Database file not found');
    }
  } catch (error) {
    console.error('Error clearing database:', error);
  }
}

clearDatabase(); 