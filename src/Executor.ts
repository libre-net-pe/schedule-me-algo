import { GenerationStrategy } from "./generation/GenerationStrategy";
import { initizalizePopulation } from "./generation/initizalizePopulation";
import { TimeSlot } from "./types/domain/TimeSlot";
import { Offering } from "./types/domain/Offering";
import { Individual } from "./types/genetics/Individual";
import { Codec } from "./codec/Codec";

export class Executor {
  populationSize: number
  codec: Codec
  maxGenerations: number
  generationStrategy: GenerationStrategy

  constructor(slots: Array<TimeSlot>, offering: Array<Offering>, populationSize: number, maxGenerations: number) {
    this.codec = new Codec(slots, offering)
    this.populationSize = populationSize
    this.maxGenerations = maxGenerations
    this.generationStrategy = new GenerationStrategy(this.codec)
  }

  run(): Individual {
    // Initialize population
    let population = initizalizePopulation(this.codec, this.populationSize)
    
    // Track the best individual across all generations
    let bestIndividual = population.reduce((best, current) => 
      current.fitness > best.fitness ? current : best
    );
    
    // Run generations
    for (let i = 0; i < this.maxGenerations; i++) {
      population = this.generationStrategy.generate(population)
      
      // Update best individual if we found a better one
      const currentBest = population.reduce((best, current) => 
        current.fitness > best.fitness ? current : best
      );
      
      if (currentBest.fitness > bestIndividual.fitness) {
        bestIndividual = currentBest;
      }
    }

    return bestIndividual;
  }
}