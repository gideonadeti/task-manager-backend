import { Router } from "express";
import { handleSignUpPost, handleRefreshTokenPost, handleSignInPost } from "../controllers/auth";

const router = Router();

router.post("/sign-up", handleSignUpPost);
router.post("/refresh-token", handleRefreshTokenPost);
router.post("/sign-in", handleSignInPost);

export default router;
