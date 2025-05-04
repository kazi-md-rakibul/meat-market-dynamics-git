const db = require('../config/db');

exports.getPriceTrends = async (req, res) => {
  try {
    const [trends] = await db.query(`
      SELECT 
        h.*,
        p.product_name,
        p.meat_Type,
        p.cut_Type
      FROM HistoricalPrice h
      JOIN MeatProduct p ON h.product_ID = p.product_ID
      ORDER BY h.price_date DESC
    `);
    res.json(trends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRegionalPrices = async (req, res) => {
  try {
    const [prices] = await db.query(`
      SELECT 
        h.region,
        p.meat_Type,
        p.cut_Type,
        AVG(h.price) AS avg_price,
        MIN(h.price) AS min_price,
        MAX(h.price) AS max_price
      FROM HistoricalPrice h
      JOIN MeatProduct p ON h.product_ID = p.product_ID
      GROUP BY h.region, p.meat_Type, p.cut_Type
    `);
    res.json(prices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.recordPrice = async (req, res) => {
  console.log("Req",req.body);
  const priceData = req.body;
  try {
    const [result] = await db.query('INSERT INTO HistoricalPrice SET ?', priceData);
    res.status(201).json({ record_ID: result.insertId });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};