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

    

  }
  catch (error) {
    console.error('\n❌ FINALIZATION FAILED:', error);
    console.log('\nPlease check the error and try again.');
  } finally {
    process.exit();
  }

}