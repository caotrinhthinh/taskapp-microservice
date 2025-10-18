import { consumeMessages } from "../config/rabbitmq.js";
import Notification from "../models/Notification.js";

// Khởi động User Event Consumer
export const startUserEventConsumer = async () => {
  try {
    await consumeMessages(
      process.env.RABBITMQ_QUEUE_USER_EVENTS,
      handleUserEvent
    );
  } catch (error) {
    console.log("Failed to start user event consumer: ", error);
  }
};

// Khởi động Task Event Consumer
export const startTaskEventConsumer = async () => {
  try {
    await consumeMessages(
      process.env.RABBITMQ_QUEUE_TASK_EVENTS,
      handleTaskEvent
    );
  } catch (error) {
    console.error("Failed to start task event consumer:", error);
  }
};

const handleUserEvent = async (event) => {
  try {
    console.log("Processing user event:", event);

    const { eventType, userId, username } = event;

    let notification = null;
    switch (eventType) {
      case "CREATED":
        // Tạo notification chào mừng user mới
        notification = new Notification({
          userId,
          type: "USER_CREATED",
          title: "Welcome to Task App!",
          message: `Hello ${username}! Welcome to our task management system. Start by creating your first task!`,
          metadata: {
            eventType: "USER_CREATED",
          },
        });
        break;

      case "UPDATED":
        notification = new Notification({
          userId,
          type: "SYSTEM",
          title: "Profile Updated",
          message: "Your profile has been updated successfully.",
          metadata: {
            eventType: "USER_UPDATED",
          },
        });
        break;

      case "DELETED":
        // Không tạo notification vì user đã bị xóa
        console.log(`User ${userId} deleted. No notification created.`);
        return;

      default:
        console.log("Unknown user event type:", eventType);
        return;
    }
    if (notification) {
      await notification.save();
      console.log(`Notification created for user ${userId}`);
    }
  } catch (error) {
    console.log("Error handling user event: ", error);
    throw error;
  }
};

const handleTaskEvent = async (event) => {
  try {
    console.log("Processing task event:", event);

    const { eventType, taskId, userId, title, status } = event;

    let notification = null;

    switch (eventType) {
      case "CREATED":
        notification = new Notification({
          userId,
          type: "TASK_CREATED",
          title: "New Task Created",
          message: `You created a new task: "${title}"`,
          metadata: {
            taskId,
            taskTitle: title,
            eventType: "TASK_CREATED",
          },
        });
        break;

      case "UPDATED":
        notification = new Notification({
          userId,
          type: "TASK_UPDATED",
          title: "Task Updated",
          message: `Task "${title}" has been updated. Status: ${status}`,
          metadata: {},
        });
        break;

      case "DELETED":
        notification = new Notification({
          userId,
          type: "TASK_DELETED",
          title: "Task Deleted",
          message: `Task "${title}" has been deleted.`,
          metadata: { taskId, taskTitle: title, eventType: "TASK_DELETED" },
        });
        break;

      default:
        console.log("Unknown task event type:", eventType);
        return;
    }

    if (notification) {
      await notification.save();
      console.log(`Notification created for user ${userId}`);
    }
  } catch (error) {
    console.error("Error handling task event:", error);
    throw error;
  }
};
