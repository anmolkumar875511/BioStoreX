import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        let token = null;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token && req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            throw new ApiError(401, "Unauthorized: No token provided");
        }

        
        const decoded = jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Unauthorized: User not found");
        }

        if (!user.isActive) {
            throw new ApiError(401, "Unauthorized: User is inactive");
        }

        req.user = user;

        next();
    } catch (error) {
        throw new ApiError(401, "Unauthorized: Invalid or expired token");
    }
});

export default verifyJWT ;
