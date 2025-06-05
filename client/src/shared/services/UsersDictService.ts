import { catchError, from, map, Observable, of } from 'rxjs';
import { IDictType } from '../components/select/Select.model';
import httpService from '@/core/http/http.service';

const http = httpService;

export const fetchUsersDict$ = (): Observable<IDictType[]> => {
  const url = `users/dictionary`;

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
