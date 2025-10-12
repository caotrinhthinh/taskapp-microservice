import * as notificationService from "../services/notificationService.js";

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getAllNotifications(
      req.query
    );
    res.status(200).json({
      success: true,
      message: "Notification retrieved successfully",
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getNotificationById = async (req, res) => {
  try {
    const notification = await notificationService.getNotificationById(
      req.params.id
    );
    res.status(200).json({
      success: true,
      message: "Notification retrieved successfully",
      data: notification,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getNotificationByUserId = async (req, res) => {
  try {
    const { notifications, unreadCount } =
      await notificationService.getNotificationsByUserId(
        req.params.userId,
        req.query.isRead
      );

    res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully",
      count: notifications.length,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id);
    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const modifiedCount = await notificationService.markAllAsRead(
      req.params.userId
    );
    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      modifiedCount,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteNotification = async (req, res) => {
  try {
    await notificationService.deleteNotification(req.params.id);
    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
};

function handleError(res, error) {
  console.error("❌ Error:", error);

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: error.message,
  });
}
