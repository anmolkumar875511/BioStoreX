import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
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
    }
}, { timestamps: true });


export const User = mongoose.model("User", userSchema);