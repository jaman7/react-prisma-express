import { catchError, from, map, Observable, of } from 'rxjs';
import { apiProjects } from '../Projects.config';
import { IBoardProject } from '@/store/data.model';
import { IModalType } from '@/shared/model';
import { MODAL_TYPE } from '@/shared/enums';
import httpService from '@/core/http/http.service';

const { ADD } = MODAL_TYPE;

export const getProject = (id: string): Observable<IBoardProject> => {
  return from(httpService.get<IBoardProject>(`${apiProjects}/${id}`, {})).pipe(
    map((response) => {
      return response ?? {};
    }),
    catchError((error) => {
      console.error('Error fetching project:', error);
      return of({});
    })
  );
};

export const saveProject = (data: IBoardProject, modalType: IModalType): Observable<IBoardProject> => {
  const url = modalType === ADD ? `${apiProjects}` : `${apiProjects}/${data.id}`;
  return from(httpService[modalType === ADD ? 'post' : 'put']<IBoardProject, any>(url, data)).pipe(
    map((response) => {
      return response ?? {};
    }),
    catchError((error) => {
      console.error('Error create project:', error);
      return of({});
    })
  );
};
