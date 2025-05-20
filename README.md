# Schedule Me Generator

A genetic algorithm-based scheduling system for optimizing teacher availability in Peruvian public schools.

## Overview

This project implements a genetic algorithm to solve the complex problem of scheduling teachers across different grades and courses while respecting various constraints. The system takes into account teacher availability, course requirements, and grade-specific needs to generate optimal schedules.

## Features

- Genetic algorithm-based optimization
- Support for multiple constraints:
  - Teacher availability
  - Course hour requirements
  - Grade-specific scheduling
  - Duplicate class prevention
- Flexible time slot management
- Fitness-based schedule evaluation

## Inputs

- Teacher data (availability and qualifications)
- Available courses
- Available grades
- Required course hours per grade
- Time table to fill in

## Technical Details

The system uses several genetic algorithm components:

- **Selection**: Wheel Roulette Selection Strategy
- **Crossover**: Global Crossover Strategy
- **Mutation**: Random Mutation Strategy
- **Fitness**: Rule-based evaluation considering:
  - Duplicate class constraints
  - Course requirement constraints
  - Teacher availability

## Project Structure

```
src/
├── codec/           # Encoding/decoding of schedules
├── crossover/       # Crossover strategies
├── fitness/         # Fitness evaluation
├── generation/      # Population generation
├── mutation/        # Mutation strategies
├── select/          # Selection strategies
└── types/          # Domain types and interfaces
```

## Getting Started

[Installation and usage instructions to be added]

## License

[License information to be added]