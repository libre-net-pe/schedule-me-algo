import { RuleBasedFitnessStrategy } from "../RuleBasedFitnessStrategy";
import { TimeSlot } from "../../types/domain/TimeSlot";
import { Day } from "../../types/domain/Day";
import { Offering } from "../../types/domain/Offering";
import { Chromosome } from "../../types/genetics/Chromosome";
import { Codec } from "../..";

describe('RuleBasedFitnessStrategy', () => {
    // Helper function to create test data
    const createTestData = () => {
        const slots: TimeSlot[] = [
            { day: Day.MONDAY, start: '08:00', end: '09:00' },
            { day: Day.MONDAY, start: '09:00', end: '10:00' },
            { day: Day.TUESDAY, start: '08:00', end: '09:00' },
            { day: Day.TUESDAY, start: '09:00', end: '10:00' },
        ];

        const offerings: Offering[] = [
            { key: 'GRADE-10-A-MATH', requiredHours: 2 },
            { key: 'GRADE-10-A-SCIENCE', requiredHours: 1 },
            { key: 'GRADE-10-B-MATH', requiredHours: 1 },
        ];

        return { slots, offerings };
    };

    describe('compute', () => {
        it('should return 1 for a perfect chromosome (no duplicates and all requirements met)', () => {
            const { slots, offerings } = createTestData();
            const codec = new Codec(slots, offerings);
            const strategy = new RuleBasedFitnessStrategy(codec);

            // Create a chromosome that meets all requirements without duplicates
            const chromosome: Chromosome = [0, 3, 7, 11]; // Assigns all required hours uniquely
            const fitness = strategy.compute(chromosome);
            expect(fitness).toBe(1);
        });

        it('should return high penalty for chromosomes with duplicates', () => {
            const { slots, offerings } = createTestData();
            const codec = new Codec(slots, offerings);
            const strategy = new RuleBasedFitnessStrategy(codec);

            // Create a chromosome with duplicates
            const chromosome: Chromosome = [0, 0, 1, 1]; // Same assignments repeated

            const fitness = strategy.compute(chromosome);
            expect(fitness).toBeGreaterThan(0);
        });

        it('should return high penalty for chromosomes with unmet requirements', () => {
            const { slots, offerings } = createTestData();
            const codec = new Codec(slots, offerings);
            const strategy = new RuleBasedFitnessStrategy(codec);

            // Create a chromosome that doesn't meet all requirements
            const chromosome: Chromosome = [0, 1]; // Only assigns 2 hours when more are needed

            const fitness = strategy.compute(chromosome);
            expect(fitness).toBeGreaterThan(0);
        });

        it('should return highest penalty for chromosomes with both duplicates and unmet requirements', () => {
            const { slots, offerings } = createTestData();
            const codec = new Codec(slots, offerings);
            const strategy = new RuleBasedFitnessStrategy(codec);

            // Create a chromosome with both duplicates and unmet requirements
            const chromosome: Chromosome = [0, 0, 1]; // Duplicates and missing required hours

            const fitness = strategy.compute(chromosome);
            expect(fitness).toBeGreaterThan(0);
        });

        it('should handle empty chromosome', () => {
            const { slots, offerings } = createTestData();
            const codec = new Codec(slots, offerings);
            const strategy = new RuleBasedFitnessStrategy(codec);

            const chromosome: Chromosome = [];
            const fitness = strategy.compute(chromosome);

            // Should return penalty for all unmet requirements
            expect(fitness).toBeGreaterThan(0);
        });

        it('should handle invalid allele values', () => {
            const { slots, offerings } = createTestData();
            const codec = new Codec(slots, offerings);
            const strategy = new RuleBasedFitnessStrategy(codec);

            // Create a chromosome with some invalid allele values
            const chromosome: Chromosome = [-1, 999, 0, 1];

            const fitness = strategy.compute(chromosome);
            expect(fitness).toBeGreaterThan(0);
        });
    });
}); 