import { bernoulli } from "@stdlib/random/base";

export function flip(probability: number): boolean {
  return bernoulli(probability) > 0;
}