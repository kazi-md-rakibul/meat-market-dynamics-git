const db = require('../config/db');

exports.getProducts = async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT 
        p.*, 
        b.production_Date, b.expiration_Date, b.total_Weight, b.batch_Status,
        pu.facility_Name AS processing_facility,
        w.address AS warehouse_location
      FROM MeatProduct p
      JOIN MeatBatch b ON p.batch_ID = b.batch_ID
      JOIN ProcessingUnit pu ON b.unit_ID = pu.unit_ID
      LEFT JOIN Warehouse w ON b.warehouse_ID = w.warehouse_ID
    `);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const [product] = await db.query(`
      SELECT * FROM MeatProduct WHERE product_ID = ?
    `, [req.params.id]);
    res.json(product[0] || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  const productData = req.body;
  try {
    const [result] = await db.query('INSERT INTO MeatProduct SET ?', productData);
    console.log("result",result);
    res.status(201).json({ product_ID: result.insertId });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
