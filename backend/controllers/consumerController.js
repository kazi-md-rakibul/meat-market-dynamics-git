const db = require('../config/db');

// Get all consumers
exports.getAllConsumers = async (req, res) => {
  try {
    console.log('ConsumerController: Fetching all consumers');
    
    // Direct SQL query to get all consumers
    const [rows] = await db.query('SELECT * FROM `consumer`');
    
    console.log(`ConsumerController: Found ${rows.length} consumers`);
    if (rows.length > 0) {
      console.log('Sample data:', JSON.stringify(rows.slice(0, 2)));
    } else {
      console.log('No consumers found in database');
    }
    
    // Verify the response data is properly formatted
    const formattedRows = rows.map(row => ({
      consumer_ID: row.consumer_ID,
      preferred_Meat_Type: row.preferred_Meat_Type,
      preferred_Cut: row.preferred_Cut,
      average_Order_Size: parseFloat(row.average_Order_Size),
      average_Spending: parseFloat(row.average_Spending)
    }));
    
    console.log(`ConsumerController: Sending ${formattedRows.length} formatted consumers to frontend`);
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(formattedRows);
  } catch (error) {
    console.error('ConsumerController ERROR in getAllConsumers:', error);
    return res.status(500).json({
      message: 'Failed to fetch consumers',
      error: error.message,
      stack: error.stack
    });
  }
};

// Get consumer by ID
exports.getConsumerById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`ConsumerController: Fetching consumer with ID ${id}`);
    
    const [rows] = await db.query('SELECT * FROM `consumer` WHERE consumer_ID = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Consumer not found' });
    }
    
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error('ConsumerController ERROR in getConsumerById:', error);
    return res.status(500).json({
      message: 'Failed to fetch consumer',
      error: error.message
    });
  }
};

