import { Router } from "express";

import auth from "../middlewares/auth";
import { handleUserDataGet } from "../controllers/index";

const router = Router();

router.get("/user-data", auth, handleUserDataGet);

export default router;
