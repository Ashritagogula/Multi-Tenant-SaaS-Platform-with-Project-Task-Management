import db from "../config/db.js";
import fs from "fs";
import path from "path";

const runMigrations = async () => {
  console.log("Running migrations...");

  const migrationsDir = path.join(process.cwd(), "migrations");
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    await db.query(sql);
  }

  console.log("Migrations completed");
};

export default runMigrations;
