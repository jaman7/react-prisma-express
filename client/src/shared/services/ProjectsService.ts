import httpService from '@/core/http/http.service';
import { IBoardProject } from '@/store/data.model';
import { catchError, from, map, Observable, of } from 'rxjs';

const http = httpService;

export const fetchProjects$ = (id: string): Observable<IBoardProject[]> => {
  const url = `projects/user/${id}`;

  return from(http.get<IBoardProject[]>(url, {})).pipe(
    map((response) => {
      return response ?? {};
    }),
    catchError((error) => {
      console.error('Invalid response from FMP API:', error);
      return of([]);
    })
  );
};

export const fetchProject$ = (id: string): Observable<IBoardProject> => {
  const url = `projects/${id}`;

  return from(http.get<IBoardProject>(url, {})).pipe(
    map((response) => {
      return response ?? {};
    }),
    catchError((error) => {
      console.error('Invalid response from FMP API:', error);
      return of({});
    })
  );
};
