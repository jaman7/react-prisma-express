import HttpService from '@/core/http/http.service';
import { catchError, from, map, Observable, of } from 'rxjs';
import { IProjectActive } from '../model/project';
import httpService from '@/core/http/http.service';

const http = httpService;

export const updateActiveProjectIdHandler$ = (id: string): Observable<IProjectActive> => {
  const url = `users/me/activeProjectId`;

  return from(http.patch<IProjectActive, any>(url, { activeProjectId: id })).pipe(
    map((response) => {
      return response ?? {};
    }),
    catchError((error) => {
      console.error('Invalid response from upadate project Active API:', error);
      return of({});
    })
  );
};
