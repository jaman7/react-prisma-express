export function preparedHttpParamsValue(value: any): string {
  if (value instanceof String) return value.toString();
  if (Array.isArray(value)) return value.join('&');

  return value.toString();
}

export function toHttpParams<T>(data: T): URLSearchParams {
  const params = new URLSearchParams();
  if (!data) return params;

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      params.append(key, value.join(','));
    } else if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  return params;
}

export const buildQueryString = (params: Record<string, any>): string => {
  const encode = (key: string, value: any): string => {
    if (Array.isArray(value)) {
      // Obsługa tablic: key=value1&key=value2
      return value.map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&');
    }
    if (typeof value === 'object' && value !== null) {
      // Obsługa zagnieżdżonych obiektów: key[nestedKey]=value
      return Object.entries(value)
        .map(([nestedKey, nestedValue]) => encode(`${key}[${nestedKey}]`, nestedValue))
        .join('&');
    }
    // Domyślne kodowanie: key=value
    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  };

  // Przetwórz obiekt params i zbuduj query string
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null) // Ignoruj null/undefined
    .map(([key, value]) => encode(key, value))
    .join('&');
};
