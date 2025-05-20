import { Codec } from "../codec/Codec";
import { CrossoverStrategy } from "../crossover/CrossoverStrategy";
import { GlobalCrossoverStrategy } from "../crossover/GlobalCrossoverStrategy";
import { FitnessStrategy } from "../fitness/FitnessStrategy";
import { RuleBasedFitnessStrategy } from "../fitness/RuleBasedFitnessStrategy";
import { MutationStrategy } from "../mutation/MutationStrategy";
import { RandomMutationStrategy } from "../mutation/RandomMutationStrategy";
import { WheelRouletteSelectionStrategy } from "../select/WheelRouletteSelectionStrategy";
import { Population } from "../types/genetics/Population";

export class GenerationStrategy {
    codec: Codec
    mutationStrategy: MutationStrategy
    crossoverStrategy: CrossoverStrategy
    fitnessStrategy: FitnessStrategy

    constructor(codec: Codec) {
        this.codec = codec
        this.mutationStrategy = new RandomMutationStrategy(0.3, codec.getTotalCombinations())
        this.crossoverStrategy = new GlobalCrossoverStrategy(0.8, this.mutationStrategy)
        this.fitnessStrategy = new RuleBasedFitnessStrategy(codec)
    }
    
    generate(population: Population): Population {
        let newPopulation: Population = []
        
        let selectionStrategy = new WheelRouletteSelectionStrategy(population)
        while (newPopulation.length < population.length) {
            let parent1 = selectionStrategy.select()
            let parent2 = selectionStrategy.select()

            let [child1, child2, crossoverPoint] = this.crossoverStrategy.crossover(parent1.chromosome, parent2.chromosome)

            newPopulation.push({
                chromosome: child1,
                fitness: this.fitnessStrategy.compute(child1),
                parent1,
                parent2,
                crossoverPoint
            })

            newPopulation.push({
                chromosome: child2,
                fitness: this.fitnessStrategy.compute(child2),
                parent1,
                parent2,
                crossoverPoint
            })
        }

        return newPopulation
    }
}