import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import appRouter from "./routers/index.js";

const port = 8000;
const app = express();
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/jobs')
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