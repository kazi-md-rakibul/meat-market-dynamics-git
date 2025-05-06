const db = require('../config/db');

exports.getProductionBatches = async (req, res) => {
  try {
    console.log('Fetching production batches...');
    
    // First check if warehouse_ID column exists in MeatBatch table
    const [columns] = await db.query('SHOW COLUMNS FROM MeatBatch');
    const hasWarehouseId = columns.some(col => col.Field === 'warehouse_ID');
    
    let query;
    if (hasWarehouseId) {
      // If warehouse_ID column exists, use the original query
      query = `
        SELECT 
          mb.batch_ID,
          mb.production_Date,
          mb.expiration_Date,
          mb.total_Weight,
          mb.batch_Status,
          pu.unit_ID,
          pu.facility_Name AS processing_Facility,
          w.warehouse_ID,
          w.address AS warehouse_Address,
          w.storage_Condition AS warehouse_Storage_Condition,
          GROUP_CONCAT(DISTINCT mp.meat_Type) AS meat_Types,
          GROUP_CONCAT(DISTINCT mp.cut_Type) AS cut_Types
        FROM MeatBatch mb
        LEFT JOIN ProcessingUnit pu ON mb.unit_ID = pu.unit_ID
        LEFT JOIN Warehouse w ON mb.warehouse_ID = w.warehouse_ID
        LEFT JOIN MeatProduct mp ON mb.batch_ID = mp.batch_ID
        GROUP BY mb.batch_ID
        ORDER BY mb.production_Date DESC
      `;
    } else {
      // If warehouse_ID column doesn't exist, exclude the warehouse join
      console.log('warehouse_ID column not found in MeatBatch table, excluding warehouse join');
      query = `
        SELECT 
          mb.batch_ID,
          mb.production_Date,
          mb.expiration_Date,
          mb.total_Weight,
          mb.batch_Status,
          pu.unit_ID,
          pu.facility_Name AS processing_Facility,
          NULL AS warehouse_ID,
          NULL AS warehouse_Address,
          NULL AS warehouse_Storage_Condition,
          GROUP_CONCAT(DISTINCT mp.meat_Type) AS meat_Types,
          GROUP_CONCAT(DISTINCT mp.cut_Type) AS cut_Types
        FROM MeatBatch mb
        LEFT JOIN ProcessingUnit pu ON mb.unit_ID = pu.unit_ID
        LEFT JOIN MeatProduct mp ON mb.batch_ID = mp.batch_ID
        GROUP BY mb.batch_ID
        ORDER BY mb.production_Date DESC
      `;
    }
    
    console.log('Executing query:', query);
    const [batches] = await db.query(query);
    console.log(`Retrieved ${batches.length} batches`);
    
    const formattedBatches = batches.map(batch => ({
      ...batch,
      production_Date: new Date(batch.production_Date).toISOString().split('T')[0],
      expiration_Date: new Date(batch.expiration_Date).toISOString().split('T')[0],
      meat_Types: batch.meat_Types ? [...new Set(batch.meat_Types.split(','))] : [],
      cut_Types: batch.cut_Types ? [...new Set(batch.cut_Types.split(','))] : []
    }));
    
    res.json(formattedBatches);
  } catch (err) {
    console.error('Error fetching production batches:', err);
    res.status(500).json({ message: err.message });
  }
};
exports.getLivestockStats = async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        f.farm_Name,
        c.animal_Type,
        c.breed,
        SUM(c.quantity) AS total_quantity,
        AVG(c.average_Weight) AS avg_weight
      FROM Cattle c
      JOIN FarmFarmer f ON c.farm_ID = f.farm_ID
      GROUP BY f.farm_Name, c.animal_Type, c.breed
    `);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createBatch = async (req, res) => {
  console.log("Received batch creation request:", req.body);
  