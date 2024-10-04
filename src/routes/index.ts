import { Router } from "express";

import auth from "../middlewares/auth";
import {
  handleUserDataGet,
  handleTasksPost,
  handleTaskGroupsPost,
} from "../controllers/index";

const router = Router();

router.get("/user-data", auth, handleUserDataGet);

router.post("/tasks", auth, handleTasksPost);
router.post("/task-groups", auth, handleTaskGroupsPost);

export default router;
