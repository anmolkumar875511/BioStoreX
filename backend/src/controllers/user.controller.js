import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
    const { userName, fullName, email, password, student } = req.body;


    if ([userName, fullName, email, password].some((f) => !f || f.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }


    if (req.body.role && req.body.role !== "Student") {
        throw new ApiError(403, "Only students can register using this route");
    }


    const existedUser = await User.findOne({
        $or: [
            { userName: userName.toLowerCase() },
            { email: email.toLowerCase() }
        ]
    });

    if (existedUser) {
        throw new ApiError(409, "User with this email or username already exists");
    }

 
    const user = await User.create({
        userName: userName.toLowerCase(),
        fullName,
        email: email.toLowerCase(),
        password,
        role: "Student",
        student: student || {}
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "User registration failed");
    }

    res.status(201).json(
        new ApiResponse(201, createdUser, "Student registered successfully")
    );
});

export { registerUser };
