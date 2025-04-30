const db = require('../config/db');

async function fixForeignKeyReferences() {
  try {
    console.log('=== FIXING FOREIGN KEY REFERENCES ===');
    
    // 1. Check the current foreign key constraints
    console.log('\n1. Checking current foreign key constraints...');
    
    const [constraints] = await db.query(`
      SELECT 
        TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
      FROM 
        INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE 
        REFERENCED_TABLE_NAME = 'consumer_old'
        AND TABLE_SCHEMA = DATABASE()
    `);
    
    if (constraints.length === 0) {
      console.log('   ℹ️ No foreign key constraints referencing consumer_old found');
    } else {
      console.log('   Found foreign key constraints:');
      constraints.forEach(constraint => {
        console.log(`   - ${constraint.TABLE_NAME}.${constraint.COLUMN_NAME} -> ${constraint.REFERENCED_TABLE_NAME}.${constraint.REFERENCED_COLUMN_NAME} (${constraint.CONSTRAINT_NAME})`);
      });
    }
    
    // 2. Check for order table constraints
    console.log('\n2. Checking order table constraints...');
    
    const [orderConstraints] = await db.query(`
      SELECT 
        TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
      FROM 
        INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE 
        TABLE_NAME = 'order'
        AND CONSTRAINT_NAME LIKE 'order_ibfk_%'
        AND TABLE_SCHEMA = DATABASE()
    `);
    
    if (orderConstraints.length === 0) {
      console.log('   ℹ️ No foreign key constraints found in order table');
    } else {
      console.log('   Found order table constraints:');
      orderConstraints.forEach(constraint => {
        console.log(`   - ${constraint.TABLE_NAME}.${constraint.COLUMN_NAME} -> ${constraint.REFERENCED_TABLE_NAME}.${constraint.REFERENCED_COLUMN_NAME} (${constraint.CONSTRAINT_NAME})`);
      });
    }
    
    // 3. Drop the foreign key constraint
    console.log('\n3. Dropping foreign key constraint...');
    
    try {
      await db.query('ALTER TABLE `order` DROP FOREIGN KEY order_ibfk_1');
      console.log('   ✅ Dropped foreign key constraint order_ibfk_1');
    } catch (error) {
      console.error('   ❌ Error dropping constraint:', error.message);
    }
    
    // 4. Add new foreign key constraint
    console.log('\n4. Adding new foreign key constraint...');
    
    try {
      await db.query(`
        ALTER TABLE \`order\` 
        ADD CONSTRAINT order_consumer_fk 
        FOREIGN KEY (consumer_ID) 
        REFERENCES consumer(consumer_ID) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
      `);
      console.log('   ✅ Added new foreign key constraint order_consumer_fk');
    } catch (error) {
      console.error('   ❌ Error adding new constraint:', error.message);
    }
    
    // 5. Now try to drop the consumer_old table
    console.log('\n5. Dropping consumer_old table...');
    
    try {
      await db.query('DROP TABLE IF EXISTS consumer_old');
      console.log('   ✅ Dropped consumer_old table');
    } catch (error) {
      console.error('   ❌ Error dropping consumer_old table:', error.message);
    }
    
    console.log('\n=== FOREIGN KEY REFERENCES FIXED SUCCESSFULLY ===');
    
  } catch (error) {
    console.error('\n❌ OPERATION FAILED:', error);
  } finally {
    process.exit();
  }
}

fixForeignKeyReferences();
