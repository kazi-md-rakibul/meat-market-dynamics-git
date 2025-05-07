/**
 * Main Routes Configuration
 * This file organizes all API routes into logical groups and applies middleware where needed.
 */

const express = require('express');
const router = express.Router();

// Import all controllers
const productController = require('../controllers/productController');
const productionController = require('../controllers/productionController');
const demandController = require('../controllers/demandController');
const supplyController = require('../controllers/supplyController');
const warehouseController = require('../controllers/warehouseController');
const marketController = require('../controllers/marketController');
const analyticsController = require('../controllers/analyticsController');
const recommendationController = require('../controllers/recommendationController');
const directoryController = require('../controllers/directoryController');
const processingUnitController = require('../controllers/processingUnitController');
const cattleController = require('../controllers/cattleController');
const deliveryController = require('../controllers/deliveryController');
const orderController = require('../controllers/orderController');

// Import middleware
const { validateRequest } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');

/**
 * Product Management Routes
 * Handles all product-related operations
 */
router.route('/products')
    .get(productController.getProducts)
    .post(validateRequest, productController.createProduct);

router.route('/products/:id')
    .get(productController.getProductById)
    .put(validateRequest, productController.updateProduct)
    .delete(productController.deleteProduct);

/**
 * Production Management Routes
 * Handles production batches and livestock statistics
 */
router.route('/production/batches')
    .get(productionController.getProductionBatches)
    .post(validateRequest, productionController.createBatch);

router.route('/production/batches/:id')
    .put(validateRequest, productionController.updateBatch)
    .delete(productionController.deleteBatch);

router.get('/production/livestock', productionController.getLivestockStats);

/**
 * Demand Analysis Routes
 * Handles consumer data and demand analysis
 */
router.route('/consumers')
    .get(demandController.getAllConsumers)
    .post(validateRequest, demandController.createConsumer);

router.route('/consumers/:id')
    .put(validateRequest, demandController.updateConsumer)
    .delete(demandController.deleteConsumer);

router.get('/demand/consumer-stats', demandController.getConsumerStats);
router.get('/demand/regional', demandController.getRegionalConsumption);
router.get('/demand/seasonal', demandController.getSeasonalConsumption);
router.get('/consumers-direct', demandController.getConsumersDirect);

/**
 * Supply Chain Routes
 * Handles inventory and logistics management
 */
router.get('/supply/inventory', supplyController.getInventory);
router.get('/supply/logistics', supplyController.getLogistics);

/**
 * Warehouse Management Routes
 */
router.route('/warehouses')
    .get(warehouseController.getWarehouses)
    .post(validateRequest, warehouseController.createWarehouse);

router.route('/warehouses/:id')
    .put(validateRequest, warehouseController.updateWarehouse)
    .delete(warehouseController.deleteWarehouse);

/**
 * Market Analysis Routes
 * Handles price trends and regional market data
 */
router.get('/market/trends', marketController.getPriceTrends);
router.get('/market/regional', marketController.getRegionalPrices);
router.post('/market/prices', validateRequest, marketController.recordPrice);

/**
 * Analytics Routes
 * Provides supply-demand analysis and forecasting
 */
router.get('/analytics/gap', analyticsController.getSupplyDemandGap);
router.get('/analytics/forecast', analyticsController.getDemandForecast);

/**
 * Recommendations Routes
 * Provides farm-specific recommendations
 */
router.get('/recommendations/farm/:farmId', recommendationController.getFarmerRecommendations);

/**
 * Directory Management Routes
 * Handles vendor and farmer directory operations
 */
router.route('/directory/vendors')
    .get(directoryController.getVendors)
    .post(validateRequest, directoryController.createVendor);

router.route('/directory/vendors/:id')
    .put(validateRequest, directoryController.updateVendor)
    .delete(directoryController.deleteVendor);

router.route('/directory/farmers')
    .get(directoryController.getFarmers)
    .post(validateRequest, directoryController.createFarmer);

router.route('/directory/farmers/:id')
    .put(validateRequest, directoryController.updateFarmer)
    .delete(directoryController.deleteFarmer);

/**
 * Processing Unit Routes
 */
router.route('/processing-units')
    .get(processingUnitController.getProcessingUnits)
    .post(validateRequest, processingUnitController.createProcessingUnit);

router.route('/processing-units/:id')
    .get(processingUnitController.getProcessingUnitById)
    .put(validateRequest, processingUnitController.updateProcessingUnit)
    .delete(processingUnitController.deleteProcessingUnit);

/**
 * Cattle Management Routes
 */
router.route('/cattle')
    .get(cattleController.getAllCattle)
    .post(validateRequest, cattleController.createCattle);

router.route('/cattle/:id')
    .get(cattleController.getCattleById)
    .put(validateRequest, cattleController.updateCattle)
    .delete(cattleController.deleteCattle);

router.get('/cattle/processing-unit/:unitId', cattleController.getCattleByProcessingUnit);

/**
 * Delivery Management Routes
 */
router.route('/deliveries')
    .get(deliveryController.getAllDeliveries)
    .post(validateRequest, deliveryController.createDelivery);

router.route('/deliveries/:id')
    .get(deliveryController.getDeliveryById)
    .put(validateRequest, deliveryController.updateDelivery)
    .delete(deliveryController.deleteDelivery);

router.get('/deliveries/warehouse/:warehouseId', deliveryController.getDeliveriesByWarehouse);
router.get('/deliveries/batch/:batchId', deliveryController.getDeliveriesByBatch);

/**
 * Order Management Routes
 */
router.route('/orders')
    .get(orderController.getAllOrders)
    .post(validateRequest, orderController.createOrder);

router.route('/orders/:id')
    .get(orderController.getOrderById)
    .put(validateRequest, orderController.updateOrder)
    .delete(orderController.deleteOrder);

router.get('/orders/delivery/:deliveryId', orderController.getOrdersByDelivery);

// Export the router
module.exports = router;