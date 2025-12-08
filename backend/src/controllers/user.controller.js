import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();  // FIXED

        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};



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

    return res.status(201).json(
        new ApiResponse(201, createdUser, "Student registered successfully")
    );
});




const loginUser = asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body;

    if (!userName && !email) {
        throw new ApiError(400, "Email or username is required");
    }

    const user = await User.findOne({
        $or: [
            { userName: userName?.toLowerCase() },
            { email: email?.toLowerCase() }
        ]
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isValidPassword = await user.isPasswordCorrect(password);
    if (!isValidPassword) {
        throw new ApiError(401, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id); // FIXED

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken"); // FIXED

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken, user: loggedInUser },
                "User logged in successfully"
            )
        );
});





const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { refreshToken: undefined },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});




export { registerUser, loginUser, logoutUser };
