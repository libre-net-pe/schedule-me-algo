import { Chromosome } from "../../types/genetics/Chromosome";

export interface PopulationConstraint {
    compute(chromosome: Chromosome): number
}