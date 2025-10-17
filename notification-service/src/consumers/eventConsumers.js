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
  } catch (error) {}
};
