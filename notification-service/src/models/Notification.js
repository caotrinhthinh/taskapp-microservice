import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "TASK_CREATED",
        "TASK_UPDATED",
        "TASK_DELETED",
        "USER_CREATED",
        "SYSTEM",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    metadata: {
      taskId: String,
      taskTitle: String,
      oldStatus: String,
      newStatus: String,
      eventType: String,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

// Biến schema thanh model thực tế để làm việc với MongoDB
const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
