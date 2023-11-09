import mongoose from "mongoose";

export const connectDB = async () => {
  mongoose.connect("mongodb://127.0.0.1/googledocs");
  console.log("connected");
};
