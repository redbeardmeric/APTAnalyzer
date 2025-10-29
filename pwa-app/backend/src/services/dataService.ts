import database from './database';
import { Tactic, Technique, Group, Software, Mitigation, GroupRelationship, DataSourceInfo } from '../types/api';

/**
 * Data Service for querying MITRE ATT&CK data
 */
export class DataService {
  /**
   * Get all tactics
   */
  getTactics(): Tactic[] {
    const db = database.getDb();
    const rows = db.prepare('SELECT * FROM tactics ORDER BY name').all() as any[];

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      shortname: row.shortname,
      externalId: row.external_id,
      url: row.url,
    }));
  }

  /**
   * Get all techniques
   */
  getTechniques(tacticShortname?: string): Technique[] {
    const db = database.getDb();
    let rows: any[];

    if (tacticShortname) {
      // Get techniques by tactic using kill_chain_phases
      rows = db
        .prepare(
          `
        SELECT DISTINCT t.* FROM techniques t
        WHERE t.data LIKE ?
        ORDER BY t.name
      `
        )
        .all(`%"phase_name":"${tacticShortname}"%`) as any[];
    } else {
      rows = db.prepare('SELECT * FROM techniques ORDER BY name').all() as any[];
    }

    return rows.map((row) => this.mapTechnique(row));
  }

  /**
   * Get technique by ID or external ID
   */
  getTechnique(id: string): Technique | null {
    const db = database.getDb();
    const row = db
      .prepare('SELECT * FROM techniques WHERE id = ? OR external_id = ?')
      .get(id, id) as any;

    return row ? this.mapTechnique(row) : null;
  }

  /**
   * Get all groups
   */
  getGroups(): Group[] {
    const db = database.getDb();
    const rows = db.prepare('SELECT * FROM groups ORDER BY name').all() as any[];

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      externalId: row.external_id,
      aliases: row.aliases ? JSON.parse(row.aliases) : [],
      url: row.url,
    }));
  }

  /**
   * Get group by ID or external ID
   */
  getGroup(id: string): Group | null {
    const db = database.getDb();
    const row = db
      .prepare('SELECT * FROM groups WHERE id = ? OR external_id = ?')
      .get(id, id) as any;

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      externalId: row.external_id,
      aliases: row.aliases ? JSON.parse(row.aliases) : [],
      url: row.url,
    };
  }

  /**
   * Get all software (malware and tools)
   */
  getSoftware(): Software[] {
    const db = database.getDb();
    const rows = db.prepare('SELECT * FROM software ORDER BY name').all() as any[];

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      type: row.type as 'malware' | 'tool',
      externalId: row.external_id,
      platforms: row.platforms ? JSON.parse(row.platforms) : [],
      aliases: row.aliases ? JSON.parse(row.aliases) : [],
      url: row.url,
    }));
  }

  /**
   * Get all mitigations
   */
  getMitigations(): Mitigation[] {
    const db = database.getDb();
    const rows = db.prepare('SELECT * FROM mitigations ORDER BY name').all() as any[];

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      externalId: row.external_id,
      url: row.url,
    }));
  }

  /**
   * Get techniques used by a group
   */
  getGroupTechniques(groupId: string): Technique[] {
    const db = database.getDb();
    const rows = db
      .prepare(
        `
      SELECT DISTINCT t.* FROM techniques t
      JOIN relationships r ON t.id = r.target_ref
      WHERE r.source_ref = ? AND r.relationship_type = 'uses' AND r.target_ref LIKE 'attack-pattern%'
      ORDER BY t.name
    `
      )
      .all(groupId) as any[];

    return rows.map((row) => this.mapTechnique(row));
  }

  /**
   * Get software used by a group
   */
  getGroupSoftware(groupId: string): Software[] {
    const db = database.getDb();
    const rows = db
      .prepare(
        `
      SELECT DISTINCT s.* FROM software s
      JOIN relationships r ON s.id = r.target_ref
      WHERE r.source_ref = ? AND r.relationship_type = 'uses'
      ORDER BY s.name
    `
      )
      .all(groupId) as any[];

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      type: row.type as 'malware' | 'tool',
      externalId: row.external_id,
      platforms: row.platforms ? JSON.parse(row.platforms) : [],
      aliases: row.aliases ? JSON.parse(row.aliases) : [],
      url: row.url,
    }));
  }

  /**
   * Get mitigations for a technique
   */
  getTechniqueMitigations(techniqueId: string): Mitigation[] {
    const db = database.getDb();
    const rows = db
      .prepare(
        `
      SELECT DISTINCT m.* FROM mitigations m
      JOIN relationships r ON m.id = r.source_ref
      WHERE r.target_ref = ? AND r.relationship_type = 'mitigates'
      ORDER BY m.name
    `
      )
      .all(techniqueId) as any[];

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      externalId: row.external_id,
      url: row.url,
    }));
  }

  /**
   * Get all group relationships (for analysis)
   */
  getGroupRelationships(): GroupRelationship[] {
    const db = database.getDb();
    const rows = db
      .prepare(
        `
      SELECT
        r.source_ref as groupId,
        g.name as groupName,
        r.target_ref as targetId,
        COALESCE(t.name, s.name) as targetName,
        CASE
          WHEN t.id IS NOT NULL THEN 'technique'
          WHEN s.id IS NOT NULL THEN 'software'
        END as targetType,
        r.description
      FROM relationships r
      JOIN groups g ON r.source_ref = g.id
      LEFT JOIN techniques t ON r.target_ref = t.id
      LEFT JOIN software s ON r.target_ref = s.id
      WHERE r.relationship_type = 'uses' AND (t.id IS NOT NULL OR s.id IS NOT NULL)
    `
      )
      .all() as any[];

    return rows.map((row) => ({
      groupId: row.groupId,
      groupName: row.groupName,
      targetId: row.targetId,
      targetName: row.targetName,
      targetType: row.targetType as 'technique' | 'software',
      description: row.description,
    }));
  }

  /**
   * Get data source info
   */
  getDataSourceInfo(): DataSourceInfo {
    const stats = database.getStats();

    return {
      attackVersion: database.getMetadata('attack_version') || 'unknown',
      lastUpdated: database.getMetadata('last_updated') || 'never',
      totalTactics: stats.tactics.count,
      totalTechniques: stats.techniques.count,
      totalGroups: stats.groups.count,
      totalSoftware: stats.software.count,
      totalMitigations: stats.mitigations.count,
    };
  }

  /**
   * Helper to map technique row to Technique object
   */
  private mapTechnique(row: any): Technique {
    const data = JSON.parse(row.data);
    const tactics = data.kill_chain_phases?.map((phase: any) => phase.phase_name) || [];

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      externalId: row.external_id,
      tactics,
      platforms: row.platforms ? JSON.parse(row.platforms) : [],
      isSubtechnique: row.is_subtechnique === 1,
      url: row.url,
      detection: row.detection,
      dataSources: row.data_sources ? JSON.parse(row.data_sources) : [],
    };
  }
}

export default new DataService();
