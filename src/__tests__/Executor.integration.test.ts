import { Executor } from '../Executor';
import { TimeSlot } from '../types/domain/TimeSlot';
import { Day } from '../types/domain/Day';
import { Offering } from '../types/domain/Offering';
import * as fs from 'fs';
import * as path from 'path';
import { Codec } from '..';

describe('Executor Integration', () => {
    // Helper function to create test data
    const createTestData = () => {
        // Create time slots for a week (Monday to Friday)
        const slots: TimeSlot[] = [
            // Monday
            { day: Day.MONDAY, start: '08:00', end: '09:00' },
            { day: Day.MONDAY, start: '09:00', end: '10:00' },
            { day: Day.MONDAY, start: '10:00', end: '11:00' },
            { day: Day.MONDAY, start: '11:00', end: '12:00' },
            // Tuesday
            { day: Day.TUESDAY, start: '08:00', end: '09:00' },
            { day: Day.TUESDAY, start: '09:00', end: '10:00' },
            { day: Day.TUESDAY, start: '10:00', end: '11:00' },
            { day: Day.TUESDAY, start: '11:00', end: '12:00' },
            // Wednesday
            { day: Day.WEDNESDAY, start: '08:00', end: '09:00' },
            { day: Day.WEDNESDAY, start: '09:00', end: '10:00' },
            { day: Day.WEDNESDAY, start: '10:00', end: '11:00' },
            { day: Day.WEDNESDAY, start: '11:00', end: '12:00' },
            // Thursday
            { day: Day.THURSDAY, start: '08:00', end: '09:00' },
            { day: Day.THURSDAY, start: '09:00', end: '10:00' },
            { day: Day.THURSDAY, start: '10:00', end: '11:00' },
            { day: Day.THURSDAY, start: '11:00', end: '12:00' },
            // Friday
            { day: Day.FRIDAY, start: '08:00', end: '09:00' },
            { day: Day.FRIDAY, start: '09:00', end: '10:00' },
            { day: Day.FRIDAY, start: '10:00', end: '11:00' },
            { day: Day.FRIDAY, start: '11:00', end: '12:00' },
        ];

        // Create course offerings for two grade sections
        const offerings: Offering[] = [
            // Grade 10-A
            { key: 'GRADE-10-A-MATH', requiredHours: 4 },      // 4 hours per week
            { key: 'GRADE-10-A-SCIENCE', requiredHours: 3 },   // 3 hours per week
            { key: 'GRADE-10-A-ENGLISH', requiredHours: 3 },   // 3 hours per week
            { key: 'GRADE-10-A-HISTORY', requiredHours: 2 },   // 2 hours per week
            // Grade 10-B
            { key: 'GRADE-10-B-MATH', requiredHours: 4 },      // 4 hours per week
            { key: 'GRADE-10-B-SCIENCE', requiredHours: 3 },   // 3 hours per week
            { key: 'GRADE-10-B-ENGLISH', requiredHours: 3 },   // 3 hours per week
            { key: 'GRADE-10-B-HISTORY', requiredHours: 2 },   // 2 hours per week
        ];

        return { slots, offerings };
    };

    describe('timetable generation', () => {
        it('should generate a valid timetable that meets all requirements', () => {
            const { slots, offerings } = createTestData();
            const populationSize = 1000;
            const maxGenerations = 1000;
            const executor = new Executor(slots, offerings, populationSize, maxGenerations);
            const bestIndividual = executor.run();

            expect(bestIndividual).toBeDefined();
            expect(bestIndividual.chromosome).toBeDefined();

            const codec = new Codec(slots, offerings);
            
            // Convert timetable to CSV format
            const csvRows = [
                ['Day No', 'Day', 'Start Time', 'End Time', 'Grade Section', 'Required Hours'].join(','),
                ...bestIndividual.chromosome
                    .map(c => codec.decode(c))
                    .filter(v => typeof v != 'undefined')
                    .map(v => [
                        v.slot.day,
                        Day[v.slot.day],
                        v.slot.start,
                        v.slot.end,
                        v.offering.key,
                        v.offering.requiredHours
                    ].join(','))
            ];

            // Save to CSV file
            const outputDir = path.join(__dirname, '../../output');
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            fs.writeFileSync(
                path.join(outputDir, 'timetable.csv'),
                csvRows.join('\n')
            );

            // Since higher fitness is better, we expect a high fitness score
            expect(bestIndividual.fitness).toBeGreaterThan(0.5); // Should have a good fitness score

            // Verify the timetable using the Codec
            const assignments = new Map<string, Set<string>>(); // Track assignments per time slot

            // Verify all required hours are met
            const hoursPerOffering = new Map<string, number>();
            bestIndividual.chromosome.forEach(allele => {
                const assignment = codec.decode(allele);
                if (assignment) {
                    const key = assignment.offering.key;
                    hoursPerOffering.set(key, (hoursPerOffering.get(key) || 0) + 1);
                }
            });

            // Check if all required hours are met
            offerings.forEach(offering => {
                const assignedHours = hoursPerOffering.get(offering.key) || 0;
                expect(assignedHours).toBe(offering.requiredHours);
            });
        });

        it('should handle empty input data', () => {
            const populationSize = 100;
            const maxGenerations = 50;
            const executor = new Executor([], [], populationSize, maxGenerations);
            const bestIndividual = executor.run();
            expect(bestIndividual).toBeDefined();
            expect(bestIndividual.chromosome).toBeDefined();
        });

        it('should handle single time slot and offering', () => {
            const slots: TimeSlot[] = [
                { day: Day.MONDAY, start: '08:00', end: '09:00' }
            ];
            const offerings: Offering[] = [
                { key: 'GRADE-10-A-MATH', requiredHours: 1 }
            ];

            const populationSize = 100;
            const maxGenerations = 50;
            const executor = new Executor(slots, offerings, populationSize, maxGenerations);
            const bestIndividual = executor.run();

            expect(bestIndividual).toBeDefined();
            expect(bestIndividual.chromosome).toBeDefined();

            // For a single slot and offering, we expect perfect fitness (1)
            expect(bestIndividual.fitness).toBe(1);
        });
    });
}); 