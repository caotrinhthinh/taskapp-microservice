import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "TODO",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },

    // Reference to the User Service
    userId: {
      type: Number,
      required: [true, "User ID is required"],
      index: true,
    },

    // Lưu thông tin user để tránh phải query User Service mỗi lần
    userInfo: {
      username: String,
      email: String,
      fullName: String,
    },

    dueDate: {
      type: Date,
    },

    tags: [
      {
        type: String,
        trim: true,
        maxlength: [50, "Tag cannot exceed 50 characters"],
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false, // Loại bỏ trường __v
  }
);

// Indexes for performance optimization
taskSchema.index({ userId: 1 });
taskSchema.index({ createAt: -1 });

// Virtual đẻ format dueDate
taskSchema.virtual("isOverdue").get(function () {
  return (
    this.dueDate && this.dueDate < new Date() && this.status !== "COMPLETED"
  );
});

// Đảm bảo virtuals được bao gồm khi chuyển đổi sang JSON
taskSchema.set("toJSON", { virtuals: true });
taskSchema.set("toObject", { virtuals: true });

const Task = mongoose.model("Task", taskSchema);

export default Task;
