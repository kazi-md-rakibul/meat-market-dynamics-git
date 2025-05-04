const db = require('../config/db');

exports.getAllConsumers = async (req, res) => {
  try {
    console.log('Fetching all consumers');
    const [consumers] = await db.query('SELECT * FROM `consumer`');
    console.log(`Found ${consumers.length} consumers`);
    res.json(consumers);
  } catch (err) {
    console.error('Error in getAllConsumers:', err);
    res.status(500).json({ message: err.message, error: err.stack });
  }
};

exports.getConsumersDirect = async (req, res) => {
  try {
    console.log('Fetching all consumers with direct data');
    const [consumers] = await db.query(`
      SELECT 
        consumer_ID,
        consumer_name,
        preferred_Meat_Type,
        preferred_Cut,
        average_Order_Size,
        average_Spending,
        region,
        season,
        consumption_amount,
        record_date
      FROM Consumer
      ORDER BY consumer_ID DESC
    `);
    console.log(`Found ${consumers.length} consumers`);
    res.json(consumers);
  } catch (err) {
    console.error('Error in getConsumersDirect:', err);
    res.status(500).json({ message: err.message, error: err.stack });
  }
};

exports.getConsumerStats = async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        preferred_Meat_Type,
        preferred_Cut,
        AVG(average_Spending) AS avg_spending,
        AVG(average_Order_Size) AS avg_order_size,
        COUNT(*) AS consumer_count
      FROM Consumer
      GROUP BY preferred_Meat_Type, preferred_Cut
    `);
    res.json(stats);
  } catch (err) {
    console.error('Error in getConsumerStats:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getRegionalConsumption = async (req, res) => {
  try {
    const [regionalData] = await db.query(`
      SELECT 
        region,
        AVG(consumption_amount) AS avg_consumption,
        COUNT(*) AS consumer_count,
        AVG(average_Spending) AS avg_spending
      FROM Consumer
      GROUP BY region
      ORDER BY avg_consumption DESC
    `);
    res.json(regionalData);
  } catch (err) {
    console.error('Error in getRegionalConsumption:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.checkTables = async (req, res) => {
  try {
    const [consumers] = await db.query('SELECT COUNT(*) AS count FROM `consumer`');
    const [orders] = await db.query(`SELECT COUNT(*) AS count FROM \`Order\``);
    const [orderProducts] = await db.query(`SELECT COUNT(*) AS count FROM OrderProduct`);
    const [meatProducts] = await db.query(`SELECT COUNT(*) AS count FROM MeatProduct`);
    
    res.json({
      consumers: consumers[0].count,
      orders: orders[0].count,
      orderProducts: orderProducts[0].count,
      meatProducts: meatProducts[0].count
    });
  } catch (err) {
    console.error('Error in checkTables:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.createConsumer = async (req, res) => {
  console.log('Creating consumer with data:', req.body);
  
  const requiredFields = [
    'preferred_Meat_Type',
    'preferred_Cut',
    'average_Order_Size',
    'average_Spending',
    'record_date',
    'consumer_name',
    'region',
    'season',
    'consumption_amount'
  ];
  
  // Check for required fields
  for (const field of requiredFields) {
    if (req.body[field] === undefined || req.body[field] === null) {
      console.log(`Validation failed: ${field} is required`);
      return res.status(400).json({ 
        message: `${field} is required` 
      });
    }
  }

  try {
    // Check if Consumer table exists and has all required columns
    const [tables] = await db.query("SHOW TABLES LIKE 'consumer'");
    console.log('Tables check result:', tables);
    
    if (tables.length === 0) {
      console.log('Consumer table does not exist, creating it');
      await db.query(`
        CREATE TABLE IF NOT EXISTS \`consumer\` (
          consumer_ID INT AUTO_INCREMENT PRIMARY KEY,
          consumer_name VARCHAR(100) NOT NULL DEFAULT 'Consumer',
          preferred_Meat_Type VARCHAR(50) NOT NULL,
          preferred_Cut VARCHAR(50) NOT NULL,
          average_Order_Size DECIMAL(10,2) NOT NULL,
          average_Spending DECIMAL(10,2) NOT NULL,
          region VARCHAR(100) NOT NULL DEFAULT 'National',
          season VARCHAR(50) NOT NULL DEFAULT 'All Year',
          consumption_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
          record_date DATE NOT NULL
        )
      `);
      console.log('Consumer table created successfully');
    } else {
      // Check if all columns exist and add them if they don't
      try {
        await db.query(`ALTER TABLE \`consumer\` 
          ADD COLUMN IF NOT EXISTS consumer_name VARCHAR(100) NOT NULL DEFAULT 'Consumer',
          ADD COLUMN IF NOT EXISTS region VARCHAR(100) NOT NULL DEFAULT 'National',
          ADD COLUMN IF NOT EXISTS season VARCHAR(50) NOT NULL DEFAULT 'All Year',
          ADD COLUMN IF NOT EXISTS consumption_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
          ADD COLUMN IF NOT EXISTS record_date DATE NOT NULL
        `);
        console.log('Consumer table columns updated if needed');
      } catch (alterErr) {
        console.error('Error updating consumer table schema:', alterErr);
        // Continue execution even if alter fails
      }
    }
    
    // Format data for insertion
    const consumerData = {
      consumer_name: req.body.consumer_name,
      preferred_Meat_Type: req.body.preferred_Meat_Type,
      preferred_Cut: req.body.preferred_Cut,
      average_Order_Size: Number(req.body.average_Order_Size),
      average_Spending: Number(req.body.average_Spending),
      region: req.body.region,
      season: req.body.season,
      consumption_amount: Number(req.body.consumption_amount),
      record_date: req.body.record_date
    };
    
    console.log('Inserting consumer with formatted data:', consumerData);
    const [result] = await db.query('INSERT INTO \`consumer\` SET ?', consumerData);
    console.log('Consumer created successfully with ID:', result.insertId);
    
    res.status(201).json({ consumer_ID: result.insertId });
  } catch (err) {
    console.error('Error in createConsumer:', err);
    res.status(400).json({ 
      message: err.message,
      error: err.stack,
      sqlState: err.sqlState,
      sqlCode: err.code
    });
  }
};

exports.getSeasonalConsumption = async (req, res) => {
  try {
    const [seasonalData] = await db.query(`
      SELECT 
        season,
        AVG(consumption_amount) AS avg_consumption,
        COUNT(*) AS consumer_count,
        AVG(average_Spending) AS avg_spending
      FROM Consumer
      GROUP BY season
      ORDER BY avg_consumption DESC
    `);
    res.json(seasonalData);
  } catch (err) {
    console.error('Error in getSeasonalConsumption:', err);
    res.status(500).json({ message: err.message });
  }
};




