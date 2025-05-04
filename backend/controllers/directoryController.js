const db = require('../config/db');

exports.getVendors = async (req, res) => {
  try {
    const [vendors] = await db.query(`
      SELECT 
        v.*,
        r.salesVolume_perMonth,
        w.average_Order_Value,
        CASE 
          WHEN r.retailer_ID IS NOT NULL THEN 'Retailer'
          WHEN w.wholeseller_ID IS NOT NULL THEN 'Wholeseller'
          ELSE v.business_Type
        END AS vendor_type
      FROM Vendor v
      LEFT JOIN Retailer r ON v.vendor_ID = r.retailer_ID
      LEFT JOIN Wholeseller w ON v.vendor_ID = w.wholeseller_ID
    `);
    res.json(vendors);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      message: 'Failed to fetch vendors',
      error: err.message
    });
  }
};

exports.createVendor = async (req, res) => {
    const vendorData = req.body;
  
    const requiredFields = ['vendor_Name', 'business_Type', 'contact_number', 'address', 'stock_Quantity'];
    const missingFields = requiredFields.filter(field => !vendorData[field]);
  
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
  
    if (isNaN(vendorData.stock_Quantity) || vendorData.stock_Quantity < 0) {
      return res.status(400).json({
        message: 'Stock quantity must be a positive number'
      });
    }
  
    try {
      const [result] = await db.query('INSERT INTO Vendor SET ?', {
        vendor_Name: vendorData.vendor_Name,
        business_Type: vendorData.business_Type,
        contact_number: vendorData.contact_number,
        address: vendorData.address,
        stock_Quantity: vendorData.stock_Quantity
      });
  
      res.status(201).json({
        vendor_ID: result.insertId,
        message: 'Vendor created successfully'
      });
    } catch (err) {
      console.error('Database error:', err);
  
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          message: 'Vendor with similar details already exists'
        });
      }
  
      res.status(500).json({
        message: 'Failed to create vendor',
        error: err.message
      });
    }
  };
  
  exports.deleteVendor = async (req, res) => {
    const { vendor_ID } = req.body;
  
    if (!vendor_ID) {
      return res.status(400).json({
        message: 'Vendor ID is required'
      });
    }
  