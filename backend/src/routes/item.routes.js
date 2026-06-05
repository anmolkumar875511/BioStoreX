import { Router } from "express";
import { addStock, getAllItems, getItemById, removeStock } from "../controllers/item.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authRoles.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.get(
    "/all",
    verifyJWT,
    getAllItems
);

router.get(
    "/:id",
    verifyJWT,
    getItemById
);

router.post(
    "/add-stock",
    verifyJWT,
    authorizeRoles("Storekeeper"),
    upload.single("image"),
    addStock
);

router.post(
    "/remove-stock",
    verifyJWT,
    authorizeRoles("Storekeeper"),
    removeStock
);


export default router;
