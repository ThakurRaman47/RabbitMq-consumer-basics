const express= require('express')
const router = express.Router()

const testController = require('../controllers/testController')

router.post('/consume',testController.sendRabbitMqMsg)

module.exports = router