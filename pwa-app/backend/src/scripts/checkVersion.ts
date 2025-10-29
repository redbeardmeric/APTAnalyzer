/**
 * Version Check Script
 * Checks current database version against latest available version
 */
import stixLoader from '../services/stixLoader';
import database from '../services/database';

async function checkVersion() {
  console.log('='.repeat(60));
  console.log('RAPTOR Version Check');
  console.log('='.repeat(60));

  try {
    // Get current database version
    const currentVersion = database.getMetadata('attack_version');
    const lastUpdated = database.getMetadata('last_updated');

    console.log('\n📊 Current Database:');
    console.log(`   ATT&CK Version: ${currentVersion || 'not initialized'}`);
    console.log(`   Last Updated: ${lastUpdated || 'never'}`);

    if (!database.isInitialized()) {
      console.log('\n⚠️  Database not initialized. Run: npm run db:init');
      process.exit(1);
    }

    // Check GitHub for latest version
    console.log('\n🔍 Checking for updates...');
    const releaseInfo = await stixLoader.getLatestReleaseInfo();

    console.log('\n📦 Latest Available:');
    console.log(`   GitHub Release: ${releaseInfo.version}`);
    console.log(`   Published: ${new Date(releaseInfo.publishedAt).toLocaleDateString()}`);
    console.log(`   URL: ${releaseInfo.downloadUrl}`);

    // Compare versions
    const stats = database.getStats();
    console.log('\n📈 Database Statistics:');
    console.log(`   Tactics:       ${stats.tactics.count}`);
    console.log(`   Techniques:    ${stats.techniques.count}`);
    console.log(`   Groups:        ${stats.groups.count}`);
    console.log(`   Software:      ${stats.software.count}`);
    console.log(`   Mitigations:   ${stats.mitigations.count}`);
    console.log(`   Relationships: ${stats.relationships.count}`);

    // Recommendation
    const currentDate = lastUpdated ? new Date(lastUpdated) : new Date(0);
    const daysSinceUpdate = Math.floor(
      (Date.now() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    console.log('\n💡 Recommendation:');
    if (daysSinceUpdate > 30) {
      console.log(
        `   ⚠️  Database is ${daysSinceUpdate} days old. Consider updating.`
      );
      console.log('   Run: npm run db:update');
    } else if (daysSinceUpdate > 7) {
      console.log(`   ℹ️  Database is ${daysSinceUpdate} days old. Update available.`);
      console.log('   Run: npm run db:update');
    } else {
      console.log(`   ✓ Database is up to date (${daysSinceUpdate} days old)`);
    }

    console.log('\n' + '='.repeat(60));
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error checking version:');
    console.error(error);
    process.exit(1);
  }
}

checkVersion();
