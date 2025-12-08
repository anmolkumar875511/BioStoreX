import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Body parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Cookie parser
app.use(cookieParser());

// CORS
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

// import routers
import userRouter from "./routes/user.routes.js";
// import itemRouter from "./routes/item.routes.js";
// import stockLogRouter from "./routes/stock-log.routes.js";
// import issueLogRouter from "./routes/issue-log.routes.js";

app.use("/api/v1/user", userRouter);
// app.use("/api/v1/item", itemRouter);
// app.use("/api/v1/stock-log", stockLogRouter);
// app.use("/api/v1/issue-log", issueLogRouter);


export { app };
