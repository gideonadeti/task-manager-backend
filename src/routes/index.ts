import { Router } from "express";

import auth from "../middlewares/auth";
import { handleUserGet } from "../controllers/index";

const router = Router();

router.get("/user", auth, handleUserGet);

export default router;
