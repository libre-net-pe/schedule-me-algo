import { WheelRouletteSelectionStrategy } from '../WheelRouletteSelectionStrategy';
import { Population } from '@/types/genetics/Population';

describe('WheelRouletteSelectionStrategy', () => {
  test('should select an individual from population', () => {
    const population: Population = [
      { chromosome: [1, 2, 3], fitness: 10, parent1: null, parent2: null, crossoverPoint: -1 },
      { chromosome: [4, 5, 6], fitness: 20, parent1: null, parent2: null, crossoverPoint: -1 },
      { chromosome: [7, 8, 9], fitness: 30, parent1: null, parent2: null, crossoverPoint: -1 }
    ];

    const strategy = new WheelRouletteSelectionStrategy(population);
    const selected = strategy.select();

    expect(selected).toBeDefined();
    expect(population).toContain(selected);
  });

  test('should calculate fitness sum correctly', () => {
    const population: Population = [
      { chromosome: [1], fitness: 10, parent1: null, parent2: null, crossoverPoint: -1 },
      { chromosome: [2], fitness: 20, parent1: null, parent2: null, crossoverPoint: -1 },
      { chromosome: [3], fitness: 30, parent1: null, parent2: null, crossoverPoint: -1 }
    ];

    const strategy = new WheelRouletteSelectionStrategy(population);

    expect(strategy.fitnessSum).toBe(60);
  });

  test('should favor individuals with higher fitness', () => {
    const population: Population = [
      { chromosome: [1], fitness: 1, parent1: null, parent2: null, crossoverPoint: -1 },
      { chromosome: [2], fitness: 99, parent1: null, parent2: null, crossoverPoint: -1 }
    ];

    const strategy = new WheelRouletteSelectionStrategy(population);
    const selections = Array.from({ length: 100 }, () => strategy.select());
    const highFitnessCount = selections.filter(ind => ind.fitness === 99).length;

    // High fitness individual should be selected more often (statistically)
    expect(highFitnessCount).toBeGreaterThan(80);
  });

  test('should handle single individual population', () => {
    const population: Population = [
      { chromosome: [1, 2, 3], fitness: 10, parent1: null, parent2: null, crossoverPoint: -1 }
    ];

    const strategy = new WheelRouletteSelectionStrategy(population);
    const selected = strategy.select();

    expect(selected).toBe(population[0]);
  });

  test('should handle population with zero fitness', () => {
    const population: Population = [
      { chromosome: [1], fitness: 0, parent1: null, parent2: null, crossoverPoint: -1 },
      { chromosome: [2], fitness: 0, parent1: null, parent2: null, crossoverPoint: -1 }
    ];

    const strategy = new WheelRouletteSelectionStrategy(population);
    const selected = strategy.select();

    expect(selected).toBeDefined();
    expect(population).toContain(selected);
  });
});
