import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const addStorekeeper = async (req, res, next) => {
    try {
        const { userName, fullName, email, password } = req.body;

        if (!userName || !fullName || !email || !password) {
            throw new ApiError(400, "All fields are required");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApiError(400, "User with this email already exists");
        }

        const storekeeper = await User.create({
            userName,
            fullName,
            email,
            password,
            role: "Storekeeper",
            isBlacklisted: false
        });

        return res.status(201).json(
            new ApiResponse(201, storekeeper, "Storekeeper created successfully")
        );
    } catch (error) {
        next(error);
    }
};

const blacklistUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) throw new ApiError(404, "User not found");

        user.isActive = false;
        await user.save();

        return res
            .status(200)
            .json(new ApiResponse(200, user, "User blacklisted successfully"));
    } catch (error) {
        next(error);
    }
};

const unBlacklistUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) throw new ApiError(404, "User not found");

        user.isActive = true;
        await user.save();

        return res
            .status(200)
            .json(new ApiResponse(200, user, "User un-blacklisted successfully"));
    } catch (error) {
        next(error);
    }
};

export { 
    addStorekeeper,
    blacklistUser,
    unBlacklistUser
};
