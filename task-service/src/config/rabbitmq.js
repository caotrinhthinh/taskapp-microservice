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

    await channel.assertQueue(process.env.RABBITMQ_QUEUE_TASK_EVENTS, {
      durable: true,
    });

    await channel.bindQueue(
      process.env.RABBITMQ_QUEUE_TASK_EVENTS,
      process.env.RABBITMQ_EXCHANGE,
      "task.*"
    );

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

export const publishMessage = async (routingKey, message) => {
  try {
    if (!channel) {
      throw new Error("RabbitMQ channel is not initialized");
    }

    const messageBuffer = Buffer.from(JSON.stringify(message));

    channel.publish(process.env.RABBITMQ_EXCHANGE, routingKey, messageBuffer, {
      persistent: true,
      contentType: "application/json",
    });

    console.log(`Message published to ${routingKey}:`, message);
  } catch (error) {
    console.error("Failed to publish message:", error.message);
    throw error;
  }
};

export const consumeMessages = async (queueName, callback) => {
  try {
    if (!channel) {
      throw new Error("RabbitMQ channel is not initialized");
    }

    await channel.assertQueue(queueName, { durable: true });
    await channel.prefetch(1); // Mỗi consumer chỉ nhận 1 message tại 1 thời điểm

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
          channel.nack(msg, false, true);
        }
      }
    });
  } catch (error) {
    console.error("Failed to consume message:", error.message);
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
