const express = require('express');
const router = express.Router();
const consumerController = require('../controllers/consumerController');

// Get all consumers
router.get('/', consumerController.getAllConsumers);

// Get consumer by ID
router.get('/:id', consumerController.getConsumerById);

// Create a new consumer
router.post('/', consumerController.createConsumer);

// Update a consumer
router.put('/:id', consumerController.updateConsumer);

// Delete a consumer
router.delete('/:id', consumerController.deleteConsumer);

module.exports = router;
