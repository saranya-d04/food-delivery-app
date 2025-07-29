import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Make sure your connection string is inside quotes and correct
    await mongoose.connect(
      "mongodb+srv://food-del:fooddel123456@cluster0.ko0tlzm.mongodb.net/food-del?retryWrites=true&w=majority"
    );
    console.log("DB Connected");
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1); // exit process if connection fails
  }
};
