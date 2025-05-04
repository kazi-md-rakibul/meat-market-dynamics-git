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

// 1. Product Information
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.post('/createProducts', productController.createProduct);
router.post('/delete-product', productController.deleteProduct);
router.post('/edit-product', productController.updateProduct);


// 2. Production Data
router.get('/production/batches', productionController.getProductionBatches);
router.get('/batches', productionController.getProductionBatches);
router.get('/production/livestock', productionController.getLivestockStats);
router.post('/create-production/batches', productionController.createBatch);
router.post('/delete-batches', productionController.deleteBatch);
router.post('/edit-batches', productionController.updateBatch);

// 3. Consumer Demand
router.get('/demand/checkTables', demandController.checkTables);
router.get('/consumers-direct', demandController.getConsumersDirect);
router.get('/demand/consumer-stats', demandController.getConsumerStats);
router.get('/demand/regional', demandController.getRegionalConsumption);
router.get('/demand/seasonal', demandController.getSeasonalConsumption);

// Consumer Management
router.get('/consumers', demandController.getAllConsumers);
router.post('/consumers', demandController.createConsumer);
router.put('/consumers/:id', async (req, res) => {
  try {
    console.log('Updating consumer with ID:', req.params.id);
    console.log('Update data:', req.body);
    
    const db = require('../config/db');
    const consumerId = req.params.id;
    
    // Validate input
    if (!consumerId) {
      return res.status(400).json({ message: 'Consumer ID is required' });
    }
    
    // Check if consumer exists
    const [consumer] = await db.query(
      'SELECT * FROM `consumer` WHERE consumer_ID = ?',
      [consumerId]
    );
    
    console.log('Found consumer:', consumer);
    
    if (consumer.length === 0) {
      return res.status(404).json({ message: 'Consumer not found' });
    }
    
    // Update consumer
    const { preferred_Meat_Type, preferred_Cut, average_Order_Size, average_Spending } = req.body;
    
    // Ensure numeric values
    const orderSize = Number(average_Order_Size);
    const spending = Number(average_Spending);
    
    if (isNaN(orderSize) || isNaN(spending)) {
      return res.status(400).json({ message: 'Order size and spending must be valid numbers' });
    }
    
    const [updateResult] = await db.query(
      `UPDATE \`consumer\` 
       SET preferred_Meat_Type = ?, 
           preferred_Cut = ?, 
           average_Order_Size = ?, 
           average_Spending = ? 
       WHERE consumer_ID = ?`,
      [preferred_Meat_Type, preferred_Cut, orderSize, spending, consumerId]
    );
    
    console.log('Update result:', updateResult);
    
    res.status(200).json({ 
      message: 'Consumer updated successfully',
      consumer_ID: consumerId,
      affectedRows: updateResult.affectedRows
    });
  } catch (error) {
    console.error('Error updating consumer:', error);
    res.status(500).json({ 
      message: 'Server error updating consumer', 
      error: error.message,
      stack: error.stack 
    });
  }
});

router.delete('/consumers/:id', async (req, res) => {
  try {
    console.log('Deleting consumer with ID:', req.params.id);
    
    const db = require('../config/db');
    const consumerId = req.params.id;
    
    // Check if consumer is referenced in orders
    const [orders] = await db.query(
      'SELECT COUNT(*) as count FROM `order` WHERE consumer_ID = ?',
      [consumerId]
    );
    
    console.log('Orders referencing this consumer:', orders[0].count);
    
    if (orders[0].count > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete consumer. It is referenced in orders. Delete the orders first.' 
      });
    }
    
    // Delete consumer
    const [result] = await db.query(
      'DELETE FROM `consumer` WHERE consumer_ID = ?',
      [consumerId]
    );
    
    console.log('Delete result:', result);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Consumer not found' });
    }
    
    res.status(200).json({ 
      message: 'Consumer deleted successfully',
      consumer_ID: consumerId,
      affectedRows: result.affectedRows
    });
  } catch (error) {
    console.error('Error deleting consumer:', error);
    res.status(500).json({ 
      message: 'Server error deleting consumer', 
      error: error.message,
      stack: error.stack
    });
  }
});

// 4. Supply Tracking
router.get('/supply/inventory', supplyController.getInventory);
router.get('/supply/logistics', supplyController.getLogistics);

// 11. Warehouse Management
router.get('/get-warehouse', warehouseController.getWarehouses);
router.post('/create-warehouse', warehouseController.createWarehouse);
router.post('/delete-warehouse/:id', warehouseController.deleteWarehouse);
router.post('/update-warehouse/:id', warehouseController.updateWarehouse);

// 5. Market Prices
router.get('/market/trends', marketController.getPriceTrends);
router.get('/market/regional', marketController.getRegionalPrices);
router.post('/market/prices', marketController.recordPrice);

// 6. Analytics
router.get('/analytics/gap', analyticsController.getSupplyDemandGap);
router.get('/analytics/forecast', analyticsController.getDemandForecast);

// 7. Recommendations
router.get('/recommendations/farm/:farmId', recommendationController.getFarmerRecommendations);

// 8. Directories
router.get('/directory/vendors', directoryController.getVendors);
router.get('/directory/farmers', directoryController.getFarmers);
router.post('/directory/vendors', directoryController.createVendor);
router.post('/directory/add-farmer', directoryController.createFarmer);
router.post('/directory/delete-farmer', directoryController.deleteFarmer);
router.post('/directory/update-farmer', directoryController.updateFarmer);
router.post('/directory/update-vendor', directoryController.updateVendor);
router.post('/directory/delete-vendor', directoryController.deleteVendor);


// 9. Processing Unit 
router.get('/processing-unit', processingUnitController.getProcessingUnits);
router.get('/processing-unit/:id', processingUnitController.getProcessingUnitById);
router.post('/create-processing-unit', processingUnitController.createProcessingUnit);
router.post('/delete-processing-unit', processingUnitController.deleteProcessingUnit);
router.post('/update-processing-unit/:id', processingUnitController.updateProcessingUnit);

// 10. Cattle Management
router.get('/cattle', cattleController.getAllCattle);
router.get('/cattle/:id', cattleController.getCattleById);
router.post('/cattle', cattleController.createCattle);
router.put('/cattle/:cattle_ID', cattleController.updateCattle);
router.delete('/cattle/:cattle_ID', cattleController.deleteCattle);
router.get('/cattle/processing-unit/:unit_ID', cattleController.getCattleByProcessingUnit);

// 11. Delivery Management
router.get('/deliveries', deliveryController.getAllDeliveries);
router.get('/deliveries/:id', deliveryController.getDeliveryById);
router.post('/deliveries', deliveryController.createDelivery);
router.put('/deliveries/:delivery_ID', deliveryController.updateDelivery);
router.delete('/deliveries/:delivery_ID', deliveryController.deleteDelivery);
router.get('/deliveries/warehouse/:warehouse_ID', deliveryController.getDeliveriesByWarehouse);
router.get('/deliveries/batch/:batch_ID', deliveryController.getDeliveriesByBatch);

// 12. Order Management
router.get('/orders', orderController.getAllOrders);
router.get('/orders/:id', orderController.getOrderById);
router.post('/orders', orderController.createOrder);
router.put('/orders/:order_ID', orderController.updateOrder);
router.delete('/orders/:order_ID', orderController.deleteOrder);
router.get('/orders/delivery/:delivery_ID', orderController.getOrdersByDelivery);

module.exports = router;