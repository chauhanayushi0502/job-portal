import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import appRouter from "./routers/index.js";
import dotenv from "dotenv"


const port = process.env.PORT || 3000;
const app = express();

dotenv.config();

app.use(cors({
  origin: process.env.ORIGINS.split(",").map((e) => e),
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.DB_URL)
  .then(() => console.log("DB connected"))
  .catch(err => console.log("DB error:", err.message));

app.use("/api", appRouter);
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});