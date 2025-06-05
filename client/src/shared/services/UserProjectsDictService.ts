import { catchError, from, map, Observable, of } from 'rxjs';
import { IDictType } from '../components/select/Select.model';
import httpService from '@/core/http/http.service';

const http = httpService;

export const fetchUserProjectsDict$ = (userId: string): Observable<IDictType[]> => {
  const url = `projects/dictionary/user/${userId}`;

  return from(http.get<IDictType[]>(url, {}, { ignoreLoader: 'true' })).pipe(
    map((response) => {
      return response ?? [];
    }),
    catchError((error) => {
      console.error('Invalid response from FMP API:', error);
      return of([]);
    })
  );
};
