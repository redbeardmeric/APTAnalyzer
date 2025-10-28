import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import config from '../config';
import { StixBundle, AnyStixObject } from '../types/stix';

/**
 * SQLite Database Service for caching MITRE ATT&CK data
 */
export class DatabaseService {
  private db: Database.Database;

  constructor() {
    // Ensure database directory exists
    const dbDir = path.dirname(config.database.path);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    this.db = new Database(config.database.path);
    this.db.pragma('journal_mode = WAL');
    this.initializeTables();
  }

  private initializeTables(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS metadata (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tactics (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        shortname TEXT,
        external_id TEXT,
        url TEXT,
        data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS techniques (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        external_id TEXT,
        is_subtechnique INTEGER DEFAULT 0,
        platforms TEXT,
        url TEXT,
        detection TEXT,
        data_sources TEXT,
        data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS groups (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        external_id TEXT,
        aliases TEXT,
        url TEXT,
        data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS software (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        type TEXT,
        external_id TEXT,
        platforms TEXT,
        aliases TEXT,
        url TEXT,
        data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS mitigations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        external_id TEXT,
        url TEXT,
        data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS relationships (
        id TEXT PRIMARY KEY,
        relationship_type TEXT NOT NULL,
        source_ref TEXT NOT NULL,
        target_ref TEXT NOT NULL,
        description TEXT,
        data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_techniques_name ON techniques(name);
      CREATE INDEX IF NOT EXISTS idx_techniques_external_id ON techniques(external_id);
      CREATE INDEX IF NOT EXISTS idx_groups_name ON groups(name);
      CREATE INDEX IF NOT EXISTS idx_groups_external_id ON groups(external_id);
      CREATE INDEX IF NOT EXISTS idx_software_name ON software(name);
      CREATE INDEX IF NOT EXISTS idx_relationships_source ON relationships(source_ref);
      CREATE INDEX IF NOT EXISTS idx_relationships_target ON relationships(target_ref);
      CREATE INDEX IF NOT EXISTS idx_relationships_type ON relationships(relationship_type);
    `);
  }

  /**
   * Store STIX bundle in database
   */
  storeBundle(bundle: StixBundle, attackVersion: string): void {
    const insertTactic = this.db.prepare(`
      INSERT OR REPLACE INTO tactics (id, name, description, shortname, external_id, url, data)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertTechnique = this.db.prepare(`
      INSERT OR REPLACE INTO techniques (id, name, description, external_id, is_subtechnique, platforms, url, detection, data_sources, data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertGroup = this.db.prepare(`
      INSERT OR REPLACE INTO groups (id, name, description, external_id, aliases, url, data)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertSoftware = this.db.prepare(`
      INSERT OR REPLACE INTO software (id, name, description, type, external_id, platforms, aliases, url, data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMitigation = this.db.prepare(`
      INSERT OR REPLACE INTO mitigations (id, name, description, external_id, url, data)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertRelationship = this.db.prepare(`
      INSERT OR REPLACE INTO relationships (id, relationship_type, source_ref, target_ref, description, data)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const transaction = this.db.transaction((objects: AnyStixObject[]) => {
      for (const obj of objects) {
        const objData = JSON.stringify(obj);
        const externalRef = (obj as any).external_references?.[0];
        const externalId = externalRef?.external_id;
        const url = externalRef?.url;

        try {
          switch (obj.type) {
            case 'x-mitre-tactic':
              insertTactic.run(
                obj.id,
                (obj as any).name,
                (obj as any).description,
                (obj as any).x_mitre_shortname,
                externalId,
                url,
                objData
              );
              break;

            case 'attack-pattern':
              insertTechnique.run(
                obj.id,
                (obj as any).name,
                (obj as any).description,
                externalId,
                (obj as any).x_mitre_is_subtechnique ? 1 : 0,
                JSON.stringify((obj as any).x_mitre_platforms || []),
                url,
                (obj as any).x_mitre_detection || null,
                JSON.stringify((obj as any).x_mitre_data_sources || []),
                objData
              );
              break;

            case 'intrusion-set':
              insertGroup.run(
                obj.id,
                (obj as any).name,
                (obj as any).description,
                externalId,
                JSON.stringify((obj as any).aliases || []),
                url,
                objData
              );
              break;

            case 'malware':
            case 'tool':
              insertSoftware.run(
                obj.id,
                (obj as any).name,
                (obj as any).description,
                obj.type,
                externalId,
                JSON.stringify((obj as any).x_mitre_platforms || []),
                JSON.stringify((obj as any).x_mitre_aliases || []),
                url,
                objData
              );
              break;

            case 'course-of-action':
              insertMitigation.run(
                obj.id,
                (obj as any).name,
                (obj as any).description,
                externalId,
                url,
                objData
              );
              break;

            case 'relationship':
              insertRelationship.run(
                obj.id,
                (obj as any).relationship_type,
                (obj as any).source_ref,
                (obj as any).target_ref,
                (obj as any).description || null,
                objData
              );
              break;
          }
        } catch (error) {
          console.error(`Error inserting ${obj.type} ${obj.id}:`, error);
        }
      }
    });

    console.log('Storing bundle in database...');
    transaction(bundle.objects);

    // Update metadata
    this.setMetadata('attack_version', attackVersion);
    this.setMetadata('last_updated', new Date().toISOString());
    console.log('Database updated successfully');
  }

  /**
   * Get metadata value
   */
  getMetadata(key: string): string | null {
    const row = this.db.prepare('SELECT value FROM metadata WHERE key = ?').get(key) as any;
    return row?.value || null;
  }

  /**
   * Set metadata value
   */
  setMetadata(key: string, value: string): void {
    this.db
      .prepare('INSERT OR REPLACE INTO metadata (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)')
      .run(key, value);
  }

  /**
   * Check if database is initialized
   */
  isInitialized(): boolean {
    const version = this.getMetadata('attack_version');
    return version !== null;
  }

  /**
   * Get database statistics
   */
  getStats() {
    return {
      tactics: this.db.prepare('SELECT COUNT(*) as count FROM tactics').get() as any,
      techniques: this.db.prepare('SELECT COUNT(*) as count FROM techniques').get() as any,
      groups: this.db.prepare('SELECT COUNT(*) as count FROM groups').get() as any,
      software: this.db.prepare('SELECT COUNT(*) as count FROM software').get() as any,
      mitigations: this.db.prepare('SELECT COUNT(*) as count FROM mitigations').get() as any,
      relationships: this.db.prepare('SELECT COUNT(*) as count FROM relationships').get() as any,
    };
  }

  /**
   * Close database connection
   */
  close(): void {
    this.db.close();
  }

  /**
   * Get database instance
   */
  getDb(): Database.Database {
    return this.db;
  }
}

export default new DatabaseService();
