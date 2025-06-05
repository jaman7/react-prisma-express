export const areArraysEqual = (a: string[] = [], b: string[] = []) => a.length === b.length && a.every((v, i) => v === b[i]);
