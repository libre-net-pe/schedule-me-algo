import { Chromosome } from "../../types/genetics/Chromosome";
import { PopulationConstriant } from "./PopulationConstriant";

export class DuplicatesContraint implements PopulationConstriant {
  compute(chromosome: Chromosome): number {
    const frequencyMap = new Map<number, number>();
    let duplicates = 0;

    // Count frequency of each allele
    for (const allele of chromosome) {
      frequencyMap.set(allele, (frequencyMap.get(allele) || 0) + 1);
    }

    // Calculate penalty based on duplicates
    Array.from(frequencyMap.values()).forEach(count => {
      if (count > 1) {
        // For each duplicate, add a penalty that increases with the number of duplicates
        duplicates += count - 1;
      }
    });

    // Return the penalty - higher number means more duplicates
    return duplicates;
  }
}