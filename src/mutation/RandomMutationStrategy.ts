import { flip } from "../flip";
import { rand } from "../rand";
import { Allele } from "../types/genetics/Allele";
import { MutationStrategy } from "./MutationStrategy";

export class RandomMutationStrategy implements MutationStrategy {
    mutationProbability: number
    maxAllowedValue: number

    constructor(mutationProbability: number, maxAllowedValue: number) {
        this.mutationProbability = mutationProbability
        this.maxAllowedValue = maxAllowedValue
    }

    mutate(allele: Allele): Allele {
        let shouldMutate = flip(this.mutationProbability)
        let mutation = allele
        if (shouldMutate) {
            mutation = rand(0, this.maxAllowedValue)
        }
        return mutation
    }
}