/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: asteroids
 * Interface for Asteroids
 */
export interface Asteroids {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  asteroidName?: string;
  /** @wixFieldType text */
  riskLevel?: string;
  /** @wixFieldType date */
  closeApproachDate?: Date | string;
  /** @wixFieldType number */
  missDistance?: number;
  /** @wixFieldType boolean */
  isPotentiallyHazardous?: boolean;
  /** @wixFieldType number */
  estimatedDiameter?: number;
  /** @wixFieldType number */
  relativeVelocity?: number;
}
