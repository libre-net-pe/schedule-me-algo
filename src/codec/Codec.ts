import { Offering } from "../types/domain/Offering"
import { TimeSlot } from "../types/domain/TimeSlot"

/**
 * Represents a schedule assignment pairing a time slot with a course offering.
 * 
 * This type defines the fundamental unit of a school schedule - it specifies
 * that a particular course offering should be scheduled during a specific time slot.
 * 
 * @property slot - The time period when the course should be scheduled
 * @property offering - The course requirement that should be assigned to this time slot
 */
export type TimeSlotAssignment = {
    slot: TimeSlot
    offering: Offering
}

/**
 * Encoder/decoder for converting between genetic algorithm representations and schedule assignments.
 * 
 * The Codec class serves as a bridge between the genetic algorithm's numeric chromosome
 * representation and the actual schedule domain objects (TimeSlots and Offerings).
 * It handles the mapping between gene values (integers) and meaningful schedule assignments.
 * 
 * The encoding scheme works as follows:
 * - Each gene in a chromosome is an integer index
 * - The index maps to a unique (TimeSlot, Offering) combination
 * - The mapping is deterministic: same index always produces same assignment
 * - Total search space = number of time slots × number of offerings
 * 
 * Time slots are automatically sorted by day (Monday first) and then by start time
 * to ensure consistent ordering across genetic operations.
 */
export class Codec {
    slots: Array<TimeSlot>
    offerings: Array<Offering>

    /**
     * Creates a new Codec instance for encoding/decoding schedule assignments.
     * 
     * @param slots - Array of available time slots for scheduling. These will be
     *                automatically sorted by day (Monday first) and start time to
     *                ensure consistent gene-to-assignment mapping
     * @param offerings - Array of course offerings that need to be scheduled.
     *                    Each offering represents a specific course requirement
     */
    constructor(slots: Array<TimeSlot>, offerings: Array<Offering>) {
        // Sort slots by day (MONDAY first) and then by start time
        this.slots = [...slots].sort((a, b) => {
            // First compare by day
            if (a.day !== b.day) {
                return a.day - b.day;
            }
            // If same day, compare by start time
            return a.start.localeCompare(b.start);
        });
        
        this.offerings = [...offerings];
    }

    /**
     * Decodes a genetic algorithm gene value into a schedule assignment.
     * 
     * This method converts an integer gene value from a chromosome into a meaningful
     * schedule assignment by mapping it to a specific (TimeSlot, Offering) pair.
     * 
     * The decoding algorithm:
     * 1. Validates the index is within valid range [0, totalCombinations)
     * 2. Calculates slot index = floor(index / number of offerings)
     * 3. Calculates offering index = index % number of offerings
     * 4. Returns the corresponding TimeSlot and Offering pair
     * 
     * @param index - Integer gene value from chromosome (0 to totalCombinations-1)
     * @returns TimeSlotAssignment containing the decoded slot-offering pair,
     *          or undefined if the index is invalid (negative or out of bounds)
     */
    decode(index: number): TimeSlotAssignment | undefined {
        if (index < 0) return undefined;

        const totalCombinations = this.getTotalCombinations();
        if (index >= totalCombinations) return undefined;

        const slotIndex = Math.floor(index / this.offerings.length);
        const offeringIndex = index % this.offerings.length;

        return {
            slot: this.slots[slotIndex],
            offering: this.offerings[offeringIndex]
        };
    }

    /**
     * Calculates the total number of possible schedule assignment combinations.
     * 
     * This method determines the size of the genetic algorithm's search space
     * by multiplying the number of available time slots by the number of course offerings.
     * This value is used to:
     * - Validate gene indices during decoding
     * - Configure mutation strategies with valid gene ranges
     * - Define the bounds of the solution space
     * 
     * @returns The total number of possible (TimeSlot, Offering) combinations
     */
    getTotalCombinations(): number {
        return this.slots.length * this.offerings.length;
    }
}