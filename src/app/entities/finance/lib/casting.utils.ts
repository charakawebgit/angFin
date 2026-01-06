/**
 * Shared casting and validation utilities for the Calculator engine layer.
 * Consolidates common logic used by form and results components.
 */

/**
 * Safely casts a value to a number, returning 0 as a fallback.
 */
export function castToNumber(val: unknown): number {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') return parseFloat(val) || 0;
    return 0;
}

/**
 * Safely casts a value to a string or number array.
 */
export function asList(val: unknown): (string | number)[] {
    return Array.isArray(val) ? (val as (string | number)[]) : [];
}

/**
 * Safely casts a value to a generic array.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function castToArray(val: unknown): any[] {
    return Array.isArray(val) ? val : [];
}