// Create new consumer
exports.createConsumer = async (req, res) => {
  try {
    console.log('ConsumerController: Creating new consumer with data:', JSON.stringify(req.body));
    
    // Validate required fields
    const requiredFields = ['preferred_Meat_Type', 'preferred_Cut', 'average_Order_Size', 'average_Spending'];
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        console.log(`ConsumerController: Validation failed - ${field} is missing or empty`);
        return res.status(400).json({ message: `${field} is required` });
      }
    }
    
    // Format data - ensure proper types
    const consumerData = {
      consumer_name: req.body.consumer_name ? String(req.body.consumer_name).trim() : `Consumer ${Date.now().toString().slice(-4)}`,
      preferred_Meat_Type: String(req.body.preferred_Meat_Type).trim(),
      preferred_Cut: String(req.body.preferred_Cut).trim(),
      average_Order_Size: parseFloat(req.body.average_Order_Size),
      average_Spending: parseFloat(req.body.average_Spending),
      // Add consumption pattern fields with default values
      region: req.body.region || 'National',
      season: req.body.season || 'All Year',
      consumption_amount: parseFloat(req.body.consumption_amount || req.body.average_Order_Size),
      record_date: req.body.record_date ? new Date(req.body.record_date) : new Date()
    };
    
    // Additional validation for numeric fields
    if (isNaN(consumerData.average_Order_Size)) {
      console.log('ConsumerController: Invalid average_Order_Size - not a number');
      return res.status(400).json({ message: 'Average order size must be a valid number' });
    }
    
    if (isNaN(consumerData.average_Spending)) {
      console.log('ConsumerController: Invalid average_Spending - not a number');
      return res.status(400).json({ message: 'Average spending must be a valid number' });
    }
    
    if (isNaN(consumerData.consumption_amount)) {
      console.log('ConsumerController: Invalid consumption_amount - not a number');
      consumerData.consumption_amount = consumerData.average_Order_Size;
    }
    
    console.log('ConsumerController: Formatted data for insertion:', JSON.stringify(consumerData));
    
    try {
      // Insert into database using direct object insertion
      const [result] = await db.query('INSERT INTO `consumer` SET ?', consumerData);
      
      console.log('ConsumerController: Consumer created with ID:', result.insertId);
      
      // Fetch the newly created consumer to verify
      const [newConsumer] = await db.query('SELECT * FROM `consumer` WHERE consumer_ID = ?', [result.insertId]);
      console.log('ConsumerController: Verified new consumer:', JSON.stringify(newConsumer[0]));
      
      return res.status(201).json({
        message: 'Consumer created successfully',
        consumer_ID: result.insertId,
        consumer: newConsumer[0] || {
          consumer_ID: result.insertId,
          ...consumerData
        }
      });
    } catch (dbError) {
      console.error('ConsumerController: Database error during insertion:', dbError);
      // Try with explicit column names
      try {
        const sql = `
          INSERT INTO consumer 
          (preferred_Meat_Type, preferred_Cut, average_Order_Size, average_Spending, 
           region, season, consumption_amount, record_date) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
          consumerData.preferred_Meat_Type,
          consumerData.preferred_Cut,
          consumerData.average_Order_Size,
          consumerData.average_Spending,
          consumerData.region,
          consumerData.season,
          consumerData.consumption_amount,
          consumerData.record_date
        ];
        
        console.log('ConsumerController: Trying alternative SQL insertion with values:', values);
        const [altResult] = await db.query(sql, values);
        
        console.log('ConsumerController: Alternative insertion successful with ID:', altResult.insertId);
        
        return res.status(201).json({
          message: 'Consumer created successfully',
          consumer_ID: altResult.insertId,
          consumer: {
            consumer_ID: altResult.insertId,
            ...consumerData
          }
        });
      } catch (altError) {
        console.error('ConsumerController: Alternative insertion also failed:', altError);
        throw dbError; // Throw the original error for the outer catch block
      }
    }
  } catch (error) {
    console.error('ConsumerController ERROR in createConsumer:', error);
    return res.status(500).json({
      message: 'Failed to create consumer',
      error: error.message,
      stack: error.stack
    });
  }
};

// Update consumer
exports.updateConsumer = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`ConsumerController: Updating consumer with ID ${id}`, req.body);
    
    // Validate required fields
    const requiredFields = ['preferred_Meat_Type', 'preferred_Cut', 'average_Order_Size', 'average_Spending'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }
    
    // Check if consumer exists
    const [existingConsumer] = await db.query('SELECT * FROM `consumer` WHERE consumer_ID = ?', [id]);
    if (existingConsumer.length === 0) {
      return res.status(404).json({ message: 'Consumer not found' });
    }
    
    // Format data
    const consumerData = {
      preferred_Meat_Type: req.body.preferred_Meat_Type,
      preferred_Cut: req.body.preferred_Cut,
      average_Order_Size: Number(req.body.average_Order_Size),
      average_Spending: Number(req.body.average_Spending)
    };
    
    // Update consumer name if provided
    if (req.body.consumer_name) {
      consumerData.consumer_name = String(req.body.consumer_name).trim();
    }
    
    // Add consumption pattern fields if provided, otherwise keep existing values
    if (req.body.region) consumerData.region = req.body.region;
    if (req.body.season) consumerData.season = req.body.season;
    if (req.body.consumption_amount) {
      consumerData.consumption_amount = Number(req.body.consumption_amount);
    } else if (req.body.average_Order_Size && !existingConsumer[0].consumption_amount) {
      // If consumption_amount not provided but average_Order_Size is updated, update consumption_amount too
      consumerData.consumption_amount = Number(req.body.average_Order_Size);
    }
    if (req.body.record_date) consumerData.record_date = new Date(req.body.record_date);
    
    // Update in database using direct update
    const updateData = { ...consumerData };
    const [result] = await db.query(
      'UPDATE `consumer` SET ? WHERE consumer_ID = ?',
      [updateData, id]
    );
    
    console.log('ConsumerController: Update result:', result);
    
    return res.status(200).json({
      message: 'Consumer updated successfully',
      consumer_ID: id,
      affectedRows: result.affectedRows,
      consumer: {
        consumer_ID: id,
        ...consumerData
      }
    });
  } catch (error) {
    console.error('ConsumerController ERROR in updateConsumer:', error);
    return res.status(500).json({
      message: 'Failed to update consumer',
      error: error.message
    });
  }
};

// Delete consumer
exports.deleteConsumer = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`ConsumerController: Deleting consumer with ID ${id}`);
    
    // Check if consumer exists
    const [existingConsumer] = await db.query('SELECT * FROM `consumer` WHERE consumer_ID = ?', [id]);
    if (existingConsumer.length === 0) {
      return res.status(404).json({ message: 'Consumer not found' });
    }
    
    // Check if consumer is referenced in orders
    const [orders] = await db.query('SELECT COUNT(*) as count FROM `order` WHERE consumer_ID = ?', [id]);
    if (orders[0].count > 0) {
      return res.status(400).json({
        message: 'Cannot delete consumer. It is referenced in orders. Delete the orders first.'
      });
    }
    
    // Delete from database
    const [result] = await db.query('DELETE FROM `consumer` WHERE consumer_ID = ?', [id]);
    
    console.log('ConsumerController: Delete result:', result);
    
    return res.status(200).json({
      message: 'Consumer deleted successfully',
      consumer_ID: id,
      affectedRows: result.affectedRows
    });
  } catch (error) {
    console.error('ConsumerController ERROR in deleteConsumer:', error);
    return res.status(500).json({
      message: 'Failed to delete consumer',
      error: error.message
    });
  }
};
