import { Router } from "express";
import { 
    requestItem, 
    approveRequest,
    declineRequest,
    markAsIssued,
    getMyRequests,
    getAllRequests 
} from "../controllers/request.controller.js";

import verifyJWT from "../middlewares/verifyJWT.js";
import { authorizeRoles } from "../middlewares/authRoles.js";

const router = Router();

router.post(
    "/request",
    verifyJWT,
    authorizeRoles("STUDENT"),
    requestItem
);

router.get(
    "/my-requests",
    verifyJWT,
    authorizeRoles("STUDENT"),
    getMyRequests
);




router.get(
    "/",
    verifyJWT,
    authorizeRoles("STOREKEEPER"),
    getAllRequests
);

router.put(
    "/approve/:id",
    verifyJWT,
    authorizeRoles("STOREKEEPER"),
    approveRequest
);

router.put(
    "/decline/:id",
    verifyJWT,
    authorizeRoles("STOREKEEPER"),
    declineRequest
);

router.put(
    "/issue/:id",
    verifyJWT,
    authorizeRoles("STOREKEEPER"),
    markAsIssued
);

export default router;
