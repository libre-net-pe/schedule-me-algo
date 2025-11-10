import { Chromosome } from "./Chromosome"

export type Individual = {
    chromosome: Chromosome
    fitness: number
    parent1: Individual | null
    parent2: Individual | null
    crossoverPoint: number
}