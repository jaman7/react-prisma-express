import HttpService from '@/core/http/http.service';
import { IApiResponse, IProject } from './Projects.model';
import { apiProjects } from './Projects.config';
import { IParams } from '@/core/http/http.models';

const http = new HttpService();

export const getProjects = (params: IParams): Promise<IApiResponse<IProject>> => {
  return new Promise((resolve, reject) => {
    http
      .get<IApiResponse<IProject>>(apiProjects, params)
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error('Error fetching project:', error);
        reject(error);
      });
  });
};

export const getProject = (id: number): Promise<IProject> => {
  return new Promise((resolve, reject) => {
    http
      .get<IProject>(`${apiProjects}${id}`)
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error('Error fetching project:', error);
        reject(error);
      });
  });
};
