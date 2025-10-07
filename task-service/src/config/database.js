import mongoose from "mongoose";

// Kết nối MongoDB
const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Options để tối ưu connection
      maxPoolSize: 10, // Số lượng connection tối đa trong pool
      serverSelectionTimeoutMS: 5000, // Timeout khi chọn server
      socketTimeoutMS: 45000, // Timeout cho socket
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Log khi connection bị disconnect
    mongoose.connection.on("disconnected", () => {
      console.log("❌ MongoDB Disconnected");
    });

    // Log khi có lỗi
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB Error:", err);
    });
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process nếu không connect được
  }
};

export default connectDatabase;
