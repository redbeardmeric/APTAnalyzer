import axios, { type AxiosInstance } from 'axios';
import type {
  ApiResponse,
  Tactic,
  Technique,
  Group,
  Software,
  Mitigation,
  AnalysisRequest,
  AnalysisResponse,
  DataSourceInfo,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class RaptorAPI {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Health check
   */
  async health(): Promise<ApiResponse<any>> {
    const response = await this.client.get('/health');
    return response.data;
  }

  /**
   * Get data source information
   */
  async getDataSourceInfo(): Promise<DataSourceInfo> {
    const response = await this.client.get<ApiResponse<DataSourceInfo>>('/data-source/info');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch data source info');
    }
    return response.data.data;
  }

  /**
   * Get all tactics
   */
  async getTactics(): Promise<Tactic[]> {
    const response = await this.client.get<ApiResponse<Tactic[]>>('/tactics');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch tactics');
    }
    return response.data.data;
  }

  /**
   * Get all techniques, optionally filtered by tactic
   */
  async getTechniques(tacticShortname?: string): Promise<Technique[]> {
    const params = tacticShortname ? { tactic: tacticShortname } : undefined;
    const response = await this.client.get<ApiResponse<Technique[]>>('/techniques', { params });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch techniques');
    }
    return response.data.data;
  }

  /**
   * Get a specific technique
   */
  async getTechnique(id: string): Promise<Technique> {
    const response = await this.client.get<ApiResponse<Technique>>(`/techniques/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch technique');
    }
    return response.data.data;
  }

  /**
   * Get mitigations for a technique
   */
  async getTechniqueMitigations(id: string): Promise<Mitigation[]> {
    const response = await this.client.get<ApiResponse<Mitigation[]>>(
      `/techniques/${id}/mitigations`
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch mitigations');
    }
    return response.data.data;
  }

  /**
   * Get all groups
   */
  async getGroups(): Promise<Group[]> {
    const response = await this.client.get<ApiResponse<Group[]>>('/groups');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch groups');
    }
    return response.data.data;
  }

  /**
   * Get a specific group
   */
  async getGroup(id: string): Promise<Group> {
    const response = await this.client.get<ApiResponse<Group>>(`/groups/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch group');
    }
    return response.data.data;
  }

  /**
   * Get techniques used by a group
   */
  async getGroupTechniques(id: string): Promise<Technique[]> {
    const response = await this.client.get<ApiResponse<Technique[]>>(`/groups/${id}/techniques`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch group techniques');
    }
    return response.data.data;
  }

  /**
   * Get software used by a group
   */
  async getGroupSoftware(id: string): Promise<Software[]> {
    const response = await this.client.get<ApiResponse<Software[]>>(`/groups/${id}/software`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch group software');
    }
    return response.data.data;
  }

  /**
   * Get all software
   */
  async getSoftware(): Promise<Software[]> {
    const response = await this.client.get<ApiResponse<Software[]>>('/software');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch software');
    }
    return response.data.data;
  }

  /**
   * Analyze techniques and software to rank APT groups
   */
  async analyze(request: AnalysisRequest): Promise<AnalysisResponse> {
    const response = await this.client.post<ApiResponse<AnalysisResponse>>('/analysis', request);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to analyze threats');
    }
    return response.data.data;
  }

  /**
   * Get count of potential matches above threshold
   */
  async countMatches(request: AnalysisRequest): Promise<number> {
    const response = await this.client.post<
      ApiResponse<{ count: number; threshold: number }>
    >('/analysis/count', request);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to count matches');
    }
    return response.data.data.count;
  }
}

export const api = new RaptorAPI();
export default api;
