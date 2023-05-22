import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoute from './routes/auth.js';
import usersRoute from './routes/users.js';
import hotelsRoute from './routes/hotels.js';
import roomsRoute from './routes/rooms.js';

const app = express();
dotenv.config();

const connect = async () => {
  try{
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to mongoDB');
  }catch(error){
    console.log(error);
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log('mongoDB disconnected');
});

mongoose.connection.on("connected", () => {
  console.log('mongoDB connected');
})

// middleware
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

app.use((err, req, res, next) => {
  return res.status(err.errorStatus || 500).json({
      success: false,
      status: err.errorStatus || 500,
      message: err.errorMessage || "Something went wrong!!!",
      stack: err.stack
  });
})

app.listen(8800, () => {
  connect();
  console.log('connected to backend!');
})