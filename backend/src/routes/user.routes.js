import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    updateUserProfile
} from "../controllers/user.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);


router.post("/logout", verifyJWT, logoutUser);
router.patch("/change-password", verifyJWT, changePassword);
router.patch("/update-profile", verifyJWT, updateUserProfile);
router.patch("/refresh-token", refreshAccessToken);

export default router;