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

  try {
    const [existing] = await db.query('SELECT * FROM Vendor WHERE vendor_ID = ?', [vendor_ID]);
    if (existing.length === 0) {
      return res.status(404).json({
        message: 'Vendor not found'
      });
    }

    const [result] = await db.query('DELETE FROM Vendor WHERE vendor_ID = ?', [vendor_ID]);

    res.json({
      message: 'Vendor deleted successfully',
      affectedRows: result.affectedRows
    });
  } catch (err) {
    console.error('Database error:', err);

    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({
        message: 'Cannot delete - vendor has associated records'
      });
    }

    res.status(500).json({
      message: 'Failed to delete vendor',
      error: err.message
    });
  }
};


exports.updateVendor = async (req, res) => {
  const { vendor_ID, ...updateData } = req.body;

  if (!vendor_ID) {
    return res.status(400).json({
      message: 'Vendor ID is required'
    });
  }

  if (updateData.stock_Quantity !== undefined &&
    (isNaN(updateData.stock_Quantity) || updateData.stock_Quantity < 0)) {
    return res.status(400).json({
      message: 'Stock quantity must be a positive number'
    });
  }

  try {
    const [existing] = await db.query('SELECT * FROM Vendor WHERE vendor_ID = ?', [vendor_ID]);
    if (existing.length === 0) {
      return res.status(404).json({
        message: 'Vendor not found'
      });
    }

    const [result] = await db.query('UPDATE Vendor SET ? WHERE vendor_ID = ?', [updateData, vendor_ID]);

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: 'No changes made'
      });
    }

    res.json({
      message: 'Vendor updated successfully',
      affectedRows: result.affectedRows
    });
  } catch (err) {
    console.error('Database error:', err);

    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        message: 'Vendor with similar details already exists'
      });
    }

    res.status(500).json({
      message: 'Failed to update vendor',
      error: err.message
    });
  }
};


exports.getFarmers = async (req, res) => {
  try {
    const [farmers] = await db.query(`
      SELECT 
        f.farm_ID,
        f.farm_Name,
        f.livestock_Type,
        f.available_Stock,
        f.address,
        f.contact_info,
        COALESCE(SUM(c.quantity), 0) AS total_livestock,
        COUNT(c.cattle_ID) AS cattle_types_count
      FROM FarmFarmer f
      LEFT JOIN Cattle c ON f.farm_ID = c.farm_ID
      GROUP BY f.farm_ID
      ORDER BY f.farm_Name
    `);

    if (farmers.length === 0) {
      return res.status(404).json({ message: "No farmers found" });
    }

    res.json(farmers);
  } catch (err) {
    console.error("Error fetching farmers:", err);
    res.status(500).json({
      message: "Failed to retrieve farmer data",
      error: err.message
    });
  }
};

exports.getFarmers = async (req, res) => {
  try {
    const [farmers] = await db.query(`
      SELECT 
        f.farm_ID,
        f.farm_Name,
        f.livestock_Type,
        f.available_Stock,
        f.address,
        f.contact_info,
        COALESCE(SUM(c.quantity), 0) AS total_livestock,
        COUNT(c.cattle_ID) AS cattle_types_count
      FROM FarmFarmer f
      LEFT JOIN Cattle c ON f.farm_ID = c.farm_ID
      GROUP BY f.farm_ID
      ORDER BY f.farm_Name
    `);

    if (farmers.length === 0) {
      return res.status(404).json({ message: "No farmers found" });
    }

    res.json(farmers);
  } catch (err) {
    console.error("Error fetching farmers:", err);
    res.status(500).json({
      message: "Failed to retrieve farmer data",
      error: err.message
    });
  }
};

exports.getFarmerById = async (req, res) => {
  try {
    const { id } = req.body;
    const [farmer] = await db.query(`
      SELECT 
        f.*,
        COALESCE(SUM(c.quantity), 0) AS total_livestock,
        COUNT(c.cattle_ID) AS cattle_types_count
      FROM FarmFarmer f
      LEFT JOIN Cattle c ON f.farm_ID = c.farm_ID
      WHERE f.farm_ID = ?
      GROUP BY f.farm_ID
    `, [id]);

    if (farmer.length === 0) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    const [cattle] = await db.query('SELECT * FROM Cattle WHERE farm_ID = ?', [id]);

    res.json({
      ...farmer[0],
      cattle
    });
  } catch (err) {
    console.error("Error fetching farmer:", err);
    res.status(500).json({
      message: "Failed to retrieve farmer data",
      error: err.message
    });
  }
};

exports.createFarmer = async (req, res) => {
  const farmerData = {
    farm_Name: req.body.farm_Name,
    livestock_Type: req.body.livestock_Type,
    available_Stock: Number(req.body.available_Stock),
    address: req.body.address,
    contact_info: req.body.contact_info,
    number_of_Livestock: Number(req.body.number_of_Livestock) || 0 
  };

  const requiredFields = ['farm_Name', 'livestock_Type', 'available_Stock', 'address', 'contact_info'];
  const missingFields = requiredFields.filter(field => !farmerData[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  if (isNaN(farmerData.available_Stock) || farmerData.available_Stock < 0) {
    return res.status(400).json({
      message: 'Available stock must be a positive number'
    });
  }

  try {
    const [result] = await db.query('INSERT INTO FarmFarmer SET ?', {
      farm_Name: farmerData.farm_Name,
      livestock_Type: farmerData.livestock_Type,
      available_Stock: farmerData.available_Stock,
      address: farmerData.address,
      contact_info: farmerData.contact_info
    });

    res.status(201).json({
      farm_ID: result.insertId,
      message: 'Farmer created successfully'
    });
  } catch (err) {
    console.error('Database error:', err);

    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        message: 'Farmer with similar details already exists'
      });
    }

    res.status(500).json({
      message: 'Failed to create farmer',
      error: err.message
    });
  }
};

exports.updateFarmer = async (req, res) => {
  const { farmerData, id } = req.body;

  const requiredFields = ['farm_Name', 'livestock_Type', 'available_Stock', 'address', 'contact_info'];
  const missingFields = requiredFields.filter(field => !farmerData[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  if (isNaN(farmerData.available_Stock) || farmerData.available_Stock < 0) {
    return res.status(400).json({
      message: 'Available stock must be a positive number'
    });
  }

  try {
    const [result] = await db.query(
      'UPDATE FarmFarmer SET ? WHERE farm_ID = ?',
      [farmerData, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    res.json({ message: 'Farmer updated successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      message: 'Failed to update farmer',
      error: err.message
    });
  }
};

exports.deleteFarmer = async (req, res) => {
  try {
    const { id } = req.body;
    await db.query('DELETE FROM Cattle WHERE farm_ID = ?', [id]);

    const [result] = await db.query('DELETE FROM FarmFarmer WHERE farm_ID = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    res.json({ message: 'Farmer and associated cattle deleted successfully' });
  } catch (err) {
    console.error('Database error:', err);

    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({
        message: 'Cannot delete farmer as it is referenced in other tables'
      });
    }

    res.status(500).json({
      message: 'Failed to delete farmer',
      error: err.message
    });
  }
};