import { RequirementsConstraint } from "../RequirementsConstraint";
import { TimeSlot } from "../../../types/domain/TimeSlot";
import { Day } from "../../../types/domain/Day";
import { Offering } from "../../../types/domain/Offering";
import { Chromosome } from "../../../types/genetics/Chromosome";
import { Codec } from "../../..";

describe('RequirementsConstraint', () => {
    // Helper function to create test data
    const createTestData = () => {
        const slots: TimeSlot[] = [
            { day: Day.MONDAY, start: '08:00', end: '09:00' },
            { day: Day.MONDAY, start: '09:00', end: '10:00' },
            { day: Day.TUESDAY, start: '08:00', end: '09:00' },
            { day: Day.TUESDAY, start: '09:00', end: '10:00' },
        ];

        const offerings: Offering[] = [
            { key: 'GRADE-10-A-Math-John-Doe', requiredHours: 2 },
            { key: 'GRADE-10-A-Cience-John-Doe', requiredHours: 1 },
            { key: 'GRADE-10-B-Math-John-Doe', requiredHours: 1 },
        ];

        return { slots, offerings };
    };

    describe('compute', () => {
        it('should return 0 when all requirements are met', () => {
            const { slots, offerings } = createTestData();
            const codec = new Codec(slots, offerings);
            const constraint = new RequirementsConstraint(codec);

            // Create a chromosome that meets all requirements
            const chromosome: Chromosome = [0, 3, 7, 11]; // Assigns all required hours
            const unmetRequirements = constraint.compute(chromosome);
            expect(unmetRequirements).toBe(0);
        });

        it('should count unmet requirements correctly', () => {
            const { slots, offerings } = createTestData();
            const codec = new Codec(slots, offerings);
            const constraint = new RequirementsConstraint(codec);

            // Create a chromosome that only partially meets requirements
            const chromosome: Chromosome = [0, 1]; // Only assigns 2 hours when more are needed

            const unmetRequirements = constraint.compute(chromosome);
            expect(unmetRequirements).toBeGreaterThan(0);
        });

        it('should handle empty chromosome', () => {
            const { slots, offerings } = createTestData();
            const codec = new Codec(slots, offerings);
            const constraint = new RequirementsConstraint(codec);

            const chromosome: Chromosome = [];
            const unmetRequirements = constraint.compute(chromosome);

            // Should return sum of all required hours since nothing is assigned
            const totalRequiredHours = offerings.reduce((sum, offer) => sum + offer.requiredHours, 0);
            expect(unmetRequirements).toBe(totalRequiredHours);
        });

        it('should handle invalid allele values', () => {
            const { slots, offerings } = createTestData();
            const codec = new Codec(slots, offerings);
            const constraint = new RequirementsConstraint(codec);

            // Create a chromosome with some invalid allele values
            const chromosome: Chromosome = [-1, 999, 0, 1];

            const unmetRequirements = constraint.compute(chromosome);
            expect(unmetRequirements).toBeGreaterThan(0);
        });
    });
}); 