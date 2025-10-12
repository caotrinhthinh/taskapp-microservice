import express from "express";
import {
  getAllNotifications,
  getNotificationById,
  getNotificationsByUserId,
} from "../services/notificationService.js";

const router = express.Router();

router.get("/", getAllNotifications);
router.get("/:id", getNotificationById);
router.get("/user/:userId", getNotificationsByUserId);
router.put("/:id/read", markAsRead);
router.put("/user/:userId/read-all", markAllAsRead);
router.delete("/:id", deleteNotification);

export default router;
