import { Population } from "../types/genetics/Population";
import { rand } from "../rand";
import { RuleBasedFitnessStrategy } from "../fitness/RuleBasedFitnessStrategy";
import { Offering } from "../types/domain/Offering";
import { Codec } from "../codec/Codec";

function sumRequiredHours(offerings: Array<Offering>) {
  return offerings.reduce((total, offering) => total + offering.requiredHours, 0);
}

export function initizalizePopulation(codec: Codec, populationSize: number): Population {
  let population: Population = []
  const fitnessStrategy = new RuleBasedFitnessStrategy(codec)
  const totalCombinations = codec.getTotalCombinations()

  // Create individuals for the population
  for (let i = 0; i < populationSize; i++) {
    // Create a chromosome with random alleles
    const chromosome = Array.from({ length: sumRequiredHours(codec.offerings) }, () =>
      rand(0, totalCombinations - 1)
    )

    // Create individual with initial fitness
    population.push({
      chromosome,
      fitness: fitnessStrategy.compute(chromosome),
      parent1: null,
      parent2: null,
      crossoverPoint: -1
    })
  }

  return population
}