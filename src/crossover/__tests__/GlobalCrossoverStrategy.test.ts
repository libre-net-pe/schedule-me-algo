import { GlobalCrossoverStrategy } from '../GlobalCrossoverStrategy';
import { RandomMutationStrategy } from '@/mutation/RandomMutationStrategy';
import { Chromosome } from '@/types/genetics/Chromosome';

describe('GlobalCrossoverStrategy', () => {
  const mutationStrategy = new RandomMutationStrategy(0, 10); // 0% mutation for testing

  test('should perform crossover with 100% probability', () => {
    const strategy = new GlobalCrossoverStrategy(1.0, mutationStrategy);
    const parent1: Chromosome = [1, 2, 3, 4, 5];
    const parent2: Chromosome = [6, 7, 8, 9, 10];

    const [child1, child2, crossoverPoint] = strategy.crossover(parent1, parent2);

    expect(child1).toHaveLength(5);
    expect(child2).toHaveLength(5);
    expect(crossoverPoint).toBeGreaterThanOrEqual(0);
    expect(crossoverPoint).toBeLessThan(5);
  });

  test('should not crossover with 0% probability', () => {
    const strategy = new GlobalCrossoverStrategy(0, mutationStrategy);
    const parent1: Chromosome = [1, 2, 3, 4, 5];
    const parent2: Chromosome = [6, 7, 8, 9, 10];

    const [child1, child2, crossoverPoint] = strategy.crossover(parent1, parent2);

    expect(crossoverPoint).toBe(5); // No crossover, point is at end
    expect(child1).toEqual([1, 2, 3, 4, 5]); // All from parent1
    expect(child2).toEqual([6, 7, 8, 9, 10]); // All from parent2
  });

  test('should produce children of same length as parents', () => {
    const strategy = new GlobalCrossoverStrategy(0.8, mutationStrategy);
    const parent1: Chromosome = [1, 2, 3];
    const parent2: Chromosome = [4, 5, 6];

    const [child1, child2] = strategy.crossover(parent1, parent2);

    expect(child1).toHaveLength(3);
    expect(child2).toHaveLength(3);
  });

  test('should handle single-element chromosomes', () => {
    const strategy = new GlobalCrossoverStrategy(1.0, mutationStrategy);
    const parent1: Chromosome = [1];
    const parent2: Chromosome = [2];

    const [child1, child2, crossoverPoint] = strategy.crossover(parent1, parent2);

    expect(child1).toHaveLength(1);
    expect(child2).toHaveLength(1);
    expect(crossoverPoint).toBeGreaterThanOrEqual(0);
  });

  test('should apply mutation strategy to offspring', () => {
    const alwaysMutateStrategy = new RandomMutationStrategy(1.0, 100); // 100% mutation
    const strategy = new GlobalCrossoverStrategy(1.0, alwaysMutateStrategy);
    const parent1: Chromosome = [1, 1, 1, 1, 1];
    const parent2: Chromosome = [2, 2, 2, 2, 2];

    const [child1, child2] = strategy.crossover(parent1, parent2);

    // With 100% mutation, children should likely differ from parents
    const child1DiffersFromParents = child1.some(gene => gene !== 1 && gene !== 2);
    const child2DiffersFromParents = child2.some(gene => gene !== 1 && gene !== 2);

    expect(child1DiffersFromParents || child2DiffersFromParents).toBe(true);
  });

  test('should return valid crossover point within bounds', () => {
    const strategy = new GlobalCrossoverStrategy(1.0, mutationStrategy);
    const parent1: Chromosome = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const parent2: Chromosome = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

    const [, , crossoverPoint] = strategy.crossover(parent1, parent2);

    expect(crossoverPoint).toBeGreaterThanOrEqual(0);
    expect(crossoverPoint).toBeLessThanOrEqual(10);
  });
});
