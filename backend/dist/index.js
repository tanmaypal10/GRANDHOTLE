"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./lib/db");
const auth_1 = __importDefault(require("./routes/auth"));
const rooms_1 = __importDefault(require("./routes/rooms"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const testimonials_1 = __importDefault(require("./routes/testimonials"));
const gallery_1 = __importDefault(require("./routes/gallery"));
const stats_1 = __importDefault(require("./routes/stats"));
// Load Environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
(0, db_1.connectDB)();
// Middlewares
app.use((0, cors_1.default)({
    origin: "*", // Adjust in production to frontend url
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express_1.default.json({ limit: "10mb" })); // Support base64 image uploads
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// Routes
app.use("/api/auth", auth_1.default);
app.use("/api/rooms", rooms_1.default);
app.use("/api/bookings", bookings_1.default);
app.use("/api/testimonials", testimonials_1.default);
app.use("/api/gallery", gallery_1.default);
app.use("/api/stats", stats_1.default);
// Health check route
app.get("/", (_req, res) => {
    res.json({ message: "Welcome to the Grand Hotel API", status: "ok" });
});
// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
