import { flip } from '../flip';
import { rand } from '../rand';

describe('flip utility', () => {
  test('should always return false with 0 probability', () => {
    for (let i = 0; i < 100; i++) {
      expect(flip(0)).toBe(false);
    }
  });

  test('should always return true with 1.0 probability', () => {
    for (let i = 0; i < 100; i++) {
      expect(flip(1.0)).toBe(true);
    }
  });

  test('should return boolean value', () => {
    const result = flip(0.5);
    expect(typeof result).toBe('boolean');
  });

  test('should return approximately 50% true for 0.5 probability', () => {
    const iterations = 1000;
    let trueCount = 0;

    for (let i = 0; i < iterations; i++) {
      if (flip(0.5)) trueCount++;
    }

    const ratio = trueCount / iterations;
    // Should be roughly 50% ± 10%
    expect(ratio).toBeGreaterThan(0.4);
    expect(ratio).toBeLessThan(0.6);
  });
});

describe('rand utility', () => {
  test('should return value within specified range', () => {
    for (let i = 0; i < 100; i++) {
      const result = rand(0, 10);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(10);
    }
  });

  test('should return integer values', () => {
    for (let i = 0; i < 100; i++) {
      const result = rand(0, 100);
      expect(Number.isInteger(result)).toBe(true);
    }
  });

  test('should handle single value range', () => {
    const result = rand(5, 5);
    expect(result).toBe(5);
  });

  test('should handle negative ranges', () => {
    for (let i = 0; i < 100; i++) {
      const result = rand(-10, -5);
      expect(result).toBeGreaterThanOrEqual(-10);
      expect(result).toBeLessThanOrEqual(-5);
    }
  });

  test('should include both min and max in possible values', () => {
    const iterations = 1000;
    let minFound = false;
    let maxFound = false;

    for (let i = 0; i < iterations; i++) {
      const result = rand(0, 1);
      if (result === 0) minFound = true;
      if (result === 1) maxFound = true;
      if (minFound && maxFound) break;
    }

    expect(minFound).toBe(true);
    expect(maxFound).toBe(true);
  });

  test('should generate diverse values', () => {
    const values = new Set();
    for (let i = 0; i < 100; i++) {
      values.add(rand(0, 100));
    }

    // Should generate at least 50 unique values out of 100 tries
    expect(values.size).toBeGreaterThan(50);
  });
});
