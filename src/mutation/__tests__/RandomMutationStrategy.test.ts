import { RandomMutationStrategy } from '../RandomMutationStrategy';

describe('RandomMutationStrategy', () => {
  test('should not mutate with 0% probability', () => {
    const strategy = new RandomMutationStrategy(0, 100);
    const allele = 5;

    const mutated = strategy.mutate(allele);

    expect(mutated).toBe(5);
  });

  test('should always mutate with 100% probability', () => {
    const strategy = new RandomMutationStrategy(1.0, 10);
    const allele = 5;

    // Test multiple times to ensure consistency
    let mutationOccurred = false;
    for (let i = 0; i < 100; i++) {
      const mutated = strategy.mutate(allele);
      if (mutated !== allele) {
        mutationOccurred = true;
        break;
      }
    }

    expect(mutationOccurred).toBe(true);
  });

  test('should return value within allowed range when mutating', () => {
    const strategy = new RandomMutationStrategy(1.0, 10);
    const allele = 5;

    for (let i = 0; i < 100; i++) {
      const mutated = strategy.mutate(allele);
      expect(mutated).toBeGreaterThanOrEqual(0);
      expect(mutated).toBeLessThanOrEqual(10);
    }
  });

  test('should respect maxAllowedValue constraint', () => {
    const maxValue = 5;
    const strategy = new RandomMutationStrategy(1.0, maxValue);

    for (let i = 0; i < 50; i++) {
      const mutated = strategy.mutate(0);
      expect(mutated).toBeLessThanOrEqual(maxValue);
    }
  });

  test('should handle maxAllowedValue of 0', () => {
    const strategy = new RandomMutationStrategy(1.0, 0);
    const allele = 5;

    const mutated = strategy.mutate(allele);

    expect(mutated).toBe(0);
  });

  test('should mutate approximately according to probability', () => {
    const probability = 0.5;
    const strategy = new RandomMutationStrategy(probability, 100);
    const allele = 50;
    const iterations = 1000;

    let mutationCount = 0;
    for (let i = 0; i < iterations; i++) {
      if (strategy.mutate(allele) !== allele) {
        mutationCount++;
      }
    }

    const actualProbability = mutationCount / iterations;
    // Should be roughly 50% ± 10% (allowing for randomness)
    expect(actualProbability).toBeGreaterThan(0.4);
    expect(actualProbability).toBeLessThan(0.6);
  });
});
