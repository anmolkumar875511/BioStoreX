import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, changePassword} from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);


router.post("/logout", verifyJWT, logoutUser);
router.post("/change-password", verifyJWT, changePassword);
router.post("/refresh-token", refreshAccessToken);

export default router;