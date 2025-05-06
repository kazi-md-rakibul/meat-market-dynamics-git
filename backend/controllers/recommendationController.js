const db = require('../config/db');

exports.getFarmerRecommendations = async (req, res) => {
  try {
    const farmId = req.params.farmId;
    const [recommendations] = await db.query(`
      SELECT 
        c.animal_Type,
        c.breed,
        c.quantity AS current_inventory,
        (SELECT SUM(op.quantity) 
         FROM OrderProduct op 
         JOIN MeatProduct mp ON op.product_ID = mp.product_ID
         WHERE mp.meat_Type = c.animal_Type) AS market_demand,
        CASE 
          WHEN (SELECT SUM(op.quantity) FROM OrderProduct op JOIN MeatProduct mp ON op.product_ID = mp.product_ID WHERE mp.meat_Type = c.animal_Type) > 
               (SELECT SUM(mp.stock_Availability) FROM MeatProduct mp JOIN MeatBatch mb ON mp.batch_ID = mb.batch_ID JOIN Cattle ct ON mb.unit_ID = ct.unit_ID WHERE ct.animal_Type = c.animal_Type)
          THEN 'Increase production'
          ELSE 'Maintain current levels'
        END AS recommendation
      FROM Cattle c
      WHERE c.farm_ID = ?
      GROUP BY c.animal_Type, c.breed
    `, [farmId]);
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};