import { catchError, from, map, Observable, of } from 'rxjs';
import { IProjectDict } from '../model/dictionary';
import httpService from '@/core/http/http.service';

const http = httpService;

export const fetchProjectsDict$ = (): Observable<IProjectDict[]> => {
  const url = `projects/dictionary`;

  return from(http.get<IProjectDict[]>(url, {})).pipe(
    map((response) => {
      return response ?? [];
    }),
    catchError((error) => {
      console.error('Invalid response from FMP API:', error);
      return of([]);
    })
  );
};
