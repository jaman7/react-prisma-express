import { catchError, from, map, Observable, of } from 'rxjs';
import { apiProjects } from '../Projects.config';
import { IBoardProject } from '@/store/data.model';
import httpService from '@/core/http/http.service';

export const getProjectUsers = (id: string): Observable<IBoardProject> => {
  return from(httpService.get<IBoardProject>(`${apiProjects}/users/${id}`, {})).pipe(
    map((response) => {
      return response ?? {};
    }),
    catchError((error) => {
      console.error('Error fetching project users:', error);
      return of({});
    })
  );
};

export const updateProjectUsers = (id: string, ids: string[]): Observable<IBoardProject> => {
  return from(httpService.put<IBoardProject, any>(`${apiProjects}/users/${id}`, { userIds: ids })).pipe(
    map((response) => {
      return response ?? {};
    }),
    catchError((error) => {
      console.error('Error update project users:', error);
      return of({});
    })
  );
};
