import { flip } from "../flip";
import { MutationStrategy } from "../mutation/MutationStrategy";
import { rand } from "../rand";
import { Chromosome } from "../types/genetics/Chromosome";
import { CrossoverStrategy } from "./CrossoverStrategy";

export class GlobalCrossoverStrategy implements CrossoverStrategy {
    probability: number
    mutationStrategy: MutationStrategy

    constructor(probability: number, mutationStrategy: MutationStrategy) {
        this.probability = probability
        this.mutationStrategy = mutationStrategy
    }

    crossover(parent1: Chromosome, parent2: Chromosome): [Chromosome, Chromosome, number] {
        let chromosomeLength = parent1.length
        let crossoverPoint = chromosomeLength

        let child1: Chromosome = []
        let child2: Chromosome = []

        if (flip(this.probability)) {
            crossoverPoint = rand(0, chromosomeLength-1)
        }
        for (let i = 0; i < crossoverPoint; i++) {
            child1.push(this.mutationStrategy.mutate(parent1[i]))
            child2.push(this.mutationStrategy.mutate(parent2[i]))
        }
        for (let i = crossoverPoint; i < chromosomeLength; i++) {
            child1.push(this.mutationStrategy.mutate(parent2[i]))
            child2.push(this.mutationStrategy.mutate(parent1[i]))
        }

        return [child1, child2, crossoverPoint]
    }
}