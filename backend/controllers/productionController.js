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
  
  try {
    // Validate required fields
    if (!req.body.unit_ID) {
      return res.status(400).json({ message: 'Processing unit ID is required' });
    }
    if (!req.body.total_Weight) {
      return res.status(400).json({ message: 'Total weight is required' });
    }
    if (!req.body.batch_Status) {
      return res.status(400).json({ message: 'Batch status is required' });
    }
    if (!req.body.dateRange || !Array.isArray(req.body.dateRange) || req.body.dateRange.length !== 2) {
      return res.status(400).json({ message: 'Valid date range is required' });
    }

    // First check if the MeatBatch table exists and has the expected structure
    try {
      await db.query('DESCRIBE MeatBatch');
    } catch (tableErr) {
      console.error('MeatBatch table issue:', tableErr);
      return res.status(500).json({ 
        message: 'Database schema issue with MeatBatch table',
        error: tableErr.message 
      });
    }

    const batchData = {
      unit_ID: req.body.unit_ID,
      warehouse_ID: req.body.warehouse_ID || null,
      total_Weight: req.body.total_Weight,
      batch_Status: req.body.batch_Status,
      production_Date: new Date(req.body.dateRange[0]).toISOString().split('T')[0],
      expiration_Date: new Date(req.body.dateRange[1]).toISOString().split('T')[0]
    };

    console.log("Attempting to insert batch with data:", batchData);
    
    // Check if the unit_ID exists in the ProcessingUnit table
    const [units] = await db.query('SELECT unit_ID FROM ProcessingUnit WHERE unit_ID = ?', [batchData.unit_ID]);
    if (units.length === 0) {
      return res.status(400).json({ message: 'Invalid processing unit ID' });
    }
    
    // Check if the warehouse_ID exists in the Warehouse table (if provided)
    if (batchData.warehouse_ID) {
      const [warehouses] = await db.query('SELECT warehouse_ID FROM Warehouse WHERE warehouse_ID = ?', [batchData.warehouse_ID]);
      if (warehouses.length === 0) {
        return res.status(400).json({ message: 'Invalid warehouse ID' });
      }
    }

    // Try inserting with a direct SQL query to see any specific errors
    try {
      // First check if warehouse_ID column exists in MeatBatch table
      const [columns] = await db.query('SHOW COLUMNS FROM MeatBatch');
      const hasWarehouseId = columns.some(col => col.Field === 'warehouse_ID');
      
      let query;
      let values;
      
      if (hasWarehouseId) {
        // If warehouse_ID column exists, include it in the query
        query = `INSERT INTO MeatBatch 
          (unit_ID, warehouse_ID, total_Weight, batch_Status, production_Date, expiration_Date) 
          VALUES (?, ?, ?, ?, ?, ?)`;
        
        values = [
          batchData.unit_ID,
          batchData.warehouse_ID,
          batchData.total_Weight,
          batchData.batch_Status,
          batchData.production_Date,
          batchData.expiration_Date
        ];
      } else {
        // If warehouse_ID column doesn't exist, exclude it from the query
        console.log('warehouse_ID column not found in MeatBatch table, excluding it from insert');
        query = `INSERT INTO MeatBatch 
          (unit_ID, total_Weight, batch_Status, production_Date, expiration_Date) 
          VALUES (?, ?, ?, ?, ?)`;
        
        values = [
          batchData.unit_ID,
          batchData.total_Weight,
          batchData.batch_Status,
          batchData.production_Date,
          batchData.expiration_Date
        ];
      }
      
      console.log('Executing query:', query, 'with values:', values);
      const [result] = await db.query(query, values);
      
      console.log("Batch created successfully with ID:", result.insertId);
      res.status(201).json({ batch_ID: result.insertId, message: 'Batch created successfully' });
    } catch (insertErr) {
      console.error('Specific insert error:', insertErr);
      return res.status(400).json({ 
        message: 'Failed to insert batch data',
        error: insertErr.message,
        sqlState: insertErr.sqlState,
        code: insertErr.code
      });
    }
  } catch (err) {
    console.error('Database error during batch creation:', err);
    res.status(400).json({ 
      message: 'Failed to create batch',
      error: err.message 
    });
  }
};