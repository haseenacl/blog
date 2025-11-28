import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import postroutes from "./routes/postroutes";
import categoryRoutes from "./routes/categoryroutes";  // ⬅️ Added
import commentRoutes from "./routes/commentroutes";
import { errorHandler } from "./middleware/errorHandler";
import { getEnvVariable } from "./utils/helpers";
import cookieParser from "cookie-parser";
import path from "path";
import { setupSwagger } from "./swagger";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Connect Database
connectDB();

// Middlewares
app.use(
  cors({
    origin: [getEnvVariable("FRONT_END_URL")],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

setupSwagger(app);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/posts", postroutes);
app.use("/api", categoryRoutes);   // ⬅️ Correct route mounting
app.use("/api", commentRoutes);

// Root
app.get("/", async (_req, res) => {
  res.send("Hai there, API is running...");
});

// Error handler (must be after routes)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
