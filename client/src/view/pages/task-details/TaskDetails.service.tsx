import HttpService from '@/core/http/http.service';
import { IBoardTask } from '@/store/data.model';
import { apiTasks } from './TaskDetails.config';
import { UniqueIdentifier } from '@dnd-kit/core';

const http = new HttpService();

export const getTask = (id: UniqueIdentifier): Promise<IBoardTask> => {
  return new Promise((resolve, reject) => {
    http
      .get<IBoardTask>(`${apiTasks}/${id}`)
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const newTask = (data: Partial<IBoardTask>): Promise<IBoardTask> => {
  return new Promise((resolve, reject) => {
    http
      .post<IBoardTask, Partial<IBoardTask>>(apiTasks, data)
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
