import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));


app.use(cookieParser());


app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
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



export { app };
