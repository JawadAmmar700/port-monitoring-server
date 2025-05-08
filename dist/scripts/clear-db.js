"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
async function clearDatabase() {
    try {
        // Get the database path
        const dbPath = path_1.default.join(__dirname, '../../data/environmental.db');
        // Try to close any existing database connections
        try {
            const db = await (0, database_1.getDb)();
            await db.close();
        }
        catch (error) {
            console.log('No active database connection to close');
        }
        // Check if the database file exists
        if (fs_1.default.existsSync(dbPath)) {
            // Try to delete the file
            try {
                fs_1.default.unlinkSync(dbPath);
                console.log('Database cleared successfully');
            }
            catch (error) {
                if (error.code === 'EBUSY') {
                    console.error('Database file is locked. Please make sure no applications are using it.');
                    console.error('Try closing any running instances of the application and try again.');
                }
                else {
                    console.error('Error deleting database file:', error);
                }
            }
        }
        else {
            console.log('Database file not found');
        }
    }
    catch (error) {
        console.error('Error clearing database:', error);
    }
}
clearDatabase();
