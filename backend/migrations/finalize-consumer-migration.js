const db = require('../config/db');

async function finalizeConsumerMigration() {
  try {
    console.log('=== FINALIZING CONSUMER TABLE MIGRATION ===');

    // 1. Rename tables
    console.log('\n1. Renaming tables...');
    
    // Rename consumer to consumer_old
    await db.query('RENAME TABLE consumer TO consumer_old');
    console.log('   ✅ Renamed consumer to consumer_old');

  }
  catch (error) {
    console.error('\n❌ FINALIZATION FAILED:', error);
    console.log('\nPlease check the error and try again.');
  } finally {
    process.exit();
  }

}