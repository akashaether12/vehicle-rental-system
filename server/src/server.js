const app = require("./app");
const connectDatabase = require("./config/db");
const config = require("./config/env");
const { ensureAdminUser } = require("./services/bootstrapService");

const start = async () => {
  try {
    await connectDatabase();
    await ensureAdminUser();
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
