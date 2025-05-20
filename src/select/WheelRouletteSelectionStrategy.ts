import { Individual } from "../types/genetics/Individual";
import { Population } from "../types/genetics/Population";
import { SelectionStrategy } from "./SelectStrategy";

export class WheelRouletteSelectionStrategy implements SelectionStrategy {
    population: Population
    fitnessSum: number

    constructor(population: Population) {
        this.population = population
        this.fitnessSum = population.reduce((total, current) => total + current.fitness, 0)
    }

    select(): Individual {
        let sum = 0
        let selectedPosition = -1;
        let wheelPoint = Math.random() * this.fitnessSum

        this.population.some((individual, index) => {
            sum = sum + individual.fitness
            selectedPosition = index
            return sum >= wheelPoint
        })

        return this.population.at(selectedPosition)
    }
}