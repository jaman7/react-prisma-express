import { catchError, from, map, Observable, of } from 'rxjs';
import { IBoardsDict } from '../model/dictionary';
import httpService from '@/core/http/http.service';

const http = httpService;

export const fetchUserBoardsDict$ = (userId: string): Observable<IBoardsDict[]> => {
  const url = `boards/dictionary/user/${userId}`;

  return from(http.get<IBoardsDict[]>(url, {}, { ignoreLoader: 'true' })).pipe(
    map((response) => {
      return response ?? [];
    }),
    catchError((error) => {
      console.error('Invalid response from FMP API:', error);
      return of([]);
    })
  );
};
