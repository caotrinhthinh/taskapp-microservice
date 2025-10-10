import Notification from "../models/Notification.js";
import ApiError from "../utils/ApiError.js";

export async function getAllNotifications(filters = {}) {
  const { userId, isRead, type } = filters;
  const query = {};

  if (userId) query.userId = parseInt(userId);
  if (isRead !== undefined) query.isRead = isRead === "true"; // Vì isRead là kiểu boolean
  if (type) query.type = type;

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(100);

  return notifications;
}

export async function getNotificationById(id) {
  const notification = await Notification.findById(id);
  if (!notification) throw new ApiError(404, "Notification not found");
  return notification;
}

export async function getNotificationsByUserId(userId, isRead) {
  const query = { userId: parseInt(userId) };
  if (isRead !== undefined) query.isRead = isRead === "true";

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({
    userId: parseInt(userId),
    isRead: false,
  });

  return { notifications, unreadCount };
}

export async function markAsRead(id) {
  const notification = await Notification.findById(id);
  if (!notification) throw new ApiError(404, "Notification not found");

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  return notification;
}

export async function markAllAsRead(userId) {
  const result = await Notification.updateMany(
    { userId: parseInt(userId), isRead: false },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    }
  );

  return result.modifiedCount;
}

export async function deleteNotification(id) {
  const notification = await Notification.findByIdAndDelete(id);
  if (!notification) throw new ApiError(404, "Notification not found");
  return notification;
}
