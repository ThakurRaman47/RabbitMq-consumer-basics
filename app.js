const express = require('express');
const router = express.Router();
const { connectRabbitMQ } = require('./consumer.js'); 

// Connect to RabbitMQ
connectRabbitMQ().catch(err => {
  console.error('Failed to connect to RabbitMQ:', err.message);
  process.exit(1);
});

// Route to consume messages

module.exports = router;
