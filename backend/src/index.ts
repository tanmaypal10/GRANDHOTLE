import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./lib/db";
import authRoutes from "./routes/auth";
import roomsRoutes from "./routes/rooms";
import bookingsRoutes from "./routes/bookings";
import testimonialsRoutes from "./routes/testimonials";
import galleryRoutes from "./routes/gallery";
import statsRoutes from "./routes/stats";

// Load Environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors({
  origin: "*", // Adjust in production to frontend url
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "10mb" })); // Support base64 image uploads
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/stats", statsRoutes);

// Health check route
app.get("/", (_req, res) => {
  res.json({ message: "Welcome to the Grand Hotel API", status: "ok" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
