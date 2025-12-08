import { User } from "../models/user.model.js";

export const createDefaultAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ role: "Admin" });

        if (existingAdmin) {
            console.log("✓ Admin already exists:", existingAdmin.email);
            return;
        }

        const adminUser = await User.create({
            userName: "admin",
            fullName: "System Administrator",
            email: "admin@biostorex.com",
            password: "Admin@123", 
            role: "Admin",
            isActive: true
        });

        console.log("✓ Default Admin created:");
        console.log("   Email:", adminUser.email);
        console.log("   Password: Admin@123");

    } catch (error) {
        console.error("Error creating default Admin:", error);
    }
};
