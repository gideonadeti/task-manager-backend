import { Router } from "express";
import { handleSignUpPost, handleRefreshTokenPost } from "../controllers/auth";

const router = Router();

router.post("/sign-up", handleSignUpPost);
router.post("/refresh-token", handleRefreshTokenPost);

export default router;
