import axios, { AxiosInstance } from 'axios';
import config from '../config';
import { StixBundle } from '../types/stix';

/**
 * TAXII 2.1 Client for MITRE ATT&CK Data
 */
export class TaxiiClient {
  private axiosInstance: AxiosInstance;
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${config.taxii.server}${config.taxii.apiRoot}`;
    this.axiosInstance = axios.create({
      headers: {
        Accept: 'application/taxii+json;version=2.1',
      },
      timeout: 30000,
    });
  }

  /**
   * Get TAXII server discovery information
   */
  async getDiscovery(): Promise<any> {
    const url = `${config.taxii.server}${config.taxii.discovery}`;
    const response = await this.axiosInstance.get(url);
    return response.data;
  }

  /**
   * Get list of available collections
   */
  async getCollections(): Promise<any> {
    const url = `${this.baseUrl}/collections/`;
    const response = await this.axiosInstance.get(url);
    return response.data;
  }

  /**
   * Get a specific collection by ID
   */
  async getCollection(collectionId: string): Promise<any> {
    const url = `${this.baseUrl}/collections/${collectionId}/`;
    const response = await this.axiosInstance.get(url);
    return response.data;
  }

  /**
   * Get all objects from a collection
   */
  async getCollectionObjects(collectionId: string): Promise<StixBundle> {
    const url = `${this.baseUrl}/collections/${collectionId}/objects/`;
    const response = await this.axiosInstance.get(url, {
      headers: {
        Accept: 'application/taxii+json;version=2.1',
      },
    });
    return response.data;
  }

  /**
   * Get Enterprise ATT&CK collection ID
   */
  async getEnterpriseCollectionId(): Promise<string | null> {
    const collections = await this.getCollections();
    const enterpriseCollection = collections.collections?.find(
      (c: any) =>
        c.title?.toLowerCase().includes('enterprise') &&
        c.title?.toLowerCase().includes('attack')
    );
    return enterpriseCollection?.id || null;
  }

  /**
   * Fetch Enterprise ATT&CK STIX data
   */
  async fetchEnterpriseAttack(): Promise<StixBundle> {
    console.log('Fetching Enterprise ATT&CK collection...');
    const collectionId = await this.getEnterpriseCollectionId();

    if (!collectionId) {
      throw new Error('Enterprise ATT&CK collection not found');
    }

    console.log(`Fetching objects from collection: ${collectionId}`);
    const bundle = await this.getCollectionObjects(collectionId);
    console.log(`Fetched ${bundle.objects?.length || 0} objects`);

    return bundle;
  }

  /**
   * Get ATT&CK version from bundle
   */
  getAttackVersion(bundle: StixBundle): string {
    // Look for x-mitre-collection object which contains version info
    const collection = bundle.objects.find((obj: any) => obj.type === 'x-mitre-collection');
    return collection?.['x_mitre_version'] || 'unknown';
  }
}

export default new TaxiiClient();
