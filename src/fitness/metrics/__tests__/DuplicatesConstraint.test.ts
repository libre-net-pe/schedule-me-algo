import { DuplicatesConstraint } from "../DuplicatesConstraint";
import { Chromosome } from "../../../types/genetics/Chromosome";

describe('DuplicatesConstraint', () => {
    let constraint: DuplicatesConstraint;

    beforeEach(() => {
        constraint = new DuplicatesConstraint();
    });

    describe('compute', () => {
        it('should return 0 for a chromosome with no duplicates', () => {
            const chromosome: Chromosome = [1, 2, 3, 4, 5];
            const duplicates = constraint.compute(chromosome);
            expect(duplicates).toBe(0);
        });

        it('should return correct count for a chromosome with one pair of duplicates', () => {
            const chromosome: Chromosome = [1, 2, 2, 3, 4];
            const duplicates = constraint.compute(chromosome);
            expect(duplicates).toBe(1); // One duplicate (2 appears twice)
        });

        it('should return correct count for a chromosome with multiple pairs of duplicates', () => {
            const chromosome: Chromosome = [1, 1, 2, 2, 3, 3];
            const duplicates = constraint.compute(chromosome);
            expect(duplicates).toBe(3); // Three pairs of duplicates
        });

        it('should return correct count for a chromosome with triplicates', () => {
            const chromosome: Chromosome = [1, 1, 1, 2, 3];
            const duplicates = constraint.compute(chromosome);
            expect(duplicates).toBe(2); // Two duplicates (1 appears three times)
        });

        it('should return correct count for a chromosome with mixed duplicates', () => {
            const chromosome: Chromosome = [1, 1, 1, 2, 2, 3, 3, 3];
            const duplicates = constraint.compute(chromosome);
            expect(duplicates).toBe(5); // Two duplicates from triple 1, one from pair 2, two from triple 3
        });

        it('should handle empty chromosome', () => {
            const chromosome: Chromosome = [];
            const duplicates = constraint.compute(chromosome);
            expect(duplicates).toBe(0);
        });

        it('should handle single element chromosome', () => {
            const chromosome: Chromosome = [1];
            const duplicates = constraint.compute(chromosome);
            expect(duplicates).toBe(0);
        });

        it('should handle chromosome with all same elements', () => {
            const chromosome: Chromosome = [1, 1, 1, 1, 1];
            const duplicates = constraint.compute(chromosome);
            expect(duplicates).toBe(4); // Four duplicates (1 appears five times)
        });

        it('should handle chromosome with negative numbers', () => {
            const chromosome: Chromosome = [-1, -1, 2, 2, -3];
            const duplicates = constraint.compute(chromosome);
            expect(duplicates).toBe(2); // Two pairs of duplicates
        });
    });
}); 