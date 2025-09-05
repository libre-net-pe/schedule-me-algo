import { GenerationStrategy } from "./generation/GenerationStrategy";
import { initizalizePopulation } from "./generation/initizalizePopulation";
import { TimeSlot } from "./types/domain/TimeSlot";
import { Offering } from "./types/domain/Offering";
import { Individual } from "./types/genetics/Individual";
import { Codec } from "./codec/Codec";

/**
 * Main orchestrator for the genetic algorithm-based school scheduling system.
 * 
 * The Executor class manages the evolutionary process to optimize teacher timetables
 * by running a genetic algorithm over multiple generations. It maintains the best
 * solution found across all generations and uses configurable strategies for
 * selection, crossover, mutation, and fitness evaluation.
 * 
 * @example
 * ```typescript
 * const slots = [
 *   { day: Day.MONDAY, start: "08:00", end: "08:45" },
 *   { day: Day.MONDAY, start: "08:45", end: "09:30" }
 * ];
 * const offerings = [
 *   { key: "MATH-GRADE1-A", requiredHours: 5 },
 *   { key: "ENGLISH-GRADE2-B", requiredHours: 3 }
 * ];
 * 
 * const executor = new Executor(slots, offerings, 100, 50);
 * const bestSchedule = executor.run();
 * console.log(`Best fitness: ${bestSchedule.fitness}`);
 * ```
 */
export class Executor {
  populationSize: number
  codec: Codec
  maxGenerations: number
  generationStrategy: GenerationStrategy

  /**
   * Creates a new Executor instance for genetic algorithm optimization.
   * 
   * @param slots - Array of available time slots for scheduling. Each slot represents
   *                a 45-minute period with specific day and time range (e.g., Monday 08:00-08:45)
   * @param offering - Array of course offerings that need to be scheduled. Each offering
   *                   represents a specific course requirement with identifier and required hours
   * @param populationSize - Size of the genetic algorithm population (number of candidate
   *                         solutions maintained per generation). Larger populations explore
   *                         more solutions but require more computation
   * @param maxGenerations - Maximum number of evolutionary generations to run. More generations
   *                         allow for better optimization but increase computation time
   */
  constructor(slots: Array<TimeSlot>, offering: Array<Offering>, populationSize: number, maxGenerations: number) {
    this.codec = new Codec(slots, offering)
    this.populationSize = populationSize
    this.maxGenerations = maxGenerations
    this.generationStrategy = new GenerationStrategy(this.codec)
  }

  /**
   * Executes the genetic algorithm to find the optimal schedule solution.
   * 
   * This method initializes a population of random schedule solutions and evolves
   * them over multiple generations using selection, crossover, and mutation operations.
   * The algorithm tracks and returns the best individual found across ALL generations,
   * not just the final generation.
   * 
   * The evolutionary process uses:
   * - Wheel roulette selection (fitness-proportionate selection)
   * - Global crossover strategy with 80% crossover rate
   * - Random mutation strategy with 30% mutation rate
   * - Rule-based fitness evaluation considering scheduling constraints
   * 
   * @returns The best Individual (schedule solution) found during evolution,
   *          containing the optimized chromosome, fitness score, and genealogy information
   */
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