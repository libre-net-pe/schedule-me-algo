import { Individual } from "../types/genetics/Individual";

export interface SelectionStrategy {

    select(): Individual
}