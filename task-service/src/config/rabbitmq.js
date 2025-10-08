import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10, // Số lượng connection tối đa trong pool
      serverSelectionTimeoutMS: 5000, // Timeout khi chọn server
      socketTimeoutMS: 45000, // Timeout cho socket
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Log khi connection bị disconnected
    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected!");
    });

    // Log khi connection error
    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDatabase;
