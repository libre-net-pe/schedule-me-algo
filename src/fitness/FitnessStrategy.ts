import { Chromosome } from "../types/genetics/Chromosome";

export interface FitnessStrategy {
    compute(chromosome: Chromosome): number
}