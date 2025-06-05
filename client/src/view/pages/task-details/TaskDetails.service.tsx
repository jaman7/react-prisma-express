import { IBoardTask } from '@/store/data.model';
import { apiTasks } from './TaskDetails.config';
import { UniqueIdentifier } from '@dnd-kit/core';
import { catchError, from, map, Observable, of } from 'rxjs';
import httpService from '@/core/http/http.service';

const http = httpService;

export const getTask = (id: UniqueIdentifier): Observable<IBoardTask> => {
  return from(http.get<IBoardTask>(`${apiTasks}/${id}`, {})).pipe(
    map((response) => {
      return response ?? {};
    }),
    catchError((error) => {
      console.error('Error fetching projects:', error);
      return of({});
    })
  );
};

// export const newTask = (data: Partial<IBoardTask>): Promise<IBoardTask> => {
//   return new Promise((resolve, reject) => {
//     http
//       .post<IBoardTask, Partial<IBoardTask>>(apiTasks, data)
//       .then((data) => {
//         resolve(data);
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };

export const newTask = (data: Partial<IBoardTask>): Observable<IBoardTask> => {
  return from(http.post<IBoardTask, Partial<IBoardTask>>(apiTasks, data)).pipe(
    map((response) => {
      return response ?? {};
    }),
    catchError((error) => {
      console.error('Error fetching projects:', error);
      return of(error);
    })
  );
};
