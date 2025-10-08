import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";
import connectDatabase from "./config/database.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8082;

app.use(express.json()); // Cho phép gọi API từ frontend khác domain
app.use(cors()); // Cho phép đọc body JSON
app.use(express.urlencoded({ extended: true })); // Cho phép đọc form URL-encoded

// Routes
app.use("/api/tasks", taskRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Task Service is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

const startServer = async () => {
  try {
    await connectDatabase(); // Connect to MongoDB
    // 4. Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Task Service is running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📍 API endpoint: http://localhost:${PORT}/api/tasks`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
// process.on("SIGTERM", async () => {
//   console.log("SIGTERM signal received: closing HTTP server");
//   await closeConnection();
//   process.exit(0);
// });

// process.on("SIGINT", async () => {
//   console.log("SIGINT signal received: closing HTTP server");
//   await closeConnection();
//   process.exit(0);
// });

startServer();
