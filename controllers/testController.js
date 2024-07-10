const { getChannel, queueName } = require("../consumer");


exports.receiveRabbitMqMsg = async function(req,res) {
  try {
    const channel = getChannel();
    if (!channel) {
      throw new Error('RabbitMQ channel not available');
    }

    // Ensure the queue exists
    await channel.assertQueue(queueName, { durable: false });
    let data = {}
    // Consume messages from the queue
    channel.consume(queueName, (msg) => {
        // Process the message
        console.log('Received message:=>>>', msg.content.toString());
        // Acknowledge the message (send acknowledgment to RabbitMQ)
        data = msg.content.toString()
        // channel.ack(msg);

        // Reply to producer
        const responseMessage = `Hello from consumer in response to '${message}'!`;
        console.log(responseMessage,"response ========>")
        const correlationId = msg.properties.correlationId;
        channel.sendToQueue(msg.properties.replyTo, Buffer.from(responseMessage), {
          correlationId: correlationId
        });
        console.log(`Sent response: ${responseMessage}`);
      }, { noAck: true });

    res.status(200).json({data : data});
  } catch (error) {
    console.error('Error consuming messages:', error.message);
    res.status(500).send('Error consuming messages from RabbitMQ');
  }
}