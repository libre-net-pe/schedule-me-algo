import { Allele } from "../types/genetics/Allele";

export interface MutationStrategy {
    mutate(allele: Allele) : Allele
}