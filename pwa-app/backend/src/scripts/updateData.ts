/**
 * Database Update Script
 * Updates MITRE ATT&CK data from GitHub (preferred) or TAXII server (fallback)
 *
 * Strategy:
 * 1. Check GitHub for latest release version
 * 2. Download from GitHub if available (no rate limits)
 * 3. Fallback to TAXII if GitHub fails (subject to 10 requests/10 min limit)
 */
import stixLoader from '../services/stixLoader';
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

    let bundle;
    let latestVersion;
    let source = 'GitHub';

    // Try GitHub first (no rate limits)
    try {
      console.log('\n1️⃣  Checking for updates from GitHub...');
      const releaseInfo = await stixLoader.getLatestReleaseInfo();
      console.log(`   Latest GitHub release: ${releaseInfo.version}`);
      console.log(`   Published: ${releaseInfo.publishedAt}`);

      console.log('\n2️⃣  Downloading latest bundle from GitHub...');
      bundle = await stixLoader.downloadFromGitHub();
      latestVersion = stixLoader.getAttackVersion(bundle);

      // Update cache
      console.log('\n3️⃣  Updating cache...');
      await stixLoader.saveToCache(bundle);
    } catch (githubError) {
      console.warn(`\n⚠️  GitHub download failed: ${githubError}`);
      console.log('\n4️⃣  Falling back to TAXII server...');
      console.log('   ⚠️  Note: TAXII 2.1 has rate limits (10 requests per 10 minutes)');

      source = 'TAXII';
      bundle = await taxiiClient.fetchEnterpriseAttack();
      latestVersion = taxiiClient.getAttackVersion(bundle);
    }

    console.log(`\n✓ Fetched ${bundle.objects.length} objects from ${source}`);
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
