import * as taskService from "../services/taskService.js";

// GET /api/tasks
export const getAllTasks = async (req, res) => {
  try {
    const { userId, status, priority, tags } = req.query;
    const filter = {};
    if (userId) filter.userId = userId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (tags) filter.tags = tags;

    const tasks = await taskService.getAllTasks(filter);
    res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    logger.error("Error in getAllTasks:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// GET /api/tasks/:id
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await taskService.getTaskById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task retrieved successfully",
      data: task,
    });
  } catch (error) {
    logger.error("Error in getTaskById:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// POST /api/tasks
export const createTask = async (req, res) => {
  try {
    // ✅ In log để đảm bảo body thực sự có dữ liệu
    console.log("📥 Incoming task body:", req.body);

    const { title, description, userId, status, tags, ...rest } = req.body;

    // ✅ Kiểm tra input
    if (!title?.trim() || !description?.trim() || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, description, or userId",
        received: req.body, // 👈 giúp debug dễ
      });
    }

    // ✅ Gửi sang service tạo task
    const newTask = await taskService.createTask({
      title: title.trim(),
      description: description.trim(),
      userId,
      status,
      tags,
      ...rest,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: newTask,
    });
  } catch (error) {
    // ✅ Hiển thị lỗi chi tiết (đặc biệt khi lỗi từ Mongoose)
    console.error("❌ Error in createTask:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationErrors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedTask = await taskService.updateTask(id, updateData);
    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    logger.error("Error in updateTask:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTaskInfo = await taskService.deleteTask(id);
    if (!deletedTaskInfo) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: deletedTaskInfo,
    });
  } catch (error) {
    logger.error("Error in deleteTask:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// GET /api/tasks/user/:userId
export const getTasksByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await taskService.getTasksByUserId(userId);
    res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    logger.error("Error in getTasksByUserId:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const logger = {
  error: (message, error) => {
    console.error(message, error);
  },
};

export default logger;
