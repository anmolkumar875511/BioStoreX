import { Router } from "express";
import { addStorekeeper, blacklistUser, unBlacklistUser } from "../controllers/admin.controller.js";
import { authorizeRoles } from "../middlewares/authRoles.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/add-storekeeper", verifyJWT, authorizeRoles("Admin"), addStorekeeper);

router.patch("/blacklist/:userId", verifyJWT, authorizeRoles("Admin"), blacklistUser);

router.patch("/unblacklist/:userId", verifyJWT, authorizeRoles("Admin"), unBlacklistUser);

export default router;
