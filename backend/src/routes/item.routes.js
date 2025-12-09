import { Router } from "express";
import { addStock, removeStock } from "../controllers/item.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authRoles.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post(
    "/add-stock",
    verifyJWT,
    authorizeRoles("STOREKEEPER"),
    upload.single("image"),
    addStock
);

router.post(
    "/remove-stock",
    verifyJWT,
    authorizeRoles("STOREKEEPER"),
    removeStock
);


export default router;