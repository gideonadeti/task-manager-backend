import { Router } from "express";
import { handleSignUpPost } from "../controllers/auth";

const router = Router();

router.post("/sign-up", handleSignUpPost);

export default router;
