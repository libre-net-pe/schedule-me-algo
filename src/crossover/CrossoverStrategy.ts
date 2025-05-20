import { Chromosome } from "../types/genetics/Chromosome";

export interface CrossoverStrategy {
    crossover(parent1: Chromosome, parent2: Chromosome) : [Chromosome, Chromosome, number]
}