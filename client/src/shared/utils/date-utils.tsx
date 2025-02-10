import { format, isDate, parseISO } from 'date-fns';
import { DATE_TIME_FORMAT } from '../enums';

export const dateFormat = (date: string | Date, formatStr: string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date; // Parsowanie stringa na Date
  return format(parsedDate, formatStr);
};

export const parseDate = (date: string | Date): Date => {
  if (isDate(date)) return date; // Jeśli to już obiekt Date
  return parseISO(date); // Parsowanie z formatu ISO (np. "2023-12-08T12:00:00Z")
};

export const dateIsoLocal = (date: string | null): Date | string | null => {
  const isoDate = date ? new Date(date)?.toISOString() : null;
  return isoDate ? dateFormat(isoDate, DATE_TIME_FORMAT.FNS_DATE_T_TIME) : null;
};

export const parseDateString = (dateString: string): Date => {
  return new Date(dateString);
};
