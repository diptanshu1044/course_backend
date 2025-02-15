import express, { json, urlencoded } from "express";
import cors from "cors";
import { config } from "dotenv";
import { connectDB } from "./utils/connectDb.js";
import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";
import courseRouter from "./routes/course.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import chatRouter from "./routes/chat.route.js";

config();

const PORT = process.env.PORT || 3000;

const app = express();
connectDB();

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);
app.use("/api/course", courseRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/chat", chatRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
