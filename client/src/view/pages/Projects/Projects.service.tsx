import { IProject } from './Projects.model';
import { apiProjects } from './Projects.config';
import { IParams } from '@/core/http/http.models';
import { IApiResponse } from '@/shared/model';
import { catchError, from, map, Observable, of } from 'rxjs';
import httpService from '@/core/http/http.service';

const handleRequest = <T,>(observable: Observable<T>) =>
  observable.pipe(
    map((response) => response ?? {}),
    catchError((error) => {
      console.error('Request failed:', error);
      return of({} as T);
    })
  );

export const getProjects = (params: IParams): Observable<IApiResponse<IProject>> => {
  return handleRequest(from(httpService.get<IApiResponse<IProject>>(apiProjects, params)));
};

export const deleteProject = (id: string): Observable<Record<string, string>> => {
  return handleRequest(from(httpService.delete<Record<string, string>>(`${apiProjects}/${id}`)));
};
