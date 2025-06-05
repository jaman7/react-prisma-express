import { IParams } from '@/core/http/http.models';
import { IApiResponse } from '@/shared/model';
import { IUsers } from './UsersList.model';
import { apiUsers } from './UsersList.config';
import { catchError, from, map, Observable, of } from 'rxjs';
import httpService from '@/core/http/http.service';

const http = httpService;

export const getUsers = (params: IParams): Observable<IApiResponse<IUsers>> => {
  return from(http.get<IApiResponse<IUsers>>(apiUsers, params)).pipe(
    map((response) => {
      return response ?? {};
    }),
    catchError((error) => {
      console.error('Error fetching users:', error);
      return of({});
    })
  );
};
