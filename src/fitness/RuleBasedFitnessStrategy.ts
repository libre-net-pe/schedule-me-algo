import { Codec } from "../codec/Codec";
import { Chromosome } from "../types/genetics/Chromosome";
import { FitnessStrategy } from "./FitnessStrategy";
import { DuplicatesContraint } from "./metrics/DuplicatesConstraint";
import { RequirementsConstraint } from "./metrics/RequirementsConstraint";

export class RuleBasedFitnessStrategy implements FitnessStrategy {
    codec: Codec
    requirementContraint: RequirementsConstraint
    duplicatesConstraint: DuplicatesContraint

    constructor(codec: Codec) {
        this.codec = codec
        this.requirementContraint = new RequirementsConstraint(codec)
        this.duplicatesConstraint = new DuplicatesContraint()
    }

    compute(chromosome: Chromosome): number {
        const duplicates = this.duplicatesConstraint.compute(chromosome)

        // Calculate unmet requirements
        const unmetRequirements = this.requirementContraint.compute(chromosome);

        let hardPenalty = 1000*(Math.pow(duplicates, 2) + Math.pow(unmetRequirements, 2))
        let softPenalty = (0*50) + (0*20)

        return 1/(1 + hardPenalty + softPenalty)
    }
}