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

## Installation

### Prerequisites
- Node.js 18+ or higher
- npm 9+ or higher

### Install from npm

```bash
npm install @libre-net-pe/schedule-me-gen
```

### Install from source

1. Clone the repository:
```bash
git clone https://github.com/libre-net-pe/schedule-me-algo.git
cd schedule-me-algo
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Run tests:
```bash
npm test
```

### Development Setup

For development with hot reloading:

```bash
# Run tests in watch mode
npm test -- --watch

# Build and watch for changes
npm run build -- --watch
```

## Usage

### Basic Example

```typescript
import { Executor, Codec, TimeSlot, Offering, Day } from '@libre-net-pe/schedule-me-gen';

// Define your time slots
const timeSlots: TimeSlot[] = [
  { day: Day.Monday, startTime: '08:00', endTime: '08:45', durationInMinutes: 45 },
  { day: Day.Monday, startTime: '08:45', endTime: '09:30', durationInMinutes: 45 },
  // ... add more time slots
];

// Define your course offerings
const offerings: Offering[] = [
  {
    teacher: { id: 1, name: 'Maria Garcia' },
    subject: { id: 1, name: 'Mathematics' },
    gradeLevel: { id: 1, level: 1, section: 'A' },
    requiredHours: 5
  },
  // ... add more offerings
];

// Create codec
const codec = new Codec(timeSlots, offerings);

// Run the genetic algorithm
const executor = new Executor(codec);
const result = executor.execute(
  100,  // population size
  50    // number of generations
);

// Access the best schedule found
console.log('Best fitness:', result.best.fitness);
console.log('Schedule:', codec.decode(result.best.chromosome));
```

### Configuration Options

- **Population Size**: Number of candidate solutions per generation (recommended: 50-200)
- **Generations**: Number of evolutionary cycles (recommended: 50-500)
- **Mutation Rate**: 30% (configured in GenerationStrategy)
- **Crossover Rate**: 80% (configured in GlobalCrossoverStrategy)

### Advanced: Custom Constraints

You can add custom constraints by implementing the `PopulationConstraint` interface:

```typescript
import { PopulationConstraint, Chromosome } from '@libre-net-pe/schedule-me-gen';

class MyCustomConstraint implements PopulationConstraint {
  compute(chromosome: Chromosome): number {
    // Return penalty score (0 = no violations)
    return 0;
  }
}
```

## API Documentation

Generate and view full API documentation:

```bash
npm run docs:build
npm run docs:serve
```

Then open http://localhost:8080 in your browser.

## License

MIT License - see LICENSE file for details

Copyright (c) 2024 Libre Net PE

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Authors

- **jaxkodex** - Initial work

## Acknowledgments

- Built for Peruvian public schools to optimize teacher scheduling
- Uses genetic algorithms for constraint-based optimization
- Powered by [@stdlib/random](https://github.com/stdlib-js/random) for quality random number generation