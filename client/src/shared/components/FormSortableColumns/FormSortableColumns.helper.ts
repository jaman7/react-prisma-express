export const normalizeStatus = (name: string): string => name.toUpperCase().replace(/\s+/g, '_');

export const getStatusDisplayName = (status: string): string => status.replace(/_/g, ' ').toUpperCase();
