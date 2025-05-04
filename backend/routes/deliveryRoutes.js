const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

// Get all deliveries
router.get('/', deliveryController.getAllDeliveries);

// Get delivery by ID
router.get('/:id', deliveryController.getDeliveryById);

// Create new delivery
router.post('/', deliveryController.createDelivery);

// Update delivery
router.put('/:delivery_ID', deliveryController.updateDelivery);

// Delete delivery
router.delete('/:delivery_ID', deliveryController.deleteDelivery);

// Get deliveries by warehouse
router.get('/warehouse/:warehouse_ID', deliveryController.getDeliveriesByWarehouse);

// Get deliveries by batch
router.get('/batch/:batch_ID', deliveryController.getDeliveriesByBatch);

module.exports = router;
