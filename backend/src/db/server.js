import app from "./app.js";
import runMigrations from "./db/migrate.js";
import seedData from "./db/seed.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await runMigrations();
    await seedData();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup failed", err);
    process.exit(1);
  }
};

startServer();
