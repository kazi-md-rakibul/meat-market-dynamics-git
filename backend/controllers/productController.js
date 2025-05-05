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

exports.updateProduct = async (req, res) => {
  const {productData,productId} = req.body;
  
  try {
    // First check if product exists
    const [product] = await db.query('SELECT * FROM MeatProduct WHERE product_ID = ?', [productId]);
    if (product.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the product
    const [result] = await db.query('UPDATE MeatProduct SET ? WHERE product_ID = ?', [productData, productId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found or no changes made' });
    }
    
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { product_ID } = req.body;

  if (!product_ID) {
    return res.status(400).json({ message: 'Product ID is required in request body' });
  }

  try {
    await db.query('START TRANSACTION');

    const [product] = await db.query('SELECT * FROM MeatProduct WHERE product_ID = ?', [product_ID]);
    if (product.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ message: 'Product not found' });
    }

    const [orderProducts] = await db.query('SELECT * FROM OrderProduct WHERE product_ID = ?', [product_ID]);
    if (orderProducts.length > 0) {
      await db.query('ROLLBACK');
      return res.status(409).json({ 
        message: 'Cannot delete product - it appears in existing orders',
        orderCount: orderProducts.length
      });
    }

    await db.query('DELETE FROM HistoricalPrice WHERE product_ID = ?', [product_ID]);

    const [result] = await db.query('DELETE FROM MeatProduct WHERE product_ID = ?', [product_ID]);

    if (result.affectedRows === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ message: 'Product not found' });
    }

    await db.query('COMMIT');

    res.json({ 
      success: true,
      message: 'Product and its price history deleted successfully',
      product_ID: product_ID
    });

  } catch (err) {
    await db.query('ROLLBACK');
    
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete product - it has references in other tables',
        suggestion: 'Check OrderProduct, HistoricalPrice, and other related tables'
      });
    }

    res.status(500).json({ 
      success: false,
      message: err.message,
      errorCode: err.code 
    });
  }
};