const db = require('../config/db');

/**
 * Calculates the supply-demand gap for each meat type
 * @returns {Object} JSON response containing supply-demand gap analysis
 */
exports.getSupplyDemandGap = async (req, res) => {
  try {
    console.log('Calculating supply-demand gap...');
    
    const [gap] = await db.query(`
      SELECT 
        p.meat_Type,
        SUM(p.stock_Availability) AS current_supply,
        (SELECT IFNULL(SUM(op.quantity), 0) 
         FROM OrderProduct op 
         JOIN MeatProduct mp ON op.product_ID = mp.product_ID
         WHERE mp.meat_Type = p.meat_Type) AS current_demand,
        (SUM(p.stock_Availability) - 
         (SELECT IFNULL(SUM(op.quantity), 0) 
          FROM OrderProduct op 
          JOIN MeatProduct mp ON op.product_ID = mp.product_ID
          WHERE mp.meat_Type = p.meat_Type)
        ) AS gap
      FROM MeatProduct p
      GROUP BY p.meat_Type
    `);

    if (!gap || gap.length === 0) {
      console.log('No supply-demand data found');
      return res.status(404).json({ 
        message: "No supply-demand data available",
        suggestion: "Ensure there are products and orders in the system"
      });
    }

    console.log(`Successfully calculated gap for ${gap.length} meat types`);
    res.json(gap);
  } catch (err) {
    console.error('Error in getSupplyDemandGap:', err);
    res.status(500).json({ 
      message: "Failed to calculate supply-demand gap",
      error: err.message,
      suggestion: "Check database connection and table structure"
    });
  }
};

/**
 * Generates demand forecast based on historical order data
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.meatType] - Filter by meat type
 * @param {string} [req.query.startDate] - Start date for analysis (YYYY-MM-DD)
 * @param {string} [req.query.endDate] - End date for analysis (YYYY-MM-DD)
 * @param {number} [req.query.forecastFactor=1.1] - Growth factor for forecast
 * @returns {Object} JSON response containing forecast data and parameters
 */
exports.getDemandForecast = async (req, res) => {
  try {
    const { meatType, startDate, endDate, forecastFactor = 1.1 } = req.query;
    console.log('Generating demand forecast with params:', { meatType, startDate, endDate, forecastFactor });

    // Validate forecast factor
    const factor = parseFloat(forecastFactor);
    if (isNaN(factor) || factor <= 0) {
      console.log('Invalid forecast factor:', forecastFactor);
      return res.status(400).json({ 
        message: "Invalid forecast factor",
        suggestion: "Provide a positive number for forecast factor"
      });
    }

    // Validate dates if provided
    if (startDate && !isValidDate(startDate)) {
      return res.status(400).json({ 
        message: "Invalid start date format",
        suggestion: "Use YYYY-MM-DD format"
      });
    }
    if (endDate && !isValidDate(endDate)) {
      return res.status(400).json({ 
        message: "Invalid end date format",
        suggestion: "Use YYYY-MM-DD format"
      });
    }

    let query = `
      SELECT 
        p.meat_Type,
        DATE_FORMAT(o.order_date, '%Y-%m') AS period,
        SUM(op.quantity) AS total_demand,
        AVG(op.quantity) AS avg_demand,
        AVG(op.quantity) * ? AS forecast_next_period,
        COUNT(*) AS data_points,
        MIN(o.order_date) AS first_order,
        MAX(o.order_date) AS last_order
      FROM OrderProduct op
      JOIN \`Order\` o ON op.order_ID = o.order_ID
      JOIN MeatProduct p ON op.product_ID = p.product_ID
    `;

    const whereClauses = [];
    const params = [factor];

    if (meatType) {
      whereClauses.push('p.meat_Type = ?');
      params.push(meatType);
    }

    if (startDate) {
      whereClauses.push('o.order_date >= ?');
      params.push(startDate);
    }

    if (endDate) {
      whereClauses.push('o.order_date <= ?');
      params.push(endDate);
    }

    if (whereClauses.length > 0) {
      query += ' WHERE ' + whereClauses.join(' AND ');
    }

    query += `
      GROUP BY p.meat_Type, period
      HAVING COUNT(*) > 1
      ORDER BY p.meat_Type, period
    `;

    console.log('Executing forecast query with params:', params);
    const [forecast] = await db.query(query, params);

    if (forecast.length === 0) {
      console.log('No forecast data found for the given criteria');
      return res.status(404).json({
        message: "No data available for the selected criteria",
        suggestion: "Try broadening your date range or removing filters"
      });
    }

    console.log(`Successfully generated forecast for ${forecast.length} periods`);
    res.json({
      forecast,
      parameters: {
        meatType,
        startDate,
        endDate,
        forecastFactor: factor
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        dataPoints: forecast.reduce((sum, row) => sum + row.data_points, 0)
      }
    });
  } catch (err) {
    console.error("Forecast error:", err);
    res.status(500).json({
      message: "Failed to generate demand forecast",
      error: err.message,
      suggestion: "Check database connection and data integrity"
    });
  }
};

/**
 * Validates date string format (YYYY-MM-DD)
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if date is valid
 */
function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}