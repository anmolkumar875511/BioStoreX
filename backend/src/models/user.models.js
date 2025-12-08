import mongoose from 'mongoose';
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { 
        type: String,
        enum: ["Student", "Storekeeper", "Admin"],
        default: "Student"
    },
    isActive: { type: Boolean, default: true },
    student: {
        registrationNo: String,
        year: Number,
    },

    refreshToken: { type: String }

}, { timestamps: true });


userSchema.pre("save", async function (next) {
    if( !this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 11);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function() {
    return jsonwebtoken.sign(
        { _id: this._id, username: this.username, role: this.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
}

userSchema.methods.generateRefreshToken = function () {
    const refreshToken = jsonwebtoken.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    this.refreshToken = refreshToken;
    return refreshToken;
};


export const User = mongoose.model("User", userSchema);
