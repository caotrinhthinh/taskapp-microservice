import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Gateway is running",
    timestamp: new Date().toISOString(),
    services: {
      userService: process.env.USER_SERVICE_URL,
      taskService: process.env.TASK_SERVICE_URL,
      notificationService: process.env.NOTIFICATION_SERVICE_URL,
    },
  });
});

// Proxy Configuration for User Service
app.use(
  "/api/users",
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    logLevel: "debug",
    onProxyReq: (proxyReq, req, res) => {
      console.log(`→ Proxying to User Service: ${req.method} ${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`← Response from User Service: ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      console.error("User Service Proxy Error:", err.message);
      res.status(503).json({
        success: false,
        message: "User Service is unavailable",
        error: err.message,
      });
    },
  })
);

// Proxy Configuration for Task Service
app.use(
  "/api/tasks",
  createProxyMiddleware({
    target: process.env.TASK_SERVICE_URL,
    changeOrigin: true,
    // pathRewrite: {
    //   "^/api/tasks": "",
    // },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`→ Proxying to Task Service: ${req.method} ${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`← Response from Task Service: ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      console.error("❌ Task Service Proxy Error:", err.message);
      res.status(503).json({
        success: false,
        message: "Task Service is unavailable",
        error: err.message,
      });
    },
  })
);

// Proxy Configuration for Notification Service
app.use(
  "/api/notifications",
  createProxyMiddleware({
    target: process.env.NOTIFICATION_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/notifications": "",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `→ Proxying to Notification Service: ${req.method} ${req.url}`
      );
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(
        `← Response from Notification Service: ${proxyRes.statusCode}`
      );
    },
    onError: (err, req, res) => {
      console.error("Notification Service Proxy Error:", err.message);
      res.status(503).json({
        success: false,
        message: "Notification Service is unavailable",
        error: err.message,
      });
    },
  })
);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.url,
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("Gateway Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal gateway error",
    error: err.message,
  });
});

app.use(express.json());

// Start server
app.listen(PORT, () => {
  console.log("=".repeat(60));
  console.log(`🚀 API Gateway is running on port ${PORT}`);
  console.log("=".repeat(60));
  console.log("📍 Gateway Health: http://localhost:" + PORT + "/health");
  console.log("📍 Users API: http://localhost:" + PORT + "/api/users");
  console.log("📍 Tasks API: http://localhost:" + PORT + "/api/tasks");
  console.log(
    "📍 Notifications API: http://localhost:" + PORT + "/api/notifications"
  );
  console.log("=".repeat(60));
  console.log("🔗 Microservices:");
  console.log("  - User Service:", process.env.USER_SERVICE_URL);
  console.log("  - Task Service:", process.env.TASK_SERVICE_URL);
  console.log(
    "  - Notification Service:",
    process.env.NOTIFICATION_SERVICE_URL
  );
  console.log("=".repeat(60));
});
