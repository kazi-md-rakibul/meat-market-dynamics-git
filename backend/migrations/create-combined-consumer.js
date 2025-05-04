const db = require('../config/db');

async function createCombinedConsumerTable() {
  try {
    console.log('=== CREATING COMBINED CONSUMER TABLE ===');

// 1. Create a new combined table
console.log('\n1. Creating new combined consumer table...');
    
await db.query(`
  CREATE TABLE IF NOT EXISTS consumer_combined (
    consumer_ID INT AUTO_INCREMENT PRIMARY KEY,
    preferred_Meat_Type VARCHAR(50) NOT NULL,
    preferred_Cut VARCHAR(50) NOT NULL,
    average_Order_Size DECIMAL(10,2) NOT NULL,
    average_Spending DECIMAL(10,2) NOT NULL,
    region VARCHAR(100) DEFAULT 'National' NOT NULL,
    season VARCHAR(50) DEFAULT 'All Year' NOT NULL,
    consumption_amount DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
    record_date DATE NOT NULL
  )
`);

console.log('   ✅ Created new combined table structure');
    
    // 2. Copy data from existing consumer table
    console.log('\n2. Copying data from existing consumer table...');
    
    await db.query(`
      INSERT INTO consumer_combined (
        consumer_ID, 
        preferred_Meat_Type, 
        preferred_Cut, 
        average_Order_Size, 
        average_Spending,
        region,
        season,
        consumption_amount,
        record_date
      )
      SELECT 
        consumer_ID, 
        preferred_Meat_Type, 
        preferred_Cut, 
        average_Order_Size, 
        average_Spending,
        'National' as region,
        'All Year' as season,
        average_Order_Size as consumption_amount,
        CURDATE() as record_date
      FROM consumer
    `);
      
  } catch (error) {
    console.error('\n❌ MIGRATION FAILED:', error);
    console.log('\nNo changes have been made to your existing tables.');
  } finally {
    process.exit();
  }
}