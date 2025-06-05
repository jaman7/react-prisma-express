import { renderHook } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { useFallbackTranslation } from '../useFallbackTranslation';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('useFallbackTranslation', () => {
  it('should return primary translation when available', () => {
    (useTranslation as jest.Mock).mockImplementation((ns: string) => {
      return {
        t: (key: string) => {
          if (ns === 'main') return `T(${key})`; // tPrimary zwraca tłumaczenie
          return `F(${key})`;
        },
      };
    });

    const { result } = renderHook(() => useFallbackTranslation('main'));

    expect(result.current.t('hello')).toBe('T(hello)');
  });

  it('should fallback to common if primary returns key', () => {
    (useTranslation as jest.Mock).mockImplementation((ns: string) => {
      return {
        t: (key: string) => {
          if (ns === 'main') return key; // brak tłumaczenia
          return `F(${key})`; // fallback tłumaczenie
        },
      };
    });

    const { result } = renderHook(() => useFallbackTranslation('main'));

    expect(result.current.t('missing')).toBe('F(missing)');
  });
});
