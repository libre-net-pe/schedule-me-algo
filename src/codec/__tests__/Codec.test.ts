import { Codec } from '../Codec';
import { TimeSlot } from '@/types/domain/TimeSlot';
import { Offering } from '@/types/domain/Offering';
import { Day } from '@/types/domain/Day';

describe('Codec', () => {
    const GRADE_10_A = 'GRADE-10-A-MATH-John-Doe'
    // Helper function to create test data
    const createTestData = () => {
        const slots: TimeSlot[] = [
            { day: Day.TUESDAY, start: '08:00', end: '09:00' },
            { day: Day.MONDAY, start: '09:00', end: '10:00' },
            { day: Day.MONDAY, start: '08:00', end: '09:00' },
        ];

        const offerings: Offering[] = [
            { key: GRADE_10_A, requiredHours: 2 },
            { key: GRADE_10_A, requiredHours: 2 },
        ];

        return { slots, offerings };
    };

    describe('constructor', () => {
        it('should sort slots by day and start time', () => {
            const { slots, offerings } = createTestData();
            const codec = new Codec(slots, offerings);

            // Verify slots are sorted by day (MONDAY first) and then by start time
            expect(codec.slots[0].day).toBe(Day.MONDAY);
            expect(codec.slots[0].start).toBe('08:00');
            expect(codec.slots[1].day).toBe(Day.MONDAY);
            expect(codec.slots[1].start).toBe('09:00');
            expect(codec.slots[2].day).toBe(Day.TUESDAY);
        });

        it('should store offerings as an array', () => {
            const { slots, offerings } = createTestData();
            const codec = new Codec(slots, offerings);

            // Verify offerings are stored as an array
            expect(codec.offerings).toEqual(offerings);
            expect(codec.offerings.length).toBe(2);
        });
    });

    describe('decode', () => {
        it('should return undefined for negative index', () => {
            const { slots, offerings } = createTestData();
            const codec = new Codec(slots, offerings);
            expect(codec.decode(-1)).toBeUndefined();
        });

        it('should return undefined for index beyond total combinations', () => {
            const { slots, offerings } = createTestData();
            const codec = new Codec(slots, offerings);
            const totalCombinations = codec.getTotalCombinations();
            expect(codec.decode(totalCombinations)).toBeUndefined();
        });

        it('should correctly decode valid indices', () => {
            const { slots, offerings } = createTestData();
            const codec = new Codec(slots, offerings);

            // Test first combination
            const first = codec.decode(0);
            expect(first).toBeDefined();
            expect(first?.slot).toBe(slots[2]); // First sorted slot
            expect(first?.offering).toBe(offerings[0]);

            // Test middle combination
            const middle = codec.decode(3);
            expect(middle).toBeDefined();
            expect(middle?.slot).toBe(slots[1]);
            expect(middle?.offering).toBe(offerings[1]);

            // Test last combination
            const last = codec.decode(5);
            expect(last).toBeDefined();
            expect(last?.slot).toBe(slots[0]);
            expect(last?.offering).toBe(offerings[1]);
        });
    });

    describe('getTotalCombinations', () => {
        it('should return correct total number of combinations', () => {
            const { slots, offerings } = createTestData();
            const codec = new Codec(slots, offerings);

            // Total combinations = slots.length * offerings.length
            const expectedTotal = slots.length * offerings.length;
            expect(codec.getTotalCombinations()).toBe(expectedTotal);
        });

        it('should handle empty slots or offerings', () => {
            const emptySlots: TimeSlot[] = [];
            const { offerings } = createTestData();
            const codec = new Codec(emptySlots, offerings);
            expect(codec.getTotalCombinations()).toBe(0);

            const { slots } = createTestData();
            const emptyOfferings: Offering[] = [];
            const codec2 = new Codec(slots, emptyOfferings);
            expect(codec2.getTotalCombinations()).toBe(0);
        });
    });
}); 