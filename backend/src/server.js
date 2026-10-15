const app = require("./app");
const env = require("./config/env");
const connectDB = require("./config/database");

const startServer = async () => {
  try {
    // Connect Database
    await connectDB();

    // Start Express Server
    const server = app.listen(env.PORT, () => {
      console.log(
        `[Server] TravelTrail API is running on port ${env.PORT} in ${env.NODE_ENV} mode`,
      );
      console.log(`[Server] Base URL: http://localhost:${env.PORT}`);
    });

    // Handle Unhandled Promise Rejections
    process.on("unhandledRejection", (err) => {
      console.error(`[Server Error] Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });

    // Handle SIGTERM
    process.on("SIGTERM", () => {
      console.log("[Server] SIGTERM received. Shutting down gracefully.");
      server.close(() => {
        console.log("[Server] Process terminated.");
      });
    });
  } catch (error) {
    console.error(`[Server Error] Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
