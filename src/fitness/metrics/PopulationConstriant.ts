import { Chromosome } from "../../types/genetics/Chromosome";

export interface PopulationConstriant {
    compute(chromosome: Chromosome): number
}