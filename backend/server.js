import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/event.js";

dotenv.config();

connectDB();

const app = express();
app.use(
  cors({
    origin: "https://event-management-k2wp.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, 
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Expense Tracker API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
