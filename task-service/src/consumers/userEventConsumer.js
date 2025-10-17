import { consumeMessages } from "../config/rabbitmq.js";
import Task from "../models/Task.js";

export const startUserEventConsumer = async () => {
  try {
    await consumeMessages(
      process.env.RABBITMQ_QUEUE_USER_EVENTS,
      handleUserEvent
    );
  } catch (error) {
    console.error("Failed to start user event consumer:", error);
  }
};

const handleUserEvent = async (event) => {
  try {
    console.log("Processing user event:", event);

    const { eventType, userId, username, email, fullName } = event;

    switch (eventType) {
      case "CREATED":
        console.log(`New user created: ${username} (ID: ${userId})`);
        break;

      case "UPDATED":
        await updateTasksUserInfo(userId, { username, email, fullName });
        break;

      case "DELETED":
        await deactivateUserTasks(userId);
        break;

      default:
        console.log("Unknown user event type:", eventType);
    }
  } catch (error) {
    console.error("Error handling user event:", error);
    throw error;
  }
};

const updateTasksUserInfo = async (userId, userInfo) => {
  try {
    const result = await Task.updateMany(
      { userId: userId },
      {
        $set: {
          "userInfo.username": userInfo.username,
          "userInfo.email": userInfo.email,
          "userInfo.fullName": userInfo.fullName,
        },
      }
    );

    console.log(
      `Updated userInfo for ${result.modifiedCount} tasks of user ${userId}`
    );
  } catch (error) {
    console.error("Error updating tasks user info:", error);
    throw error;
  }
};

const deactivateUserTasks = async (userId) => {
  try {
    const result = await Task.updateMany(
      { userId: userId },
      { $set: { isActive: false } }
    );

    console.log(`Deactivated ${result.modifiedCount} tasks of user ${userId}`);
  } catch (error) {
    console.error("Error deactivating user tasks:", error);
    throw error;
  }
};
