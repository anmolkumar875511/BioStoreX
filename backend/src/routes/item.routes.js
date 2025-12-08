import { Router } from "express";
import { addStock, removeStock } from "../controllers/stock.controller.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import { authorizeRoles } from "../middlewares/authRoles.js";
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