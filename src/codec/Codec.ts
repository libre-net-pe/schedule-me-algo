import { Offering } from "../types/domain/Offering"
import { TimeSlot } from "../types/domain/TimeSlot"

export type TimeSlotAssignment = {
    slot: TimeSlot
    offering: Offering
}

export class Codec {
    slots: Array<TimeSlot>
    offerings: Array<Offering>

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

    getTotalCombinations(): number {
        return this.slots.length * this.offerings.length;
    }
}