import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173")
    .split(",")
    .map((origin) => origin.trim());


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));


app.use(cookieParser());


app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);


import userRouter from "./routes/user.routes.js";
app.use("/api/v1/user", userRouter);


import requestRouter from "./routes/request.route.js";
app.use("/api/v1/request", requestRouter);


import itemRouter from "./routes/item.routes.js";
app.use("/api/v1/item", itemRouter);


import adminRoutes from "./routes/admin.routes.js";
app.use("/api/v1/admin", adminRoutes);


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message: err.message || "Internal server error",
        errors: err.errors || [],
        data: null,
    });
});


export { app };
