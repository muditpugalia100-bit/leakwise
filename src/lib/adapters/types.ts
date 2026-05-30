import type { LeakSummary } from "../types";

/**
 * Every data source plugs into this shape.
 * MockAdapter returns dummy data; WireAdapter calls Wire by Anakin.
 */
export interface LeakDetector<T> {
  fetch(userId: string): Promise<T[]>;
  calculateLeak(items: T[]): LeakSummary;
}
