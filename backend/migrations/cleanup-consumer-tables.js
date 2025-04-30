const db = require('../config/db');

async function cleanupConsumerTables() {
  try {
    console.log('=== CLEANING UP CONSUMER TABLES ===');
    
    // 1. Add consumer_name field to the consumer table
    console.log('\n1. Adding consumer_name field to consumer table...');
    
    try {
      await db.query('ALTER TABLE consumer ADD COLUMN consumer_name VARCHAR(100) DEFAULT "Consumer" NOT NULL AFTER consumer_ID');
      console.log('   ✅ Added consumer_name field to consumer table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('   ℹ️ consumer_name field already exists');
      } else {
        console.error('   ❌ Error adding consumer_name field:', error.message);
        throw error;
      }
    }
    
    // 2. Drop unnecessary consumer-related tables and views
    console.log('\n2. Dropping unnecessary consumer-related tables and views...');
    
    // First drop views
    try {
      await db.query('DROP VIEW IF EXISTS consumer_view');
      console.log('   ✅ Dropped view: consumer_view');
    } catch (error) {
      console.error('   ❌ Error dropping consumer_view:', error.message);
    }
    
    try {
      await db.query('DROP VIEW IF EXISTS consumption_patterns_view');
      console.log('   ✅ Dropped view: consumption_patterns_view');
    } catch (error) {
      console.error('   ❌ Error dropping consumption_patterns_view:', error.message);
    }
    
    // Then drop tables
    const tablesToDrop = [
      'consumer_backup',
      'consumer_old',
      'consumptionpattern_backup'
    ];
    
    for (const table of tablesToDrop) {
      try {
        await db.query(`DROP TABLE IF EXISTS ${table}`);
        console.log(`   ✅ Dropped table: ${table}`);
      } catch (error) {
        console.error(`   ❌ Error dropping ${table}:`, error.message);
      }
    }
    
    // 3. Update existing consumers with default names
    console.log('\n3. Updating existing consumers with default names...');
    
    try {
      await db.query(`
        UPDATE consumer 
        SET consumer_name = CONCAT('Consumer ', consumer_ID) 
        WHERE consumer_name = 'Consumer' OR consumer_name IS NULL
      `);
      console.log('   ✅ Updated existing consumers with default names');
    } catch (error) {
      console.error('   ❌ Error updating consumer names:', error.message);
    }
    
    // 4. Update schema.sql file to reflect changes
    console.log('\n4. Note: Please update your schema.sql file to reflect these changes');
    console.log('   The consumer table should now include the consumer_name field');
    
    // 5. Check final consumer table structure
    console.log('\n5. Final consumer table structure:');
    const [columns] = await db.query('DESCRIBE `consumer`');
    columns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key}`);
    });
    
    console.log('\n=== CLEANUP COMPLETED SUCCESSFULLY ===');
    
  } catch (error) {
    console.error('\n❌ CLEANUP FAILED:', error);
  } finally {
    process.exit();
  }
}

cleanupConsumerTables();
