import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

type TranslationFunction = (key: string, options?: any) => string;

const getNamespaceFromPath = (pathname: string): string => {
  if (pathname === '/') return 'dashboard';
  if (pathname.startsWith('/project/')) return 'dashboard';
  if (pathname.startsWith('/boards')) return 'task-details';
  if (pathname.startsWith('/projects')) return 'projects';
  if (pathname.startsWith('/users-list')) return 'users-list';
  if (pathname.startsWith('/user-profile')) return 'user-profile';
  return 'common';
};

export const useFallbackTranslation = (fallbackNs = 'common'): { t: TranslationFunction } => {
  const location = useLocation();
  const ns = useMemo(() => getNamespaceFromPath(location.pathname), [location.pathname]);

  const { t: tPrimary } = useTranslation(ns);
  const { t: tFallback } = useTranslation(fallbackNs);

  const t: TranslationFunction = (key, options) => {
    const result = tPrimary(key, options);
    return result === key ? tFallback(key, options).toString() : result.toString();
  };

  return { t };
};
