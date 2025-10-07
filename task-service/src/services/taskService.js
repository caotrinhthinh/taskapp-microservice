import Task from "../models/Task.js";

export const getAllTasks = async (filter = {}) => {
  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  return tasks;
};

export const getTaskById = async (taskId) => {
  const task = await Task.findById(taskId);
  return task;
};

export const createTask = async (taskData) => {
  const newTask = new Task(taskData);
  await newTask.save();
  return newTask;
};

export const updateTask = async (taskId, updateData) => {
  const task = await Task.findByIdAndUpdate(taskId, updateData, {
    new: true,
    runValidators: true, // trả về document mới và validate dữ liệu
  });
  if (!task) return null;

  // Gán tất cả property từ updateData vào document task.
  //   Object.assign(task, updateData);
  //   await task.save();
  return task;
};

export const deleteTask = async (taskId) => {
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) return null;

  const taskInfo = {
    taskId: task._id.toString(),
    userId: task.userId,
    title: task.title,
    status: task.status,
  };

  return taskInfo;
};

export const getTasksByUserId = async (userId) => {
  const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
  return tasks;
};
