const amqp = require('amqplib');
let channel,connection;

async function consumeMessages(channel) {
  const queueName = 'NewQueue';
  try {
    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        // Process the message
        const message = JSON.parse(msg.content.toString());
        console.log('Received message:', message);  
        // Acknowledge the message (send acknowledgment to RabbitMQ)
        // channel.ack(msg);

        //Reply to producer
        const responseMessage = `Hello from consumer in response to '${msg.content.toString()}'!`;

        const correlationId = msg.properties.correlationId;
        await channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(responseMessage)), {
          correlationId: correlationId
        });
        console.log(`Sent response: ${responseMessage}`);
      }

     }, { noAck: true });
  } catch (error) {
    console.error('Error consuming messages:', error.message);
  }
}

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    console.log('consuming messages through RabbitMQ');
    await consumeMessages(channel);
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error.message);
    throw error;
  }
}

function getChannel() {
  return channel;
}

async function closeConnection() {
  if (channel) {
    channel.close();
  }
  if (connection) {
    connection.close();
  }
}

module.exports = { connectRabbitMQ, consumeMessages }
