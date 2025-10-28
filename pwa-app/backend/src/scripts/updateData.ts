/**
 * Database Update Script
 * Updates MITRE ATT&CK data from TAXII server
 */
import taxiiClient from '../services/taxiiClient';
import database from '../services/database';

async function updateDatabase() {
  console.log('='.repeat(60));
  console.log('RAPTOR Database Update');
  console.log('='.repeat(60));

  try {
    const currentVersion = database.getMetadata('attack_version');
    const lastUpdated = database.getMetadata('last_updated');

    console.log('\nCurrent database:');
    console.log(`  ATT&CK Version: ${currentVersion || 'none'}`);
    console.log(`  Last Updated: ${lastUpdated || 'never'}`);

    // Fetch latest data
    console.log('\n📡 Fetching latest Enterprise ATT&CK data from TAXII server...');
    const bundle = await taxiiClient.fetchEnterpriseAttack();
    const latestVersion = taxiiClient.getAttackVersion(bundle);

    console.log(`\n✓ Fetched ${bundle.objects.length} objects`);
    console.log(`  Latest ATT&CK Version: ${latestVersion}`);

    if (currentVersion === latestVersion) {
      console.log('\n✓ Database is already up to date!');
      process.exit(0);
    }

    // Update database
    console.log(`\n💾 Updating database from ${currentVersion} to ${latestVersion}...`);
    database.storeBundle(bundle, latestVersion);

    // Show statistics
    const stats = database.getStats();
    console.log('\n✓ Database updated successfully!\n');
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
    console.error('\n❌ Error updating database:');
    console.error(error);
    process.exit(1);
  }
}

updateDatabase();
