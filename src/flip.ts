import * as random from "@stdlib/random/base";

export function flip(probability: number): boolean {
  return random.bernoulli(probability) > 0;
}