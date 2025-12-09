import { ApiError } from "../utils/ApiError.js";

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user || !allowedRoles.includes(req.user.role)) {
                return res.status(403).json(
                    new ApiError(403, "Access denied: Insufficient permissions")
                );
            }
            next();
        } catch (error) {
            return res.status(500).json(
                new ApiError(500, "Internal server error")
            );
        }
    };
};
