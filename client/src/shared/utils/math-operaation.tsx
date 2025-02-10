export const mathOperation = (a: number | null | undefined, b: number | null | undefined, isIncrement = true): number => {
  const sanitizeNumber = (x: number | null | undefined): number => (Number.isFinite(x) ? (x as number) : 0);
  const sanitizedA = sanitizeNumber(a);
  const sanitizedB = sanitizeNumber(b);
  const getPrecision = (x: number): number => (x % 1 !== 0 ? x.toString().split('.')[1]?.length || 0 : 0);
  const maxPrecision = Math.max(getPrecision(sanitizedA), getPrecision(sanitizedB));
  const result = isIncrement ? sanitizedA + sanitizedB : sanitizedA - sanitizedB;
  return parseFloat(result.toFixed(maxPrecision));
};

export const isNumeric = <T,>(value: T): boolean =>
  typeof value === 'number'
    ? !isNaN(value as unknown as number)
    : typeof value === 'string'
      ? !isNaN(Number(value)) && !isNaN(parseFloat(value))
      : false;
