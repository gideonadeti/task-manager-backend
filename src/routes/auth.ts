import { Router } from "express";

import {
  handleSignUpPost,
  handleRefreshTokenPost,
  handleSignInPost,
  handleGoogleCallbackGet,
} from "../controllers/auth";
import google from "../middlewares/google";
import googleCallback from "../middlewares/google-callback";

const router = Router();

router.post("/sign-up", handleSignUpPost);
router.post("/refresh-token", handleRefreshTokenPost);
router.post("/sign-in", handleSignInPost);

router.get("/google", google);
router.get("/google/callback", googleCallback, handleGoogleCallbackGet);

export default router;
