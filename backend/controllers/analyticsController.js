const db = require('../config/db');
exports.getSupplyDemandGap = async (req, res) => {
  try {
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
    res.json(gap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getDemandForecast = async (req, res) => {
  try {
    const { meatType, startDate, endDate, forecastFactor = 1.1 } = req.query;

    const factor = parseFloat(forecastFactor);
    if (isNaN(factor) || factor <= 0) {
      return res.status(400).json({ message: "Invalid forecast factor" });
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

    const [forecast] = await db.query(query, params);

    if (forecast.length === 0) {
      return res.status(404).json({
        message: "No data available for the selected criteria",
        suggestion: "Try broadening your date range or removing filters"
      });
    }

    res.json({
      forecast,
      parameters: {
        meatType,
        startDate,
        endDate,
        forecastFactor: factor
      }
    });
  } catch (err) {
    console.error("Forecast error:", err);
    res.status(500).json({
      message: "Failed to generate demand forecast",
      error: err.message
    });
  }
};