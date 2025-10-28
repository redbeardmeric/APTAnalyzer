/**
 * Shared TypeScript types for the frontend
 * Mirrors backend API types
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface Tactic {
  id: string;
  name: string;
  description: string;
  shortname: string;
  externalId: string;
  url?: string;
}

export interface Technique {
  id: string;
  name: string;
  description: string;
  externalId: string;
  tactics: string[];
  platforms?: string[];
  isSubtechnique: boolean;
  url?: string;
  detection?: string;
  dataSources?: string[];
}

export interface Group {
  id: string;
  name: string;
  description: string;
  externalId: string;
  aliases?: string[];
  url?: string;
}

export interface Software {
  id: string;
  name: string;
  description: string;
  type: 'malware' | 'tool';
  externalId: string;
  platforms?: string[];
  aliases?: string[];
  url?: string;
}

export interface Mitigation {
  id: string;
  name: string;
  description: string;
  externalId: string;
  url?: string;
}

export interface AnalysisRequest {
  techniques: string[];
  software: string[];
  threshold?: number;
}

export interface AnalysisResult {
  groupId: string;
  groupName: string;
  matchPercentage: number;
  matchedTechniques: string[];
  matchedSoftware: string[];
  totalMatches: number;
}

export interface AnalysisResponse {
  results: AnalysisResult[];
  totalGroups: number;
  inputCount: number;
  timestamp: string;
}

export interface DataSourceInfo {
  attackVersion: string;
  lastUpdated: string;
  totalTactics: number;
  totalTechniques: number;
  totalGroups: number;
  totalSoftware: number;
  totalMitigations: number;
}
