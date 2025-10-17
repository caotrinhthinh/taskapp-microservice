import amqp from "amqplib";

let channel = null;
let connection = null;

export const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    await channel.assertExchange(process.env.RABBITMQ_EXCHANGE, "topic", {
      durable: true,
    });

    console.log("RabbitMQ Connected");

    connection.on("close", () => {
      console.log("RabbitMQ Connection Closed");
    });

    connection.on("error", (err) => {
      console.error("RabbitMQ Connection Error:", err);
    });
  } catch (error) {
    console.error("RabbitMQ Connection Failed:", error.message);
    setTimeout(connectRabbitMQ, 5000);
  }
};

export const consumeMessages = async (queueName, callback) => {
  try {
    if (!channel) {
      throw new Error("RabbitMQ channel is not initialized");
    }

    // Khai báo (tạo mới nếu chưa có) hoặc kiểm tra sự tồn tại của một queue trong RabbitMQ.
    await channel.assertQueue(queueName, { durable: true });
    // Kênh (channel) này chỉ được nhận 1 message tại một thời điểm từ RabbitMQ,
    // và sẽ không nhận message tiếp theo cho đến khi nó xử lý xong (gửi ack message đó).
    await channel.prefetch(1);

    console.log(`Listening for messages on queue: ${queueName}`);

    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        try {
          const content = JSON.parse(msg.content.toString());
          console.log(`Message received from ${queueName}:`, content);

          await callback(content);
          channel.ack(msg);
        } catch (error) {
          console.error("Error processing message:", error.message);
          // Message quay lại queue
          channel.nack(msg, false, true);
        }
      }
    });
  } catch (error) {
    console.error("Failed to consume messages:", error.message);
    throw error;
  }
};

export const closeConnection = async () => {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    console.log("RabbitMQ Connection Closed");
  } catch (error) {
    console.error("Error closing RabbitMQ connection:", error.message);
  }
};
