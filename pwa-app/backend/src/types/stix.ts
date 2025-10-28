/**
 * STIX 2.1 Type Definitions for MITRE ATT&CK
 */

export interface StixObject {
  type: string;
  id: string;
  created: string;
  modified: string;
  spec_version?: string;
  object_marking_refs?: string[];
}

export interface AttackPattern extends StixObject {
  type: 'attack-pattern';
  name: string;
  description: string;
  external_references: ExternalReference[];
  kill_chain_phases?: KillChainPhase[];
  x_mitre_platforms?: string[];
  x_mitre_version?: string;
  x_mitre_deprecated?: boolean;
  x_mitre_is_subtechnique?: boolean;
  x_mitre_detection?: string;
  x_mitre_data_sources?: string[];
}

export interface IntrusionSet extends StixObject {
  type: 'intrusion-set';
  name: string;
  description: string;
  aliases?: string[];
  external_references: ExternalReference[];
  x_mitre_version?: string;
  x_mitre_deprecated?: boolean;
}

export interface Malware extends StixObject {
  type: 'malware';
  name: string;
  description: string;
  is_family?: boolean;
  external_references: ExternalReference[];
  x_mitre_platforms?: string[];
  x_mitre_version?: string;
  x_mitre_deprecated?: boolean;
  x_mitre_aliases?: string[];
}

export interface Tool extends StixObject {
  type: 'tool';
  name: string;
  description: string;
  external_references: ExternalReference[];
  x_mitre_platforms?: string[];
  x_mitre_version?: string;
  x_mitre_deprecated?: boolean;
  x_mitre_aliases?: string[];
}

export interface CourseOfAction extends StixObject {
  type: 'course-of-action';
  name: string;
  description: string;
  external_references: ExternalReference[];
  x_mitre_version?: string;
  x_mitre_deprecated?: boolean;
}

export interface Relationship extends StixObject {
  type: 'relationship';
  relationship_type: string;
  source_ref: string;
  target_ref: string;
  description?: string;
  external_references?: ExternalReference[];
}

export interface XMitreTactic extends StixObject {
  type: 'x-mitre-tactic';
  name: string;
  description: string;
  external_references: ExternalReference[];
  x_mitre_shortname: string;
}

export interface ExternalReference {
  source_name: string;
  external_id?: string;
  url?: string;
  description?: string;
}

export interface KillChainPhase {
  kill_chain_name: string;
  phase_name: string;
}

export interface StixBundle {
  type: 'bundle';
  id: string;
  objects: StixObject[];
}

export type AnyStixObject =
  | AttackPattern
  | IntrusionSet
  | Malware
  | Tool
  | CourseOfAction
  | Relationship
  | XMitreTactic;
