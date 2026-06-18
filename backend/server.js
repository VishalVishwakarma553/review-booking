import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import storesRoutes from "./routes/stores.js";
import ownerRoutes from "./routes/owner.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Define port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://review-booking.vercel.app"],
  credentials: true,
}));
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Review Book API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stores", storesRoutes);
app.use("/api/owner", ownerRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});