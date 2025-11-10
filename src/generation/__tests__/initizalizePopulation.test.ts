import { initizalizePopulation } from '../initizalizePopulation';
import { Codec } from '@/codec/Codec';
import { TimeSlot } from '@/types/domain/TimeSlot';
import { Day } from '@/types/domain/Day';
import { Offering } from '@/types/domain/Offering';

describe('initizalizePopulation', () => {
  const createTestCodec = () => {
    const timeSlots: TimeSlot[] = [
      { day: Day.Monday, startTime: '08:00', endTime: '08:45', durationInMinutes: 45 },
      { day: Day.Monday, startTime: '08:45', endTime: '09:30', durationInMinutes: 45 }
    ];

    const offerings: Offering[] = [
      {
        teacher: { id: 1, name: 'Teacher A' },
        subject: { id: 1, name: 'Math' },
        gradeLevel: { id: 1, level: 1, section: 'A' },
        requiredHours: 2
      }
    ];

    return new Codec(timeSlots, offerings);
  };

  test('should create population of specified size', () => {
    const codec = createTestCodec();
    const populationSize = 10;

    const population = initizalizePopulation(codec, populationSize);

    expect(population).toHaveLength(populationSize);
  });

  test('should create individuals with correct chromosome length', () => {
    const codec = createTestCodec();
    const populationSize = 5;

    const population = initizalizePopulation(codec, populationSize);

    // Total required hours is 2
    population.forEach(individual => {
      expect(individual.chromosome).toHaveLength(2);
    });
  });

  test('should initialize individuals with fitness scores', () => {
    const codec = createTestCodec();
    const populationSize = 5;

    const population = initizalizePopulation(codec, populationSize);

    population.forEach(individual => {
      expect(typeof individual.fitness).toBe('number');
      expect(individual.fitness).toBeGreaterThanOrEqual(0);
    });
  });

  test('should initialize individuals with null parents', () => {
    const codec = createTestCodec();
    const populationSize = 5;

    const population = initizalizePopulation(codec, populationSize);

    population.forEach(individual => {
      expect(individual.parent1).toBeNull();
      expect(individual.parent2).toBeNull();
    });
  });

  test('should initialize individuals with crossoverPoint -1', () => {
    const codec = createTestCodec();
    const populationSize = 5;

    const population = initizalizePopulation(codec, populationSize);

    population.forEach(individual => {
      expect(individual.crossoverPoint).toBe(-1);
    });
  });

  test('should create chromosomes with alleles within valid range', () => {
    const codec = createTestCodec();
    const populationSize = 10;
    const totalCombinations = codec.getTotalCombinations();

    const population = initizalizePopulation(codec, populationSize);

    population.forEach(individual => {
      individual.chromosome.forEach(allele => {
        expect(allele).toBeGreaterThanOrEqual(0);
        expect(allele).toBeLessThan(totalCombinations);
      });
    });
  });

  test('should handle population size of 1', () => {
    const codec = createTestCodec();

    const population = initizalizePopulation(codec, 1);

    expect(population).toHaveLength(1);
    expect(population[0].chromosome).toBeDefined();
  });

  test('should create diverse initial population', () => {
    const codec = createTestCodec();
    const populationSize = 10;

    const population = initizalizePopulation(codec, populationSize);

    // Check that not all individuals are identical
    const firstChromosome = JSON.stringify(population[0].chromosome);
    const allIdentical = population.every(ind =>
      JSON.stringify(ind.chromosome) === firstChromosome
    );

    expect(allIdentical).toBe(false);
  });
});
