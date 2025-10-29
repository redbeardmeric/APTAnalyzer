/**
 * STIX Bundle Loader
 * Loads MITRE ATT&CK data from GitHub repository (for initial load)
 * or TAXII server (for updates)
 */
import axios from 'axios';
import { StixBundle } from '../types/stix';
import * as fs from 'fs';
import * as path from 'path';

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/mitre/cti/master';
const CACHE_DIR = path.join(__dirname, '../../cache');

export class StixLoader {
  /**
   * Download Enterprise ATT&CK STIX bundle from GitHub
   */
  async downloadFromGitHub(): Promise<StixBundle> {
    console.log('Downloading Enterprise ATT&CK bundle from GitHub...');

    const url = `${GITHUB_RAW_BASE}/enterprise-attack/enterprise-attack.json`;

    try {
      const response = await axios.get<StixBundle>(url, {
        timeout: 120000, // 2 minutes timeout for large file
        headers: {
          Accept: 'application/json',
        },
      });

      console.log(`✓ Downloaded ${response.data.objects.length} objects`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to download from GitHub: ${error.message}. URL: ${url}`
        );
      }
      throw error;
    }
  }

  /**
   * Save bundle to local cache
   */
  async saveToCache(bundle: StixBundle, filename: string = 'enterprise-attack.json'): Promise<void> {
    // Create cache directory if it doesn't exist
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    const filePath = path.join(CACHE_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(bundle, null, 2));
    console.log(`✓ Cached bundle to ${filePath}`);
  }

  /**
   * Load bundle from local cache
   */
  loadFromCache(filename: string = 'enterprise-attack.json'): StixBundle | null {
    const filePath = path.join(CACHE_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      const bundle = JSON.parse(data) as StixBundle;
      console.log(`✓ Loaded ${bundle.objects.length} objects from cache`);
      return bundle;
    } catch (error) {
      console.error(`Error reading cache file: ${error}`);
      return null;
    }
  }

  /**
   * Get ATT&CK version from bundle
   */
  getAttackVersion(bundle: StixBundle): string {
    // Look for x-mitre-collection object which contains version info
    const collection: any = bundle.objects.find(
      (obj: any) => obj.type === 'x-mitre-collection'
    );
    return collection?.['x_mitre_version'] || 'unknown';
  }

  /**
   * Get bundle metadata
   */
  getBundleMetadata(bundle: StixBundle): {
    version: string;
    objectCount: number;
    tactics: number;
    techniques: number;
    groups: number;
    software: number;
    mitigations: number;
  } {
    const version = this.getAttackVersion(bundle);

    const counts = {
      tactics: bundle.objects.filter((obj: any) => obj.type === 'x-mitre-tactic').length,
      techniques: bundle.objects.filter(
        (obj: any) => obj.type === 'attack-pattern'
      ).length,
      groups: bundle.objects.filter((obj: any) => obj.type === 'intrusion-set').length,
      software: bundle.objects.filter(
        (obj: any) => obj.type === 'malware' || obj.type === 'tool'
      ).length,
      mitigations: bundle.objects.filter(
        (obj: any) => obj.type === 'course-of-action'
      ).length,
    };

    return {
      version,
      objectCount: bundle.objects.length,
      ...counts,
    };
  }

  /**
   * Download latest release info from GitHub API
   */
  async getLatestReleaseInfo(): Promise<{
    version: string;
    publishedAt: string;
    downloadUrl: string;
  }> {
    try {
      const response = await axios.get(
        'https://api.github.com/repos/mitre/cti/releases/latest',
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      return {
        version: response.data.tag_name || 'unknown',
        publishedAt: response.data.published_at,
        downloadUrl: response.data.html_url,
      };
    } catch (error) {
      console.warn('Could not fetch latest release info from GitHub');
      return {
        version: 'unknown',
        publishedAt: new Date().toISOString(),
        downloadUrl: 'https://github.com/mitre/cti/releases',
      };
    }
  }
}

export default new StixLoader();
