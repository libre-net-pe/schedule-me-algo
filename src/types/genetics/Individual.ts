import { Chromosome } from "./Chromosome"

export type Individual = {
    chromosome: Chromosome
    fitness: number
    parent1: Individual
    parent2: Individual
    crossoverPoint: number
}