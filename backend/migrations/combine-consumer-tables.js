const db = require('../config/db');

async function combineTables() {
  try {
    console.log('=== STARTING MIGRATION: COMBINING CONSUMER AND CONSUMPTION PATTERN TABLES ===');
    
    // 1. Create backup of existing tables
    console.log('\n1. Creating backups of existing tables...');
    
    // Drop existing backup tables if they exist
    await db.query(`DROP TABLE IF EXISTS consumer_backup`);
    await db.query(`DROP TABLE IF EXISTS consumptionpattern_backup`);
    
    // Backup consumer table
    await db.query(`CREATE TABLE consumer_backup LIKE consumer`);
    await db.query(`INSERT INTO consumer_backup SELECT * FROM consumer`);
    console.log('   ✅ Consumer table backed up');
    
    // Backup consumption pattern table (even if empty)
    await db.query(`CREATE TABLE consumptionpattern_backup LIKE consumptionpattern`);
    await db.query(`INSERT INTO consumptionpattern_backup SELECT * FROM consumptionpattern`);
    console.log('   ✅ ConsumptionPattern table backed up');
    
    // 2. Alter consumer table to add consumption pattern fields
    console.log('\n2. Altering consumer table to add consumption pattern fields...');
    
    try {
      // Add columns one by one to avoid syntax issues
      await db.query(`ALTER TABLE consumer ADD COLUMN region VARCHAR(100) DEFAULT 'National' NOT NULL`);
      await db.query(`ALTER TABLE consumer ADD COLUMN season VARCHAR(50) DEFAULT 'All Year' NOT NULL`);
      await db.query(`ALTER TABLE consumer ADD COLUMN consumption_amount DECIMAL(10,2) DEFAULT 0.00 NOT NULL`);
      await db.query(`ALTER TABLE consumer ADD COLUMN record_date DATE NOT NULL`);
      
      // Update the record_date to current date
      await db.query(`UPDATE consumer SET record_date = CURDATE()`);
      
      console.log('   ✅ Added consumption pattern fields to consumer table');
    } catch (error) {
      console.error('   ❌ Error altering consumer table:', error.message);
      throw error;
    }
    
    // 3. Create a view that combines both tables for backward compatibility
    console.log('\n3. Creating a combined view for backward compatibility...');
    
    try {
      // Drop view if it exists
      await db.query(`DROP VIEW IF EXISTS consumption_patterns_view`);
      
      // Create new view
      await db.query(`
        CREATE VIEW consumption_patterns_view AS
        SELECT 
          consumer_ID as pattern_ID,
          preferred_Meat_Type as meat_Type,
          region,
          season,
          consumption_amount,
          record_date
        FROM consumer
      `);
      console.log('   ✅ Created consumption_patterns_view');
    } catch (error) {
      console.error('   ❌ Error creating view:', error.message);
      throw error;
    }
    
    // 4. Update the schema.sql file to reflect these changes
    console.log('\n4. Note: Please update your schema.sql file to reflect these changes');
    console.log('   The ConsumptionPattern table should be removed and the Consumer table updated');
    
    console.log('\n=== MIGRATION COMPLETED SUCCESSFULLY ===');
    console.log('\nYou can now access consumption pattern data directly from the consumer table.');
    console.log('For backward compatibility, you can use the consumption_patterns_view.');
    
  } catch (error) {
    console.error('\n❌ MIGRATION FAILED:', error);
    console.log('\nRolling back changes...');
    
    try {
      // Check if we need to rollback consumer table changes
      const [columns] = await db.query('SHOW COLUMNS FROM consumer LIKE "region"');
      if (columns.length > 0) {
        // The migration started, need to rollback
        console.log('   Rolling back consumer table changes...');
        await db.query(`
          ALTER TABLE consumer
          DROP COLUMN region,
          DROP COLUMN season,
          DROP COLUMN consumption_amount,
          DROP COLUMN record_date
        `);
        console.log('   ✅ Consumer table restored to original state');
      }
    } catch (rollbackError) {
      console.error('   ❌ Error during rollback:', rollbackError.message);
      console.error('   ⚠️ MANUAL INTERVENTION REQUIRED! Database may be in an inconsistent state.');
    }
  } finally {
    process.exit();
  }
}

// Execute the migration
combineTables();
