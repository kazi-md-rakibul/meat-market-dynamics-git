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