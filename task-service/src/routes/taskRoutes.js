import express from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByUserId,
} from "../services/taskService";
const router = express.Router();

router.get("/", getAllTasks); // GET /api/tasks
router.get("/:id", getTaskById); // GET /api/tasks/:id
router.post("/", createTask); // POST /api/tasks
router.put("/:id", updateTask); // PUT /api/tasks/:id
router.delete("/:id", deleteTask); // DELETE /api/tasks/:id
router.get("/user/:userId", getTasksByUserId); // GET /api/tasks/user/:userId

export default router;
