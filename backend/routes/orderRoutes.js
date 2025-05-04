const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
// Get all orders
router.get('/', orderController.getAllOrders);

// Get order by ID
router.get('/:id', orderController.getOrderById);
