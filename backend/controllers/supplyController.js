const db = require('../config/db');

exports.getInventory = async (req, res) => {
  try {
    const [inventory] = await db.query(`
      SELECT 
        w.*,
        SUM(p.stock_Availability) AS current_stock,
        (SUM(p.stock_Availability)/w.capacity)*100 AS utilization_percent
      FROM Warehouse w
      LEFT JOIN MeatBatch b ON w.warehouse_ID = b.warehouse_ID
      LEFT JOIN MeatProduct p ON b.batch_ID = p.batch_ID
      GROUP BY w.warehouse_ID
    `);
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLogistics = async (req, res) => {
  try {
    const [logistics] = await db.query(`
      SELECT 
        d.*,
        o.order_date,
        v.vendor_Name,
        w.address AS destination
      FROM Delivery d
      JOIN \`Order\` o ON d.order_ID = o.order_ID
      JOIN OrderProduct op ON o.order_ID = op.order_ID
      JOIN MeatProduct mp ON op.product_ID = mp.product_ID
      JOIN MeatBatch mb ON mp.batch_ID = mb.batch_ID
      LEFT JOIN Warehouse w ON mb.warehouse_ID = w.warehouse_ID
      JOIN Vendor v ON o.consumer_ID = v.vendor_ID
    `);
    res.json(logistics);
  } catch (err) {
    console.error("Error in getLogistics:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.createWarehouse = async (req, res) => {
  const warehouseData = req.body;
  try {
    const [result] = await db.query('INSERT INTO Warehouse SET ?', warehouseData);
    res.status(201).json({ warehouse_ID: result.insertId });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllWarehouses = async (req, res) => {
  try {
    console.log("Call");
    const [rows] = await db.query('SELECT * FROM Warehouse');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateWarehouse = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    await db.query('UPDATE Warehouse SET ? WHERE warehouse_ID = ?', [updatedData, id]);
    res.status(200).json({ message: 'Warehouse updated successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteWarehouse = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Warehouse WHERE warehouse_ID = ?', [id]);
    res.status(200).json({ message: 'Warehouse deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};