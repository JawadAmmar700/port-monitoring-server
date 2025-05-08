import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

async function clearVesselsDatabase() {
  let db;
  try {
    db = await open({
      filename: path.join(__dirname, "../../data/port.db"),
      driver: sqlite3.Database,
    });

    // Check if vessels table exists
    const tableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='vessels'"
    );

    if (!tableExists) {
      console.log("ℹ️ Vessels table does not exist. Nothing to clear.");
      return;
    }

    // Delete all records from the vessels table
    await db.run("DELETE FROM vessels");
    console.log("✅ All vessels deleted successfully");

    // Try to reset the auto-increment counter if it exists
    try {
      await db.run("DELETE FROM sqlite_sequence WHERE name='vessels'");
      console.log("✅ Auto-increment counter reset successfully");
    } catch (error) {
      // Ignore error if sqlite_sequence table doesn't exist
      console.log("ℹ️ Auto-increment counter not found, skipping reset");
    }

    console.log("✅ Vessels database cleared successfully");
  } catch (error) {
    console.error("❌ Error clearing vessels database:", error);
    process.exit(1);
  } finally {
    if (db) {
      await db.close();
    }
  }
}

clearVesselsDatabase();
