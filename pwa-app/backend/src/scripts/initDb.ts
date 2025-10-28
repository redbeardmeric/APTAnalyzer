/**
 * Database Initialization Script
 * Fetches MITRE ATT&CK data from TAXII server and populates the database
 */
import taxiiClient from '../services/taxiiClient';
import database from '../services/database';

async function initializeDatabase() {
  console.log('='.repeat(60));
  console.log('RAPTOR Database Initialization');
  console.log('='.repeat(60));

  try {
    // Check if database is already initialized
    if (database.isInitialized()) {
      const version = database.getMetadata('attack_version');
      const lastUpdated = database.getMetadata('last_updated');
      console.log(`\n⚠️  Database already initialized:`);
      console.log(`   ATT&CK Version: ${version}`);
      console.log(`   Last Updated: ${lastUpdated}`);
      console.log(`\nTo force update, use: npm run db:update`);
      process.exit(0);
    }

    // Fetch data from TAXII server
    console.log('\n📡 Fetching Enterprise ATT&CK data from TAXII server...');
    const bundle = await taxiiClient.fetchEnterpriseAttack();
    const version = taxiiClient.getAttackVersion(bundle);

    console.log(`\n✓ Fetched ${bundle.objects.length} objects`);
    console.log(`  ATT&CK Version: ${version}`);

    // Store in database
    console.log('\n💾 Storing data in database...');
    database.storeBundle(bundle, version);

    // Show statistics
    const stats = database.getStats();
    console.log('\n✓ Database initialized successfully!\n');
    console.log('Statistics:');
    console.log(`  Tactics:       ${stats.tactics.count}`);
    console.log(`  Techniques:    ${stats.techniques.count}`);
    console.log(`  Groups:        ${stats.groups.count}`);
    console.log(`  Software:      ${stats.software.count}`);
    console.log(`  Mitigations:   ${stats.mitigations.count}`);
    console.log(`  Relationships: ${stats.relationships.count}`);
    console.log('\n' + '='.repeat(60));

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error initializing database:');
    console.error(error);
    process.exit(1);
  }
}

initializeDatabase();
