import { Codec } from "../../codec/Codec";
import { Chromosome } from "../../types/genetics/Chromosome";
import { PopulationConstriant } from "./PopulationConstriant";

export class RequirementsConstraint implements PopulationConstriant {
  codec: Codec

  constructor(codec: Codec) {
    this.codec = codec
  }

  compute(chromosome: Chromosome): number {
    // Create a map to track assigned hours per grade-section-subject
    const assignedHours = new Map<string, number>();

    // Decode chromosome and count assigned hours
    chromosome.forEach(allele => {
      const assignment = this.codec.decode(allele);
      if (assignment) {
        const key = assignment.offering.key;
        const currentHours = assignedHours.get(key) || 0;
        assignedHours.set(key, currentHours + 1); // Each assignment represents 1 hour
      }
    });

    // Count unmet requirements by comparing with required hours
    let unmetRequirements = 0;
    this.codec.offerings.forEach(offer => {
      const assigned = assignedHours.get(offer.key) || 0;
      const required = offer.requiredHours;

      if (assigned < required) {
        unmetRequirements += (required - assigned);
      }
    });

    return unmetRequirements;
  }
}
