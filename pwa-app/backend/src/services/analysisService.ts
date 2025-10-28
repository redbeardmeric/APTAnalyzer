import dataService from './dataService';
import { AnalysisRequest, AnalysisResult } from '../types/api';

/**
 * Analysis Service - Core RAPTOR algorithm
 * Analyzes selected techniques/software and ranks APT groups by match percentage
 */
export class AnalysisService {
  /**
   * Analyze techniques and software to rank potential APT groups
   */
  analyzeThreats(request: AnalysisRequest): AnalysisResult[] {
    const { techniques, software, threshold = 50 } = request;

    // Get all group relationships
    const relationships = dataService.getGroupRelationships();

    // Build a map of groups and their associated techniques/software
    const groupMap = new Map<
      string,
      {
        name: string;
        techniques: Set<string>;
        software: Set<string>;
      }
    >();

    // Populate group map
    for (const rel of relationships) {
      if (!groupMap.has(rel.groupId)) {
        groupMap.set(rel.groupId, {
          name: rel.groupName,
          techniques: new Set(),
          software: new Set(),
        });
      }

      const group = groupMap.get(rel.groupId)!;

      if (rel.targetType === 'technique') {
        group.techniques.add(rel.targetName);
      } else if (rel.targetType === 'software') {
        group.software.add(rel.targetName);
      }
    }

    // Calculate matches for each group
    const results: AnalysisResult[] = [];
    const totalInputs = techniques.length + software.length;

    if (totalInputs === 0) {
      return results;
    }

    for (const [groupId, groupData] of groupMap.entries()) {
      let matchCount = 0;
      const matchedTechniques: string[] = [];
      const matchedSoftware: string[] = [];

      // Check technique matches
      for (const technique of techniques) {
        if (groupData.techniques.has(technique)) {
          matchCount++;
          matchedTechniques.push(technique);
        }
      }

      // Check software matches
      for (const sw of software) {
        if (groupData.software.has(sw)) {
          matchCount++;
          matchedSoftware.push(sw);
        }
      }

      // Calculate match percentage
      const matchPercentage = Math.ceil((matchCount / totalInputs) * 100);

      // Only include groups above threshold
      if (matchPercentage >= threshold) {
        results.push({
          groupId,
          groupName: groupData.name,
          matchPercentage,
          matchedTechniques,
          matchedSoftware,
          totalMatches: matchCount,
        });
      }
    }

    // Sort by match percentage (descending), then by name
    results.sort((a, b) => {
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      return a.groupName.localeCompare(b.groupName);
    });

    return results;
  }

  /**
   * Count potential matches above a threshold without returning full results
   * (Useful for the real-time counter in the UI)
   */
  countPotentialMatches(techniqueNames: string[], softwareNames: string[], threshold: number): number {
    const results = this.analyzeThreats({
      techniques: techniqueNames,
      software: softwareNames,
      threshold,
    });

    return results.length;
  }
}

export default new AnalysisService();
