// rabbitmq.js
import amqp from "amqplib";

let channel = null;
let connection = null;

export const connectRabbitMQ = async () => {
  try {
    const url = process.env.RABBITMQ_URL;

    connection = await amqp.connect(url);
    channel = await connection.createChannel();

    // Khai báo exchange (phải có cùng tên với Spring Boot)
    await channel.assertExchange(process.env.RABBITMQ_EXCHANGE, "topic", {
      durable: true,
    });

    console.log("RabbitMQ connected to CloudAMQP");

    // Listen connection events
    connection.on("close", () => {
      console.warn("RabbitMQ connection closed. Reconnecting...");
      setTimeout(connectRabbitMQ, 5000);
    });

    connection.on("error", (err) => {
      console.error("RabbitMQ connection error:", err.message);
    });
  } catch (error) {
    console.error("RabbitMQ connection failed:", error.message);
    // Tự động thử lại sau 5 giây nếu lỗi
    setTimeout(connectRabbitMQ, 5000);
  }
};

// Consumer
export const consumeMessages = async (queueName, callback) => {
  try {
    if (!channel) throw new Error("RabbitMQ channel not initialized");

    await channel.assertQueue(queueName, { durable: true });
    await channel.bindQueue(
      queueName,
      process.env.RABBITMQ_EXCHANGE,
      "#" // lắng nghe tất cả routing key (hoặc thay bằng user.created nếu muốn cụ thể)
    );
    await channel.prefetch(1);

    console.log(`Listening for messages on queue: ${queueName}`);

    channel.consume(queueName, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          console.log(`Received message from ${queueName}:`, content);
          await callback(content);
          channel.ack(msg);
        } catch (err) {
          console.error("Error processing message:", err.message);
          channel.nack(msg, false, true); // Requeue message
        }
      }
    });
  } catch (err) {
    console.error("Failed to consume messages:", err.message);
  }
};

// Close connection
export const closeConnection = async () => {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    console.log("RabbitMQ connection closed manually");
  } catch (err) {
    console.error("Error closing connection:", err.message);
  }
};
