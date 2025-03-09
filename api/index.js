import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import cookieParser from "cookie-parser";
import reviewRoutes from "./routes/reviews.js";
import bookingRoutes from "./routes/bookings.js";
import reportRoutes from "./routes/reports.js";


const app = express();
dotenv.config();

app.use(cors({
  origin: "http://localhost:5173", // Allow requests from your frontend (Vite dev server)
  methods: "GET, POST, PUT, DELETE",
  credentials: true, // If you are using cookies
})); // This allows all origins; you can restrict it to specific origins if needed
app.use(express.json());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

//middlewares

app.use(cookieParser())
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);
// Add review routes
app.use("/api/reviews", reviewRoutes);
// Add the booking routes
app.use("/api/bookings", bookingRoutes);
// Add the report routes
app.use("/api/reports", reportRoutes);



app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(8800, () => {
  connect();
  console.log("Connected to backend.");
});