import httpService from '@/core/http/http.service';
import { IBoardTask } from '@/store/data.model';
import { catchError, from, map, Observable, of } from 'rxjs';

const http = httpService;

export const updateTaskStatus$ = (id: string, data: Partial<IBoardTask>): Observable<IBoardTask> => {
  const url = `tasks/${id}/status`;

  return from(http.patch<IBoardTask, any>(url, data)).pipe(
    map((response) => {
      return response ?? {};
    }),
    catchError((error) => {
      console.error('Invalid response from upadate project Active API:', error);
      return of({});
    })
  );
};

export const updateTaskPosition$ = (id: string, data: Partial<IBoardTask>): Observable<IBoardTask> => {
  const url = `tasks/${id}/position`;

  return from(http.patch<IBoardTask, any>(url, data)).pipe(
    map((response) => {
      return response ?? {};
    }),
    catchError((error) => {
      console.error('Invalid response from upadate project Active API:', error);
      return of({});
    })
  );
};
