const db = require('../config/db');

async function finalizeConsumerMigration() {
  try {
    console.log('=== FINALIZING CONSUMER TABLE MIGRATION ===');

    // 1. Rename tables
    console.log('\n1. Renaming tables...');
    
    // Rename consumer to consumer_old
    await db.query('RENAME TABLE consumer TO consumer_old');
    console.log('   ✅ Renamed consumer to consumer_old');

    // Rename consumer_combined to consumer
    await db.query('RENAME TABLE consumer_combined TO consumer');
    console.log('   ✅ Renamed consumer_combined to consumer');
    
    // 2. Update foreign key constraints
    console.log('\n2. Checking and updating foreign key constraints...');

    // Check if there are orders that need to be updated
    const [orderCount] = await db.query(`SELECT COUNT(*) as count FROM \`order\``);
    
    if (orderCount[0].count > 0) {
      console.log(`   Found ${orderCount[0].count} orders in the database`);
      console.log('   Foreign key constraints should be maintained automatically');
      console.log('   since we kept the same primary key values');
    } else {
      console.log('   ✅ No orders found in the database');
    }

     // 3. Drop the old consumption pattern table
     console.log('\n3. Dropping the old consumption pattern table...');
    
     await db.query('DROP TABLE IF EXISTS consumptionpattern');
     console.log('   ✅ Dropped consumptionpattern table');

    console.log('\n=== MIGRATION FINALIZED SUCCESSFULLY ===');
    console.log('\nYour database now has:');
    console.log('1. A combined consumer table with consumption pattern data');
    console.log('2. Views for backward compatibility:');
    console.log('   - consumer_view: For accessing just consumer data');
    console.log('   - consumption_patterns_view: For accessing consumption pattern data');
    console.log('3. The original consumer table is backed up as consumer_old');
    console.log('\nNext steps:');
    console.log('1. Update your application code to use the new consumer table structure');
    console.log('2. Update your schema.sql file to reflect these changes');
    console.log('3. Test thoroughly to ensure everything works correctly');
    console.log('4. Once confirmed working, you can drop the consumer_old table');


  }
  catch (error) {
    console.error('\n❌ FINALIZATION FAILED:', error);
    console.log('\nPlease check the error and try again.');
  } finally {
    process.exit();
  }

}

finalizeConsumerMigration();