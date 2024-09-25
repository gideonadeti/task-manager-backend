import { Router } from "express";

import auth from "../middlewares/auth";
import { handleUserDataGet } from "../controllers/index";
import { handleTasksPost } from "../controllers/index";

const router = Router();

router.get("/user-data", auth, handleUserDataGet);

router.post("/tasks", auth, handleTasksPost);

export default router;
